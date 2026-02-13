
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { QuestionRenderer } from "./question-renderer"
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface DiagnosticRunnerProps {
    diagnostic: {
        id: string
        title: string
        questions: any[]
    }
}

export function DiagnosticRunner({ diagnostic }: DiagnosticRunnerProps) {
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const questions = diagnostic.questions
    const currentQuestion = questions[currentIndex]
    const progress = ((currentIndex + 1) / questions.length) * 100

    const handleAnswerChange = (val: any) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: val
        }))
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/diagnostics/${diagnostic.id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers })
            })

            if (!res.ok) throw new Error("Error submitting")

            const data = await res.json()
            router.push(`/diagnosticos/${diagnostic.id}/resultado`)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Error al enviar el diagnóstico. Por favor intenta de nuevo.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const isCurrentAnswered = answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== ''
    const allAnswered = questions.every(q => answers[q.id] !== undefined && answers[q.id] !== '')

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <div className="mb-8 space-y-4">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Pregunta {currentIndex + 1} de {questions.length}</span>
                    <span>{Math.round(progress)}% completado</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <Card className="min-h-[400px] flex flex-col shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl leading-relaxed">
                        {currentQuestion.question}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pt-6">
                    <QuestionRenderer
                        question={currentQuestion}
                        value={answers[currentQuestion.id]}
                        onChange={handleAnswerChange}
                    />
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/10 p-6">
                    <Button
                        variant="outline"
                        onClick={handlePrev}
                        disabled={currentIndex === 0 || isSubmitting}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Anterior
                    </Button>

                    {currentIndex === questions.length - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={!allAnswered || isSubmitting}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isSubmitting ? 'Enviando...' : 'Entregar Diagnóstico'}
                            {!isSubmitting && <CheckCircle2 className="ml-2 h-4 w-4" />}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            disabled={!isCurrentAnswered || isSubmitting}
                        >
                            Siguiente
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
