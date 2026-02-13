"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Clock, PlayCircle, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

interface Evaluation {
    id: string
    title: string
    description: string | null
    type: "QUIZ" | "PRACTICE" | "SELF_ASSESSMENT" | "FINAL_EXAM"
    passingScore: number
    attempts: number
    timeLimit: number | null
}

interface EvaluationTriggerProps {
    evaluation: Evaluation
    userId: string
    lessonId: string
}


export function EvaluationTrigger({ evaluation, userId, lessonId }: EvaluationTriggerProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [submission, setSubmission] = useState<any>(null)
    const [attemptsUsed, setAttemptsUsed] = useState(0)

    useEffect(() => {
        fetchStatus()
    }, [evaluation.id]) // Refetch when runner closes

    const fetchStatus = async () => {
        try {
            const res = await fetch(`/api/evaluations/${evaluation.id}?userId=${userId}`)
            const data = await res.json()
            if (data.submission) setSubmission(data.submission)
            setAttemptsUsed(data.attemptsUsed || 0)
        } catch (error) {
            console.error("Error fetching evaluation status:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStart = () => {
        router.push(`/evaluations/${evaluation.id}`)
    }

    const handleRunnerComplete = (result: any) => {
        // Optional: Trigger celebration or update parent state
        fetchStatus()
    }

    if (loading) return <div>Cargando evaluación...</div>

    const isPassed = submission?.passed
    const attemptsLeft = evaluation.attempts - attemptsUsed
    const canRetry = !isPassed && attemptsLeft > 0

    const getTypeColor = (type: string) => {
        switch (type) {
            case "QUIZ": return "bg-blue-500"
            case "PRACTICE": return "bg-green-500"
            case "FINAL_EXAM": return "bg-red-500"
            default: return "bg-gray-500"
        }
    }

    return (
        <Card className="w-full border-l-4 border-l-primary shadow-md">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <Badge className={`mb-2 ${getTypeColor(evaluation.type)} text-white hover:${getTypeColor(evaluation.type)}`}>
                            {evaluation.type.replace("_", " ")}
                        </Badge>
                        <CardTitle className="text-xl">{evaluation.title}</CardTitle>
                        <CardDescription>{evaluation.description}</CardDescription>
                    </div>
                    {isPassed ? (
                        <div className="flex flex-col items-end text-green-600">
                            <CheckCircle className="h-8 w-8 mb-1" />
                            <span className="font-bold">Aprobado</span>
                            <span className="text-sm">{submission.score}%</span>
                        </div>
                    ) : (
                        <div className="text-right text-sm text-gray-500">
                            <div>Intentos: {attemptsUsed} / {evaluation.attempts}</div>
                            {evaluation.timeLimit && (
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    <Clock className="h-3 w-3" />
                                    {evaluation.timeLimit} min
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Mínimo para aprobar: {evaluation.passingScore}%</span>
                </div>
            </CardContent>
            <CardFooter className="pt-2">
                {isPassed ? (
                    <Button variant="outline" className="w-full">
                        Ver Resultados
                    </Button>
                ) : canRetry ? (
                    <Button onClick={handleStart} className="w-full">
                        {attemptsUsed > 0 ? (
                            <>
                                <RotateCcw className="mr-2 h-4 w-4" /> Reintentar ({attemptsLeft} restantes)
                            </>
                        ) : (
                            <>
                                <PlayCircle className="mr-2 h-4 w-4" /> Comenzar Evaluación
                            </>
                        )}
                    </Button>
                ) : (
                    <div className="w-full bg-red-50 p-3 rounded-md flex items-center gap-2 text-red-600 border border-red-200">
                        <AlertCircle className="h-5 w-5" />
                        <span>Has agotado tus intentos. Contacta a tu profesor.</span>
                    </div>
                )}
            </CardFooter>

        </Card>
    )
}
