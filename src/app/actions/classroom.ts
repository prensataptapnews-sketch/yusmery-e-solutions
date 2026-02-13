"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getCourseContent(courseId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                modules: {
                    orderBy: { order: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                            include: {
                                progress: {
                                    where: { userId: session.user.id }
                                },
                                evaluations: {
                                    include: {
                                        submissions: {
                                            where: { userId: session.user.id }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                enrollments: {
                    where: { userId: session.user.id }
                }
            }
        })

        if (!course) return { error: "Course not found" }

        // Check enrollment
        if (course.enrollments.length === 0) {
            return { error: "Not enrolled" }
        }

        return { success: true, course }
    } catch (error) {
        console.error("Get Course Content Error:", error)
        return { error: "Failed to load course content" }
    }
}

export async function getLessonResources(lessonId: string) {
    try {
        const resources = await prisma.resource.findMany({
            where: { lessonId },
            orderBy: { createdAt: 'asc' }
        })
        return { success: true, resources }
    } catch (error) {
        return { error: "Failed to load resources" }
    }
}

export async function getLessonComments(lessonId: string) {
    try {
        const comments = await prisma.comment.findMany({
            where: { lessonId },
            include: {
                user: {
                    select: { name: true, avatar: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, comments }
    } catch (error) {
        return { error: "Failed to load comments" }
    }
}

export async function addComment(lessonId: string, content: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                lessonId,
                userId: session.user.id
            },
            include: {
                user: {
                    select: { name: true, avatar: true }
                }
            }
        })
        revalidatePath(`/classroom/courses`)
        return { success: true, comment }
    } catch (error) {
        return { error: "Failed to add comment" }
    }
}


export async function markLessonComplete(lessonId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const userId = session.user.id

        // 1. Mark Lesson as Complete
        await prisma.progress.upsert({
            where: {
                userId_lessonId: { userId, lessonId }
            },
            update: { completed: true, completedAt: new Date() },
            create: {
                userId,
                lessonId,
                completed: true,
                completedAt: new Date(),
                timeSpent: 0
            }
        })

        // 2. Fetch Course ID from Lesson
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { module: { select: { courseId: true } } }
        })

        if (!lesson) return { error: "Lesson not found" }
        const courseId = lesson.module.courseId

        // 3. Calculate Progress
        // Count all lessons in course
        const totalLessons = await prisma.lesson.count({
            where: { module: { courseId } }
        })

        // Count completed lessons for this user in this course
        const completedLessons = await prisma.progress.count({
            where: {
                userId,
                completed: true,
                lesson: { module: { courseId } }
            }
        })

        const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
        const isCompleted = progress === 100

        // 4. Update Enrollment
        await prisma.enrollment.update({
            where: {
                userId_courseId: { userId, courseId }
            },
            data: {
                progress,
                updatedAt: new Date(),
                ...(isCompleted ? { completedAt: new Date(), status: 'COMPLETED' } : {})
            }
        })

        revalidatePath(`/classroom/courses`)
        revalidatePath("/dashboard")
        revalidatePath("/certificates")

        return { success: true, progress }
    } catch (error) {
        console.error("Mark Complete Error:", error)
        return { error: "Failed to update progress" }
    }
}
