"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getEvaluationForTaking, submitEvaluation } from "@/app/actions/evaluations"
import { QuestionRenderer } from "@/components/classroom/evaluations/question-renderer"
import { useTimer } from "@/hooks/use-timer"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Timer, CheckCircle2, XCircle } from "lucide-react"

export default function ExamRunnerPage({ params }: { params: { evaluationId: string } }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [evaluation, setEvaluation] = useState<any>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [result, setResult] = useState<any>(null) // { passed, score, percentage }

    // Fetch Data
    useEffect(() => {
        getEvaluationForTaking(params.evaluationId).then((data: any) => { // Type 'any' to avoid strict TS here for speed, ideally proper type
            if (!data) {
                toast.error("Evaluación no encontrada")
                router.back()
                return
            }
            if (data.error) {
                toast.error(data.error) // Max attempts
                router.back() // Or redirect to result view?
                return
            }
            setEvaluation(data)
            setLoading(false)
        })
    }, [params.evaluationId, router])

    // Timer Logic (Initialize only when evaluation loaded)
    const timeLimitSeconds = evaluation?.timeLimit ? evaluation.timeLimit * 60 : 0
    const { seconds, formatted } = useTimer(timeLimitSeconds || 3600, () => {
        if (!result && !loading) {
            handleFinish()
            toast.info("Tiempo agotado. Entregando respuestas...")
        }
    })

    const handleAnswer = (val: any) => {
        const currentQ = evaluation.questions[currentQuestionIndex]
        setAnswers(prev => ({ ...prev, [currentQ.id]: val }))
    }

    const handleNext = () => {
        if (currentQuestionIndex < evaluation.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        } else {
            handleFinish()
        }
    }

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1)
        }
    }

    const handleFinish = async () => {
        setSubmitting(true)
        try {
            const res = await submitEvaluation(params.evaluationId, answers)
            if (res.error) {
                toast.error(res.error)
            } else {
                setResult(res) // Show result screen
            }
        } catch (error) {
            toast.error("Error al enviar")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    // Result Screen
    if (result) {
        return (
            <div className="container max-w-2xl py-20">
                <Card className="text-center py-10">
                    <CardHeader>
                        <div className="mx-auto mb-4">
                            {result.passed ? (
                                <CheckCircle2 className="h-20 w-20 text-green-500" />
                            ) : (
                                <XCircle className="h-20 w-20 text-red-500" />
                            )}
                        </div>
                        <CardTitle className="text-3xl">
                            {result.passed ? "¡Aprobado!" : "No Aprobado"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-5xl font-bold">{Math.round(result.percentage)}%</div>
                        <p className="text-muted-foreground">
                            Puntuación: {result.score} / {result.maxScore}
                        </p>
                        {!result.passed && (
                            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
                                Necesitas un {evaluation.passingScore}% para aprobar.
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="justify-center gap-4">
                        <Button variant="outline" onClick={() => router.back()}>
                            Volver al Curso
                        </Button>
                        {!result.passed && (
                            <Button onClick={() => window.location.reload()}>
                                Reintentar
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // Exam Screen
    const currentQ = evaluation.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / evaluation.questions.length) * 100

    return (
        <div className="container max-w-3xl py-10 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{evaluation.title}</h1>
                    <p className="text-muted-foreground text-sm">Pregunta {currentQuestionIndex + 1} de {evaluation.questions.length}</p>
                </div>
                {evaluation.timeLimit && (
                    <div className={`flex items-center gap-2 font-mono text-xl font-bold ${seconds < 60 ? 'text-red-500 animate-pulse' : ''}`}>
                        <Timer className="h-5 w-5" />
                        {formatted}
                    </div>
                )}
            </div>

            <Progress value={progress} className="h-2" />

            {/* Question Card */}
            <Card className="min-h-[400px] flex flex-col justify-between">
                <CardContent className="pt-6">
                    <QuestionRenderer
                        question={currentQ}
                        currentAnswer={answers[currentQ.id]}
                        setAnswer={handleAnswer}
                        disabled={submitting}
                    />
                </CardContent>
                <CardFooter className="justify-between border-t pt-6 bg-muted/20">
                    <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0 || submitting}>
                        Anterior
                    </Button>
                    <Button onClick={handleNext} disabled={submitting}>
                        {currentQuestionIndex === evaluation.questions.length - 1 ? (
                            submitting ? <Loader2 className="animate-spin" /> : "Finalizar Evaluación"
                        ) : (
                            "Siguiente"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
