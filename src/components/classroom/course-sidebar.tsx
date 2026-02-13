"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { CheckCircle, Lock, PlayCircle, Circle } from "lucide-react"

interface Lesson {
    id: string
    title: string
    duration: number | null
    isCompleted: boolean
    isLocked?: boolean
}

interface Module {
    id: string
    title: string
    lessons: Lesson[]
}

interface CourseSidebarProps {
    courseTitle: string
    modules: Module[]
    currentLessonId: string
    onSelectLesson: (lessonId: string) => void
    progress: number
}

export function CourseSidebar({ courseTitle, modules, currentLessonId, onSelectLesson, progress }: CourseSidebarProps) {
    // Find the module containing the current lesson to open it by default
    const currentModuleId = modules.find(m => m.lessons.some(l => l.id === currentLessonId))?.id

    return (
        <div className="flex flex-col h-full border-r bg-muted/10">
            <div className="p-4 border-b bg-background">
                <h2 className="font-semibold text-lg line-clamp-1" title={courseTitle}>{courseTitle}</h2>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-xs font-mono">{Math.round(progress)}%</span>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <Accordion type="single" collapsible defaultValue={currentModuleId} className="w-full">
                    {modules.map((module, index) => (
                        <AccordionItem key={module.id} value={module.id} className="border-b">
                            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 text-sm font-medium">
                                <span className="text-left w-full flex items-center gap-2">
                                    <span className="text-muted-foreground font-normal opacity-70">
                                        Módulo {index + 1}:
                                    </span>
                                    {module.title}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-0">
                                <div className="flex flex-col">
                                    {module.lessons.map((lesson) => {
                                        const isCurrent = lesson.id === currentLessonId
                                        const isCompleted = lesson.isCompleted
                                        const isLocked = lesson.isLocked

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => !isLocked && onSelectLesson(lesson.id)}
                                                disabled={isLocked}
                                                className={cn(
                                                    "flex items-center gap-3 px-6 py-3 text-sm text-left transition-colors border-l-2",
                                                    isCurrent
                                                        ? "bg-blue-50/50 border-blue-500 text-blue-700"
                                                        : "border-transparent hover:bg-muted/50 text-foreground/80",
                                                    isLocked && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                                                ) : isCurrent ? (
                                                    <PlayCircle className="h-4 w-4 text-blue-500 shrink-0" />
                                                ) : isLocked ? (
                                                    <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                                                ) : (
                                                    <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                                                )}

                                                <div className="flex-1">
                                                    <p className={cn("line-clamp-2", isCompleted && "text-muted-foreground line-through decoration-transparent")}>
                                                        {lesson.title}
                                                    </p>
                                                    {lesson.duration && (
                                                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                                                            {lesson.duration} min
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </ScrollArea>
        </div>
    )
}
