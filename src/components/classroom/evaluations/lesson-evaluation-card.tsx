import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, PlayCircle, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Props {
    evaluation: {
        id: string
        title: string
        description: string | null
        timeLimit: number | null
        attempts: number
    }
    isCompleted?: boolean
}

export function LessonEvaluationCard({ evaluation, isCompleted }: Props) {
    return (
        <Card className={cn("border-l-4 transition-all", isCompleted ? "border-l-green-500 bg-green-50/30" : "border-l-primary/50")}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <PlayCircle className="h-5 w-5 text-primary" />
                    )}
                    {isCompleted ? "Evaluación Completada" : "Evaluación Disponible"}: {evaluation.title}
                </CardTitle>
                <CardDescription>
                    {isCompleted
                        ? "Has aprobado esta evaluación satisfactoriamente."
                        : "Completa esta evaluación para demostrar tu comprensión del tema."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-6 text-sm text-muted-foreground">
                    {evaluation.timeLimit && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {evaluation.timeLimit} minutos
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        {evaluation.attempts} intentos permitidos
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                {isCompleted ? (
                    <Button variant="outline" asChild className="w-full sm:w-auto border-green-200 text-green-700 hover:bg-green-100">
                        <Link href={`/classroom/evaluations/${evaluation.id}/results`}>
                            Ver Resultados
                        </Link>
                    </Button>
                ) : (
                    <Button asChild className="w-full sm:w-auto">
                        <Link href={`/classroom/evaluations/${evaluation.id}/take`}>
                            Comenzar Evaluación
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

