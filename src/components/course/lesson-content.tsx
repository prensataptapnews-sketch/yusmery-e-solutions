import { EvaluationTrigger } from "@/components/course/evaluation-trigger"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ChevronRight, FileText, Download } from "lucide-react"

interface Evaluation {
    id: string
    title: string
    description: string | null
    type: "QUIZ" | "PRACTICE" | "SELF_ASSESSMENT" | "FINAL_EXAM"
    passingScore: number
    attempts: number
    timeLimit: number | null
}

interface LessonContentProps {
    title: string
    description?: string
    onNext?: () => void
    hasNext?: boolean
    lessonId: string
    evaluations: Evaluation[]
}

export function LessonContent({ title, description, onNext, hasNext, lessonId, evaluations }: LessonContentProps) {
    const { data: session } = useSession()

    return (
        <div className="mt-8 space-y-6 max-w-4xl mx-auto px-4 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
                <p className="text-muted-foreground leading-relaxed">
                    {description || "En esta lección aprenderás los conceptos fundamentales y las mejores prácticas relacionadas con este tema. Asegúrate de ver el video completo antes de continuar."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg border flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded text-blue-600">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-medium text-sm">Resumen de la Lección</div>
                        <div className="text-xs text-muted-foreground">PDF • 2.4 MB</div>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">
                        <Download className="h-4 w-4 opacity-50" />
                    </Button>
                </div>

                {/* Additional resource placeholder */}
            </div>

            {/* Evaluations */}
            {evaluations && evaluations.length > 0 && session?.user?.id && (
                <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-semibold">Evaluaciones</h3>
                    {evaluations.map(evaluation => (
                        <EvaluationTrigger
                            key={evaluation.id}
                            evaluation={evaluation}
                            userId={session.user.id!}
                            lessonId={lessonId}
                        />
                    ))}
                </div>
            )}

            {hasNext && (
                <div className="flex justify-end pt-8 border-t">
                    <Button onClick={onNext} className="gap-2">
                        Siguiente Lección
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}
