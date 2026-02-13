import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    try {
        const course = await prisma.course.findUnique({
            where: { slug },
            include: {
                modules: {
                    orderBy: { order: 'asc' }, // Assuming order field exists or we rely on insertion
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                            include: {
                                progress: {
                                    where: { userId }
                                },
                                evaluations: {
                                    include: {
                                        submissions: {
                                            where: {
                                                userId,
                                                passed: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!course) {
            return new NextResponse("Course Not Found", { status: 404 })
        }

        // Transform data to match frontend expectations and inject isLocked logic
        // We need to flatten lessons to determine locking status based on previous lesson
        const allLessons: any[] = []
        course.modules.forEach(mod => {
            mod.lessons.forEach(lesson => {
                allLessons.push({
                    ...lesson,
                    moduleId: mod.id
                })
            })
        })

        const modulesWithStatus = course.modules.map(mod => {
            return {
                id: mod.id,
                title: mod.title,
                lessons: mod.lessons.map(lesson => {
                    const progress = lesson.progress[0]
                    const isCompleted = progress?.completed || false

                    // Determine Locked Status
                    let isLocked = false
                    const currentIndex = allLessons.findIndex(l => l.id === lesson.id)

                    if (currentIndex > 0) {
                        const prevLesson = allLessons[currentIndex - 1]

                        // Check if previous lesson is completed
                        const prevProgress = prevLesson.progress[0]
                        if (!prevProgress?.completed) {
                            isLocked = true
                        } else {
                            // Check if previous lesson had evaluations and if they were passed
                            if (prevLesson.evaluations && prevLesson.evaluations.length > 0) {
                                // Assuming we block if ANY mandatory evaluation is not passed? 
                                // Or if the MAIN evaluation is not passed. 
                                // For now, if ANY evaluation exists, at least ONE passed submission must exist for it?
                                // Or all? Usually one evaluation per lesson.
                                const hasPassed = prevLesson.evaluations.every((ev: any) => ev.submissions.length > 0)
                                if (!hasPassed) {
                                    isLocked = true
                                }
                            }
                        }
                    }

                    return {
                        id: lesson.id,
                        title: lesson.title,
                        duration: lesson.duration || 0,
                        videoUrl: lesson.videoUrl || "",
                        completed: isCompleted,
                        isLocked: isLocked,
                        evaluations: lesson.evaluations.map(ev => ({
                            id: ev.id,
                            title: ev.title,
                            passed: ev.submissions.length > 0
                        }))
                    }
                })
            }
        })

        return NextResponse.json({
            id: course.id,
            title: course.title,
            modules: modulesWithStatus
        })

    } catch (error) {
        console.error("Error fetching course:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
