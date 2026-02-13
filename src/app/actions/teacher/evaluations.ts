"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function getTeacherSubmissions(filters?: {
    courseId?: string | "all"
    type?: string | "all"
    status?: string | "all" // "pending" | "reviewed" | "all"
}) {
    const session = await auth()

    // Ensure user is a teacher (or admin/super)
    if (!session?.user?.id || (session.user.role !== 'PROFESOR' && session.user.role !== 'ADMINISTRADOR' && session.user.role !== 'SUPER_ADMIN')) {
        return []
    }

    const teacherId = session.user.id

    try {
        const whereClause: any = {
            evaluation: {
                OR: [
                    // Evaluation linked directly to course (e.g. Final Exam)
                    {
                        course: {
                            OR: [
                                { teacherId: teacherId }, // Main teacher
                                { users: { some: { id: teacherId } } } // Co-teacher (if implemented via relation, but schema implies teacherId on Course)
                            ]
                        }
                    },
                    // Evaluation linked to lesson -> module -> course
                    {
                        lesson: {
                            module: {
                                course: {
                                    teacherId: teacherId
                                }
                            }
                        }
                    }
                ]
            }
        }

        // Apply Status Filter
        if (filters?.status === 'pending') {
            whereClause.reviewedBy = null
        } else if (filters?.status === 'reviewed') {
            whereClause.reviewedBy = { not: null }
        }

        // Apply Course Filter
        if (filters?.courseId && filters.courseId !== 'all') {
            whereClause.evaluation = {
                ...whereClause.evaluation,
                OR: [
                    { courseId: filters.courseId },
                    { lesson: { module: { courseId: filters.courseId } } }
                ]
            }
        }

        // Apply Type Filter
        if (filters?.type && filters.type !== 'all') {
            whereClause.evaluation = {
                ...whereClause.evaluation, // merge with existing course filter if any
                type: filters.type
            }
            // Note: If both course and type are present, we need to be careful with structure.
            // Prisma AND is implicit at top level.
            // But we have nested ORs for the path (Lesson vs Course).
            // Better strategy:
            // AND: [ { OR: [viaLesson, viaCourse] }, { type: filters.type } ]
        }

        // Refined Query Construction
        const finalWhere: any = {
            AND: [
                {
                    evaluation: {
                        OR: [
                            { course: { teacherId: teacherId } },
                            { lesson: { module: { course: { teacherId: teacherId } } } }
                        ]
                    }
                }
            ]
        }

        if (filters?.status === 'pending') finalWhere.reviewedBy = null
        if (filters?.status === 'reviewed') finalWhere.reviewedBy = { not: null }

        if (filters?.courseId && filters.courseId !== 'all') {
            finalWhere.AND.push({
                evaluation: {
                    OR: [
                        { courseId: filters.courseId },
                        { lesson: { module: { courseId: filters.courseId } } }
                    ]
                }
            })
        }

        if (filters?.type && filters.type !== 'all') {
            finalWhere.AND.push({
                evaluation: {
                    type: filters.type as any
                }
            })
        }


        const submissions = await prisma.evaluationSubmission.findMany({
            where: finalWhere,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                evaluation: {
                    select: {
                        id: true,
                        title: true,
                        type: true,
                        course: { select: { id: true, title: true } },
                        lesson: {
                            select: {
                                id: true,
                                title: true,
                                module: { select: { course: { select: { id: true, title: true } } } }
                            }
                        }
                    }
                }
            },
            orderBy: {
                submittedAt: 'desc'
            }
        })

        // Normalize data for frontend
        return submissions.map(sub => {
            const courseTitle = sub.evaluation.course?.title || sub.evaluation.lesson?.module?.course?.title || "Sin Curso"
            const courseId = sub.evaluation.course?.id || sub.evaluation.lesson?.module?.course?.id

            return {
                id: sub.id,
                student: {
                    name: sub.user.name || sub.user.email,
                    avatar: sub.user.avatar,
                    email: sub.user.email
                },
                evaluation: {
                    title: sub.evaluation.title,
                    type: sub.evaluation.type,
                    maxScore: sub.maxScore // Use maxScore from submission
                },
                course: {
                    id: courseId as string,
                    title: courseTitle
                },
                score: sub.score,
                maxScore: sub.maxScore,
                percentage: sub.percentage,
                passed: sub.passed,
                status: sub.reviewedBy ? 'revisado' : 'pendiente',
                submittedAt: sub.submittedAt
            }
        })

    } catch (error) {
        console.error("Error fetching teacher submissions:", error)
        return []
    }
}

export async function getTeacherCourses() {
    const session = await auth()
    if (!session?.user?.id) return []

    // Fetch courses where user is teacher
    const courses = await prisma.course.findMany({
        where: { teacherId: session.user.id },
        select: { id: true, title: true }
    })
    return courses
}

export async function getSubmissionDetails(submissionId: string) {
    const session = await auth()
    if (!session?.user?.id || (session.user.role !== 'PROFESOR' && session.user.role !== 'ADMINISTRADOR' && session.user.role !== 'SUPER_ADMIN')) {
        return null
    }

    try {
        const submission = await prisma.evaluationSubmission.findUnique({
            where: { id: submissionId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                evaluation: {
                    include: {
                        questions: {
                            orderBy: { order: 'asc' }
                        },
                        course: { select: { id: true, title: true } },
                        lesson: {
                            select: {
                                id: true,
                                title: true,
                                module: { select: { course: { select: { id: true, title: true } } } }
                            }
                        }
                    }
                }
            }
        })

        if (!submission) return null

        // Check if teacher has access (optional but recommended)
        // For now, relying on role check, but ideally we check if course.teacherId === session.user.id

        const courseTitle = submission.evaluation.course?.title || submission.evaluation.lesson?.module?.course?.title || "Sin Curso"

        return {
            ...submission,
            courseTitle
        }

    } catch (error) {
        console.error("Error fetching submission details:", error)
        return null
    }
}
