import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { join } from "path"
import { mkdir } from "fs/promises"
import { generateCertificatePDF } from "@/lib/pdf-generator"

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await request.json()
        const { lessonId, completed, timeSpent } = body
        const userId = session.user.id

        // 1. Get Lesson and Course details
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                module: {
                    include: {
                        course: true
                    }
                }
            }
        })

        if (!lesson) {
            return new NextResponse("Lesson not found", { status: 404 })
        }

        const courseId = lesson.module.courseId

        // 2. Upsert Progress for this lesson
        await prisma.progress.upsert({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId
                }
            },
            update: {
                completed,
                timeSpent: { increment: timeSpent || 0 }, // Add time
                completedAt: completed ? new Date() : null
            },
            create: {
                userId,
                lessonId,
                completed,
                timeSpent: timeSpent || 0,
                completedAt: completed ? new Date() : null
            }
        })

        // 3. Recalculate Course Progress
        // Get total lessons
        const totalLessons = await prisma.lesson.count({
            where: {
                module: {
                    courseId: courseId
                }
            }
        })

        // Get completed lessons by user in this course
        const completedLessons = await prisma.progress.count({
            where: {
                userId: userId,
                completed: true,
                lesson: {
                    module: {
                        courseId: courseId
                    }
                }
            }
        })

        const percent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
        // Round to 1 decimal place if needed, but float is fine

        // 4. Update Enrollment
        // Find enrollment first to check status
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            },
            include: {
                course: true,
                user: true
            }
        })

        if (enrollment) {
            const updatedEnrollment = await prisma.enrollment.update({
                where: { id: enrollment.id },
                data: {
                    progress: percent,
                    updatedAt: new Date()
                }
            })

            // 5. Automatic Certificate Trigger (User Provided Logic)
            // 5. Automatic Certificate Trigger (User Provided Logic)
            if (percent >= 100 && enrollment.status !== 'COMPLETED') {
                // Actualizar a completado
                await prisma.enrollment.update({
                    where: { id: enrollment.id },
                    data: {
                        status: 'COMPLETED',
                        completedAt: new Date()
                    }
                });

                // Generar certificado automáticamente
                try {
                    const { generateCertificate } = await import('@/lib/certificate-generator');

                    const code = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

                    const certUrl = await generateCertificate({
                        userName: session.user.name || "Estudiante",
                        courseName: enrollment.course.title,
                        completionDate: new Date(),
                        code,
                        hours: enrollment.course.duration ? Math.round(enrollment.course.duration / 60) : 1
                    });

                    await prisma.certificate.create({
                        data: {
                            userId: session.user.id,
                            courseId: enrollment.courseId,
                            certificateUrl: certUrl,
                            code
                        }
                    });

                    console.log('✅ Certificado generado:', code);
                } catch (error) {
                    console.error('❌ Error generando certificado:', error);
                }
            }

            return NextResponse.json({
                success: true,
                progress: percent,
                completed: percent >= 100
            })
        } else {
            return new NextResponse("Enrollment not found", { status: 404 })
        }

    } catch (error) {
        console.error("[PROGRESS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
