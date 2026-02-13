
"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Clock, ChevronLeft, ChevronRight, Save } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Types matching API response
interface Question {
    id: string
    question: string
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "OPEN_TEXT"
    options: string[]
    points: number
    order: number
}

interface EvaluationData {
    id: string
    title: string
    description: string
    timeLimit: number | null // in minutes
    questions: Question[]
}

export default function EvaluationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()

    // State
    const [loading, setLoading] = useState(true)
    const [evaluation, setEvaluation] = useState<EvaluationData | null>(null)
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [currentIndex, setCurrentIndex] = useState(0)
    const [timeLeft, setTimeLeft] = useState<number | null>(null) // seconds
    const [submitting, setSubmitting] = useState(false)
    const [attemptsLeft, setAttemptsLeft] = useState(0)

    // Load Evaluation
    useEffect(() => {
        const fetchEvaluation = async () => {
            try {
                const res = await fetch(`/api/evaluations/${id}`)
                if (!res.ok) {
                    if (res.status === 403) {
                        toast.error("No tienes acceso o intentos restantes")
                        router.push("/dashboard")
                        return
                    }
                    throw new Error("Failed to load")
                }
                const data = await res.json()
                setEvaluation(data.evaluation)
                setAttemptsLeft(data.attemptsLeft)

                // Initialize timer if applicable
                if (data.evaluation.timeLimit) {
                    setTimeLeft(data.evaluation.timeLimit * 60)
                }

                // Load saved answers from localStorage if any
                const saved = localStorage.getItem(`eval_${id}_answers`)
                if (saved) {
                    setAnswers(JSON.parse(saved))
                }
            } catch (error) {
                toast.error("Error al cargar la evaluación")
            } finally {
                setLoading(false)
            }
        }
        fetchEvaluation()
    }, [id, router])

    // Timer Logic
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null || prev <= 0) {
                    clearInterval(timer)
                    handleSubmit(true) // Auto-submit
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    // Auto-save to localStorage
    useEffect(() => {
        if (Object.keys(answers).length > 0) {
            localStorage.setItem(`eval_${id}_answers`, JSON.stringify(answers))
        }
    }, [answers, id])

    // Prevent accidental exit
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = ""
        }
        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [])

    const handleAnswer = (value: any) => {
        if (!evaluation) return
        const currentQ = evaluation.questions[currentIndex]
        setAnswers(prev => ({
            ...prev,
            [currentQ.id]: value
        }))
    }

    const handleSubmit = async (auto = false) => {
        if (submitting) return
        if (!auto && !confirm("¿Estás seguro de que quieres finalizar la evaluación?")) return

        setSubmitting(true)
        try {
            const res = await fetch(`/api/evaluations/${id}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers })
            })

            if (!res.ok) throw new Error("Error submitting")

            const result = await res.json()

            // Clear local storage
            localStorage.removeItem(`eval_${id}_answers`)

            // Redirect to results
            router.push(`/evaluations/${result.submissionId}/resultado`)
        } catch (error) {
            toast.error("Error al enviar la evaluación. Intenta de nuevo.")
            setSubmitting(false)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    if (loading || !evaluation) {
        return <div className="flex h-screen items-center justify-center">Cargando evaluación...</div>
    }

    const currentQuestion = evaluation.questions[currentIndex]
    const progress = ((Object.keys(answers).length) / evaluation.questions.length) * 100

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                if (confirm("Si sales, se perderá tu progreso actual. ¿Salir?")) {
                                    router.back()
                                }
                            }}
                        >
                            Salir
                        </Button>
                        <h1 className="text-lg font-bold text-neutral-900 truncate max-w-[200px] md:max-w-md">
                            {evaluation.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-sm font-medium text-neutral-500">
                            Pregunta {currentIndex + 1} de {evaluation.questions.length}
                        </div>
                        {timeLeft !== null && (
                            <div className={cn(
                                "flex items-center gap-2 rounded-full px-3 py-1 font-mono text-sm font-bold",
                                timeLeft < 60 ? "bg-red-100 text-red-600" : "bg-neutral-100 text-neutral-700"
                            )}>
                                <Clock className="h-4 w-4" />
                                {formatTime(timeLeft)}
                            </div>
                        )}
                    </div>
                </div>
                {/* Progress Bar */}
                <Progress value={progress} className="h-1 w-full rounded-none bg-neutral-100" />
            </header>

            <main className="container mx-auto mt-8 flex max-w-5xl flex-col gap-8 px-4 md:flex-row">
                {/* Main Question Area */}
                <Card className="flex-1 shadow-md">
                    <CardContent className="p-6 md:p-10">
                        <div className="mb-6 flex items-start justify-between">
                            <span className="rounded-md bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700 uppercase">
                                {currentQuestion.type === "MULTIPLE_CHOICE" ? "Opción Múltiple" :
                                    currentQuestion.type === "TRUE_FALSE" ? "Verdadero / Falso" : "Texto Abierto"}
                            </span>
                            <span className="text-xs font-medium text-neutral-400">
                                {currentQuestion.points} pts
                            </span>
                        </div>

                        <h2 className="mb-8 text-xl font-medium text-neutral-800 md:text-2xl">
                            {currentQuestion.question}
                        </h2>

                        {/* Render Options */}
                        <div className="space-y-4">
                            {currentQuestion.type === "OPEN_TEXT" ? (
                                <textarea
                                    className="w-full rounded-md border p-4 text-neutral-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                    rows={5}
                                    placeholder="Escribe tu respuesta aquí..."
                                    value={answers[currentQuestion.id] || ""}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                />
                            ) : (
                                <div className="grid gap-3">
                                    {currentQuestion.options.map((option, idx) => {
                                        const isSelected = answers[currentQuestion.id] === option
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(option)}
                                                className={cn(
                                                    "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all hover:bg-neutral-50",
                                                    isSelected
                                                        ? "border-teal-500 bg-teal-50 text-teal-800 ring-1 ring-teal-500"
                                                        : "border-neutral-200 text-neutral-600"
                                                )}
                                            >
                                                <span className="flex items-center gap-3">
                                                    <span className={cn(
                                                        "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                                                        isSelected ? "border-teal-500 bg-teal-500 text-white" : "border-neutral-300 bg-white"
                                                    )}>
                                                        {String.fromCharCode(65 + idx)}
                                                    </span>
                                                    {option}
                                                </span>
                                                {isSelected && <CheckCircle className="h-5 w-5 text-teal-500" />}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar Navigation */}
                <aside className="w-full md:w-80">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="mb-4 text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                                Navegación
                            </h3>
                            <div className="grid grid-cols-5 gap-2">
                                {evaluation.questions.map((q, idx) => {
                                    const status = idx === currentIndex ? "current" : (answers[q.id] ? "answered" : "unanswered")
                                    return (
                                        <button
                                            key={q.id}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors",
                                                status === "current" && "bg-teal-600 text-white ring-2 ring-teal-200",
                                                status === "answered" && "bg-teal-100 text-teal-700",
                                                status === "unanswered" && "bg-neutral-100 text-neutral-400 hover:bg-neutral-200"
                                            )}
                                        >
                                            {idx + 1}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="mt-8 space-y-3">
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                    <div className="h-2 w-2 rounded-full bg-teal-600"></div> Actual
                                </div>
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                    <div className="h-2 w-2 rounded-full bg-teal-100"></div> Respondida
                                </div>
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                    <div className="h-2 w-2 rounded-full bg-neutral-100"></div> Sin responder
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </main>

            {/* Bottom Nav Bar */}
            <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
                <div className="container mx-auto flex max-w-5xl items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>

                    {currentIndex === evaluation.questions.length - 1 ? (
                        <Button
                            className="bg-teal-600 hover:bg-teal-700"
                            onClick={() => handleSubmit(false)}
                            disabled={submitting}
                        >
                            {submitting ? "Enviando..." : "Entregar Evaluación"}
                            <CheckCircle className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCurrentIndex(prev => Math.min(evaluation.questions.length - 1, prev + 1))}
                        >
                            Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
