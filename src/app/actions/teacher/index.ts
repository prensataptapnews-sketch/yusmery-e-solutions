"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function getTeacherCourses() {
    const session = await auth()
    if (!session?.user?.id) {
        return []
    }

    try {
        const courses = await prisma.course.findMany({
            where: {
                teacherId: session.user.id
            },
            include: {
                _count: {
                    select: {
                        enrollments: true,
                        modules: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        return courses
    } catch (error) {
        console.error("Error fetching teacher courses:", error)
        return []
    }
}

export async function getTeacherCourseDetails(courseId: string) {
    const session = await auth()
    if (!session?.user?.id) {
        return null
    }

    try {
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
                teacherId: session.user.id
            },
            include: {
                modules: {
                    orderBy: { order: 'asc' },
                    include: {
                        _count: {
                            select: { lessons: true }
                        }
                    }
                },
                enrollments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        modules: true
                    }
                }
            }
        })

        return course
    } catch (error) {
        console.error("Error fetching teacher course details:", error)
        return null
    }
}
export async function getTeacherStudents() {
    const session = await auth()
    if (!session?.user?.id) return []

    try {
        const enrollments = await prisma.enrollment.findMany({
            where: {
                course: {
                    teacherId: session.user.id
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                },
                course: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        return enrollments.map(e => ({
            id: e.user.id,
            name: e.user.name,
            email: e.user.email,
            course: e.course.title,
            progress: e.progress,
            lastActive: e.updatedAt,
            image: e.user.avatar
        }))
    } catch (error) {
        console.error("Error fetching teacher students:", error)
        return []
    }
}
