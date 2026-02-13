"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function getStudentDashboardData() {
    const session = await auth()
    if (!session?.user?.id) {
        return null
    }

    try {
        // Fetch User's Enrollments
        const enrollments = await prisma.enrollment.findMany({
            where: {
                userId: session.user.id,
                status: {
                    in: ["ACTIVE", "COMPLETED"]
                }
            },
            include: {
                course: {
                    include: {
                        _count: {
                            select: {
                                modules: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        // Calculate Stats
        const totalCourses = enrollments.length
        const completed = enrollments.filter(e => e.status === "COMPLETED").length
        const inProgress = enrollments.filter(e => e.status === "ACTIVE").length

        // Calculate Average Progress
        const totalProgress = enrollments.reduce((acc, curr) => acc + curr.progress, 0)
        const avgProgress = totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0

        // Format Courses for UI
        const courses = enrollments.map(enrollment => ({
            id: enrollment.course.id,
            title: enrollment.course.title,
            slug: enrollment.course.slug,
            thumbnail: enrollment.course.thumbnail,
            progress: enrollment.progress,
            status: enrollment.status,
            totalModules: enrollment.course._count.modules,
            lastAccessed: enrollment.updatedAt
        }))

        // Get Current Course
        const currentEnrollment = enrollments.find(e => e.status === "ACTIVE")
        const currentCourse = currentEnrollment ? {
            ...currentEnrollment.course,
            progress: currentEnrollment.progress,
            totalModules: currentEnrollment.course._count.modules
        } : null

        // Fetch Evaluation History (for Performance Analytics)
        const evaluationHistory = await prisma.evaluationSubmission.findMany({
            where: { userId: session.user.id },
            include: { evaluation: true },
            orderBy: { submittedAt: 'desc' },
            take: 10
        })

        // Fetch Upcoming Assessments (for Smart Agenda)
        const courseIds = enrollments.map(e => e.courseId)
        const upcomingEvaluations = await prisma.evaluation.findMany({
            where: {
                courseId: { in: courseIds },
                submissions: {
                    none: { userId: session.user.id }
                }
            },
            include: { course: true },
            take: 5
        })

        // Fetch Resources (for Resource Vault)
        const recentResources = await prisma.resource.findMany({
            where: {
                lesson: {
                    module: {
                        courseId: { in: courseIds }
                    }
                }
            },
            include: {
                lesson: {
                    include: {
                        module: {
                            include: {
                                course: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        })

        // Fetch Inquiries (for Tutor Hub)
        const recentInquiries = await prisma.inquiry.findMany({
            where: { studentId: session.user.id },
            include: {
                course: true,
                teacher: true
            },
            orderBy: { updatedAt: 'desc' },
            take: 3
        })

        return {
            currentCourse,
            courses,
            stats: {
                totalCourses,
                completed,
                inProgress,
                avgProgress
            },
            performance: evaluationHistory.map(h => ({
                name: h.submittedAt.toLocaleDateString('es-ES', { weekday: 'short' }),
                score: h.percentage,
                title: h.evaluation.title
            })),
            agenda: upcomingEvaluations.map(ev => ({
                id: ev.id,
                title: ev.title,
                course: ev.course?.title || "Curso",
                type: ev.type,
                deadline: "Próximamente"
            })),
            resources: recentResources.map(r => ({
                name: r.title,
                type: r.type,
                url: r.url,
                course: r.lesson.module.course.title,
                date: r.createdAt
            })),
            tutorMessages: recentInquiries.map(i => ({
                id: i.id,
                tutor: i.teacher?.name || "Tutor Académico",
                text: i.answer || i.question,
                time: i.updatedAt,
                status: i.answer ? "REPLIED" : "PENDING"
            })),
            achievements: [
                { id: 1, name: "Rayo", progress: 100, locked: false },
                { id: 2, name: "Explorador", progress: 65, locked: false }
            ]
        }
    } catch (error) {
        console.error("Dashboard data fetching error:", error)
        return null
    }
}
