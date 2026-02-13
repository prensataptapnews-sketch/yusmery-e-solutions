"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { ModuleSidebar } from "@/components/course/module-sidebar"
import { VideoPlayer } from "@/components/course/video-player"
import { LessonContent } from "@/components/course/lesson-content"
import { Loader2, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface Lesson {
    id: string
    title: string
    duration: number
    videoUrl: string
    completed: boolean
    isLocked: boolean
    evaluations?: any[] // Using any for simplicity in this MVP iteration, matching component interface
}

interface Module {
    id: string
    title: string
    lessons: Lesson[]
}

interface CourseData {
    id: string
    title: string
    modules: Module[]
}

export default function CoursePlayerPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const router = useRouter()
    const [course, setCourse] = useState<CourseData | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentLessonId, setCurrentLessonId] = useState<string | null>(null)
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`/api/courses/${slug}`)
                if (!res.ok) throw new Error("Course not found")
                const data = await res.json()
                setCourse(data)

                // Initialize with first incomplete or first lesson
                if (data.modules.length > 0) {
                    const firstModule = data.modules[0]
                    const firstLesson = firstModule.lessons[0]
                    setCurrentLessonId(firstLesson.id)
                    setCurrentVideoUrl(firstLesson.videoUrl)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchCourse()
    }, [slug])

    const handleLessonSelect = (lessonId: string, videoUrl: string) => {
        setCurrentLessonId(lessonId)
        setCurrentVideoUrl(videoUrl)
    }

    const handleLessonComplete = () => {
        if (!course || !currentLessonId) return

        // Optimistic update
        const updatedModules = course.modules.map(mod => ({
            ...mod,
            lessons: mod.lessons.map(les =>
                les.id === currentLessonId ? { ...les, completed: true } : les
            )
        }))
        setCourse({ ...course, modules: updatedModules })

        // Find next lesson to unlock logic could go here
    }

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!course) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center flex-col gap-4">
                <h2 className="text-xl font-semibold">Curso no encontrado</h2>
                <button onClick={() => router.push("/")} className="text-primary hover:underline">
                    Volver al Dashboard
                </button>
            </div>
        )
    }

    const currentLesson = course.modules
        .flatMap(m => m.lessons)
        .find(l => l.id === currentLessonId)

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-80 shrink-0 h-full border-r">
                <ModuleSidebar
                    modules={course.modules}
                    currentLessonId={currentLessonId || ""}
                    onSelectLesson={handleLessonSelect}
                />
            </div>

            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden absolute top-20 left-4 z-50">
                        <Menu className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                    <ModuleSidebar
                        modules={course.modules}
                        currentLessonId={currentLessonId || ""}
                        onSelectLesson={(id, url) => {
                            handleLessonSelect(id, url)
                            setSidebarOpen(false)
                        }}
                    />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background/50">
                <div className="w-full max-w-5xl mx-auto">
                    {/* Video Section */}
                    <div className="aspect-video bg-black w-full relative">
                        {currentLesson && (
                            <VideoPlayer
                                key={currentLesson.id} // Re-mount on lesson change
                                src={currentVideoUrl}
                                lessonId={currentLesson.id}
                                autoPlay={true}
                                onCompleted={handleLessonComplete}
                            />
                        )}
                        {/* Mobile Toggle Button (when sheet is closed) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden absolute top-4 left-4 z-40 text-white bg-black/50 hover:bg-black/70"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Lesson Details */}
                    {currentLesson && (
                        <LessonContent
                            title={currentLesson.title}
                            description={`Estás viendo el contenido de: ${currentLesson.title}. Completa este video para avanzar.`}
                            lessonId={currentLesson.id}
                            evaluations={currentLesson.evaluations || []}
                            onNext={() => {
                                // Logic for next button would go here
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
