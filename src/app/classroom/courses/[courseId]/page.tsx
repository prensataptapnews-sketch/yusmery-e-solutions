"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getCourseContent } from "@/app/actions/classroom"
import { CourseSidebar } from "@/components/classroom/course-sidebar"
import { LessonViewer } from "@/components/classroom/lesson-viewer"
import { Loader2 } from "lucide-react"

export default function CoursePlayerPage() {
    const params = useParams()
    const courseId = params.courseId as string
    const [course, setCourse] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [currentLessonId, setCurrentLessonId] = useState<string | null>(null)

    // Derived State
    const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const res = await getCourseContent(courseId)
                if (res.success && res.course) {
                    setCourse(res.course)

                    // Initialize Completed Lessons
                    const completedIds = new Set<string>()
                    let firstIncompleteId: string | null = null

                    res.course.modules.forEach((mod: any) => {
                        mod.lessons.forEach((lesson: any) => {
                            if (lesson.progress && lesson.progress.length > 0 && lesson.progress[0].completed) {
                                completedIds.add(lesson.id)
                            } else if (!firstIncompleteId) {
                                firstIncompleteId = lesson.id
                            }
                        })
                    })

                    setCompletedLessonIds(completedIds)

                    // Set initial lesson (continue where left off)
                    setCurrentLessonId(firstIncompleteId || res.course.modules[0]?.lessons[0]?.id)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        loadCourse()
    }, [courseId])

    if (loading) {
        return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
    }

    if (!course) {
        return <div className="p-8 text-center text-red-500">Error al cargar el curso. Intenta nuevamente o verifica tu inscripción.</div>
    }

    // Prepare Data for components
    const flatLessons: any[] = []
    const modulesWithStatus = course.modules.map((mod: any) => {
        const lessonsWithStatus = mod.lessons.map((lesson: any) => {
            flatLessons.push({ ...lesson, moduleId: mod.id })
            return {
                ...lesson,
                isCompleted: completedLessonIds.has(lesson.id),
                isLocked: false // Implement locking logic later if needed
            }
        })
        return { ...mod, lessons: lessonsWithStatus }
    })

    const currentIndex = flatLessons.findIndex(l => l.id === currentLessonId)
    const currentLesson = flatLessons[currentIndex]

    // Progress Calculation
    const totalLessons = flatLessons.length
    const completedCount = completedLessonIds.size
    const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0

    const handleLessonComplete = () => {
        if (currentLessonId) {
            setCompletedLessonIds(prev => new Set(prev).add(currentLessonId))
            // Auto advance
            if (currentIndex < flatLessons.length - 1) {
                setCurrentLessonId(flatLessons[currentIndex + 1].id)
            }
        }
    }

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 hidden lg:block h-full shrink-0">
                <CourseSidebar
                    courseTitle={course.title}
                    modules={modulesWithStatus}
                    currentLessonId={currentLessonId || ""}
                    onSelectLesson={setCurrentLessonId}
                    progress={progressPercentage}
                />
            </div>

            {/* Main Content */}
            <ScrollArea className="flex-1 bg-background h-full relative" hasScroll={true}>
                {currentLesson ? (
                    <LessonViewer
                        lesson={currentLesson}
                        isCompleted={completedLessonIds.has(currentLesson.id)}
                        onComplete={handleLessonComplete}
                        onNext={() => currentIndex < flatLessons.length - 1 && setCurrentLessonId(flatLessons[currentIndex + 1].id)}
                        onPrev={() => currentIndex > 0 && setCurrentLessonId(flatLessons[currentIndex - 1].id)}
                        hasNext={currentIndex < flatLessons.length - 1}
                        hasPrev={currentIndex > 0}
                        courseProgress={progressPercentage}
                        courseId={courseId}
                    />
                ) : (
                    <div className="p-12 text-center text-muted-foreground">Selecciona una lección para comenzar</div>
                )}
            </ScrollArea>
        </div>
    )
}

// Helper scroll area wrapper since pure div overflow might be tricky with some layout setups
function ScrollArea({ children, className }: { children: React.ReactNode, className?: string, hasScroll?: boolean }) {
    return (
        <div className={`overflow-y-auto ${className}`}>
            {children}
        </div>
    )
}
