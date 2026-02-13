"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface Question {
    id: string
    question: string
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "OPEN_TEXT"
    options: string // JSON string
    points: number
}

interface EvaluationRunnerProps {
    isOpen: boolean
    onClose: () => void
    evaluationId: string
    userId: string
    onComplete: (result: any) => void
}

export function EvaluationRunner({ isOpen, onClose, evaluationId, userId, onComplete }: EvaluationRunnerProps) {
    const [loading, setLoading] = useState(true)
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState<any>(null)

    useEffect(() => {
        if (isOpen && evaluationId) {
            fetchEvaluation()
        }
    }, [isOpen, evaluationId])

    const fetchEvaluation = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/evaluations/${evaluationId}?userId=${userId}`)
            const data = await res.json()
            if (data.evaluation && data.evaluation.questions) {
                setQuestions(data.evaluation.questions)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleAnswer = (value: string) => {
        const currentQ = questions[currentStep]
        setAnswers(prev => ({ ...prev, [currentQ.id]: value }))
    }

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            handleSubmit()
        }
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        try {
            const res = await fetch(`/api/evaluations/${evaluationId}/submit`, {
                method: "POST",
                body: JSON.stringify({ answers }),
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json()
            setResult(data)
            if (data.passed) {
                onComplete(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleClose = () => {
        setResult(null)
        setCurrentStep(0)
        setAnswers({})
        onClose()
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Evaluación</DialogTitle>
                    <DialogDescription>
                        Responde las siguientes preguntas.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : result ? (
                    <div className="text-center py-6 space-y-4">
                        {result.passed ? (
                            <div className="flex flex-col items-center text-green-600">
                                <CheckCircle className="h-16 w-16 mb-2" />
                                <h3 className="text-xl font-bold">¡Felicidades!</h3>
                                <p>Has aprobado con {result.score} puntos ({result.percentage.toFixed(0)}%)</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-red-600">
                                <XCircle className="h-16 w-16 mb-2" />
                                <h3 className="text-xl font-bold">No aprobado</h3>
                                <p>Tu puntuación: {result.score} ({result.percentage.toFixed(0)}%)</p>
                                <p className="text-sm text-gray-500 mt-2">Puedes intentarlo de nuevo si tienes intentos disponibles.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-4">
                        <div className="mb-4 flex justify-between text-sm text-muted-foreground">
                            <span>Pregunta {currentStep + 1} de {questions.length}</span>
                            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% completado</span>
                        </div>

                        {questions[currentStep] && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-lg">{questions[currentStep].question}</h3>

                                {questions[currentStep].type === "MULTIPLE_CHOICE" || questions[currentStep].type === "TRUE_FALSE" ? (
                                    <RadioGroup
                                        value={answers[questions[currentStep].id] || ""}
                                        onValueChange={handleAnswer}
                                    >
                                        {(() => {
                                            try {
                                                const opts = JSON.parse(questions[currentStep].options)
                                                return opts.map((opt: any) => (
                                                    <div key={opt.id} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50">
                                                        <RadioGroupItem value={opt.id} id={opt.id} />
                                                        <Label htmlFor={opt.id} className="flex-1 cursor-pointer">{opt.text}</Label>
                                                    </div>
                                                ))
                                            } catch (e) {
                                                return <div className="text-red-500">Error parsing options</div>
                                            }
                                        })()}
                                    </RadioGroup>
                                ) : (
                                    <textarea
                                        className="w-full border rounded-md p-2 min-h-[100px]"
                                        placeholder="Escribe tu respuesta aqui..."
                                        value={answers[questions[currentStep].id] || ""}
                                        onChange={(e) => handleAnswer(e.target.value)}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    {result ? (
                        <Button onClick={handleClose}>Cerrar</Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            disabled={!answers[questions[currentStep]?.id] || submitting}
                        >
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {currentStep === questions.length - 1 ? "Finalizar" : "Siguiente"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
