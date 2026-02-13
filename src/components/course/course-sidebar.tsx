'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, Circle, Lock, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock type for component props
type CourseModule = {
    id: string
    title: string
    lessons: {
        id: string
        title: string
        isCompleted: boolean
        isLocked: boolean
        isCurrent?: boolean
        duration: string
    }[]
}

interface CourseSidebarProps {
    modules: CourseModule[]
}

export function CourseSidebar({ modules }: CourseSidebarProps) {
    return (
        <div className="h-full border-r bg-background">
            <div className="p-4 font-semibold border-b">
                Contenido del Curso
            </div>
            <ScrollArea className="h-[calc(100vh-80px)]">
                <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                    {modules.map((module, index) => (
                        <AccordionItem key={module.id} value={`item-${index}`}>
                            <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-muted/50">
                                <span className="text-sm font-medium text-left">{module.title}</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-0 pb-0">
                                <div className="flex flex-col">
                                    {module.lessons.map((lesson) => (
                                        <button
                                            key={lesson.id}
                                            disabled={lesson.isLocked}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/50 w-full text-left",
                                                lesson.isCurrent && "bg-teal-50 border-r-2 border-primary text-primary hover:bg-teal-50",
                                                lesson.isLocked && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            {lesson.isCompleted ? (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            ) : lesson.isLocked ? (
                                                <Lock className="h-4 w-4 text-muted-foreground" />
                                            ) : lesson.isCurrent ? (
                                                <PlayCircle className="h-4 w-4 text-primary" />
                                            ) : (
                                                <Circle className="h-4 w-4 text-muted-foreground" />
                                            )}

                                            <div className="flex flex-col gap-0.5">
                                                <span className={cn("font-medium", lesson.isCompleted && "text-muted-foreground line-through")}>
                                                    {lesson.title}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">{lesson.duration}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </ScrollArea>
        </div>
    )
}
