"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, Lock, PlayCircle, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface Lesson {
    id: string
    title: string
    duration: number
    completed: boolean
    isLocked: boolean
}

interface Module {
    id: string
    title: string
    lessons: Lesson[]
}

interface ModuleSidebarProps {
    modules: Module[]
    currentLessonId: string
    onSelectLesson: (id: string, videoUrl: string) => void
}

export function ModuleSidebar({ modules, currentLessonId, onSelectLesson }: ModuleSidebarProps) {
    return (
        <div className="h-full flex flex-col bg-card border-r">
            <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">Contenido del Curso</h3>
                <div className="text-sm text-muted-foreground mt-1">
                    {modules.reduce((acc, m) => acc + m.lessons.filter(l => l.completed).length, 0)} / {modules.reduce((acc, m) => acc + m.lessons.length, 0)} lecciones completadas
                </div>
            </div>

            <ScrollArea className="flex-1">
                <Accordion type="multiple" defaultValue={modules.map(m => m.id)} className="w-full">
                    {modules.map((module) => (
                        <AccordionItem value={module.id} key={module.id}>
                            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline">
                                <span className="text-left font-medium">{module.title}</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-0 pb-0">
                                <div className="flex flex-col">
                                    {module.lessons.map((lesson) => {
                                        const LessonButton = (
                                            <button
                                                key={lesson.id}
                                                disabled={lesson.isLocked}
                                                onClick={() => onSelectLesson(lesson.id, "")} // Logic handled by parent for URL
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors border-l-2 border-transparent text-left",
                                                    currentLessonId === lesson.id
                                                        ? "bg-primary/10 border-primary text-primary font-medium"
                                                        : "hover:bg-muted/50 text-muted-foreground",
                                                    lesson.isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                                                )}
                                            >
                                                {lesson.completed ? (
                                                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                                                ) : lesson.isLocked ? (
                                                    <Lock className="h-4 w-4 shrink-0" />
                                                ) : currentLessonId === lesson.id ? (
                                                    <PlayCircle className="h-4 w-4 shrink-0 animate-pulse" />
                                                ) : (
                                                    <Circle className="h-4 w-4 shrink-0" />
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <div className="line-clamp-1">{lesson.title}</div>
                                                    <div className="text-xs opacity-70 mt-0.5">{lesson.duration} min</div>
                                                </div>
                                            </button>
                                        )

                                        if (lesson.isLocked) {
                                            return (
                                                <TooltipProvider key={lesson.id}>
                                                    <Tooltip delayDuration={0}>
                                                        <TooltipTrigger asChild>
                                                            {/* Wrap in div because disabled buttons don't trigger tooltips in some browsers */}
                                                            <div className="w-full cursor-not-allowed">
                                                                {LessonButton}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="right" className="max-w-[200px]">
                                                            <p>Debes aprobar la evaluación anterior para continuar</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )
                                        }

                                        return LessonButton
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
