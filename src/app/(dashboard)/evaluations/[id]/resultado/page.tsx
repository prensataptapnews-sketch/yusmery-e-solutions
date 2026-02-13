
"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, ArrowRight, RotateCcw, AlertTriangle, AlertCircle, MessageSquare } from "lucide-react"
import Link from "next/link"
import ReactConfetti from "react-confetti"
import { cn } from "@/lib/utils"
// import { useWindowSize } from "react-use" // Optional for confetti optimal size, but we can default to window

export default function EvaluationResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const submissionId = id
    const router = useRouter()

    // State
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        // Set window size for confetti
        setWindowSize({ width: window.innerWidth, height: window.innerHeight })

        async function fetchResult() {
            try {
                // Fetch submission details
                // Note: The route created was /api/submissions/[id]
                const subRes = await fetch(`/api/submissions/${submissionId}`)
                if (!subRes.ok) {
                    throw new Error("Failed to fetch submission")
                }
                const subData = await subRes.json()

                // Reconstruct Review Logic (Client-side display)
                const answers = JSON.parse(subData.answers || "{}")
                const questions = subData.evaluation?.questions || []

                const review = questions.map((q: any) => {
                    let userAnswer = answers[q.id]
                    let correctAnswer = q.correctAnswer

                    try {
                        if (correctAnswer.startsWith('"') || correctAnswer.startsWith('[')) {
                            correctAnswer = JSON.parse(correctAnswer)
                        }
                    } catch { }

                    let isCorrect = false
                    if (q.type === "MULTIPLE_CHOICE" || q.type === "TRUE_FALSE") {
                        isCorrect = userAnswer === correctAnswer
                    } else {
                        isCorrect = String(userAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase()
                    }

                    return {
                        ...q,
                        userAnswer,
                        correctAnswer,
                        isCorrect,
                        explanation: q.explanation
                    }
                })

                // Calculate attempts (approximate since we don't have attemptsLeft directly on submission)
                // We'd ideally need to fetch attempts left from evaluation endpoint too, 
                // but for now let's assume we can retry if not passed and max attempts not reached?
                // Or just show "Reintentar" button which will fail if no attempts.
                // Better: fetch evaluation status to get attempts left.
                // Let's create a quick fetch for attempts left.

                let attemptsLeft = 0
                try {
                    const evalRes = await fetch(`/api/evaluations/${subData.evaluationId}`)
                    if (evalRes.ok) {
                        const evalData = await evalRes.json()
                        attemptsLeft = evalData.attemptsLeft
                    }
                } catch { }

                setResult({ ...subData, review, attemptsLeft })
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchResult()
    }, [submissionId])

    if (loading) return <div className="flex h-screen items-center justify-center">Cargando resultados...</div>
    if (!result) return <div className="flex h-screen items-center justify-center">No se encontró el resultado.</div>

    return (
        <div className="min-h-screen bg-neutral-50 pb-20 relative overflow-hidden">
            {/* Confetti if Passed */}
            {result.passed && (
                <ReactConfetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={500}
                />
            )}

            {/* Header / Status Banner */}
            <div className={cn("w-full py-12 text-center text-white mb-8", result.passed ? "bg-teal-600" : "bg-red-600")}>
                <div className="container mx-auto px-4">
                    <div className="inline-flex items-center gap-3 rounded-full bg-white/20 px-6 py-2 backdrop-blur-sm mb-6">
                        {result.passed ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                        <span className="text-lg font-bold uppercase tracking-wide">
                            {result.passed ? "¡Aprobado!" : "No Aprobado"}
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold mb-2">{result.evaluation?.title}</h1>
                    <p className="opacity-90 max-w-2xl mx-auto">{result.evaluation?.description}</p>
                </div>
            </div>

            <main className="container mx-auto px-4 max-w-3xl space-y-8">
                {/* Score Card */}
                <Card className="shadow-md border-0">
                    <CardHeader>
                        <CardTitle>Resultados</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center justify-center text-center">
                            <span className="text-6xl font-black text-neutral-900 mb-2">
                                {Math.round(result.percentage)}%
                            </span>
                            <div className="flex items-center gap-2 text-neutral-500 mb-6">
                                <span>{result.score} / {result.maxScore} Puntos</span>
                                <span>•</span>
                                <span>Mínimo requerido: {result.evaluation?.passingScore}%</span>
                            </div>
                            <Progress
                                value={result.percentage}
                                className={cn("h-4 w-full rounded-full", result.passed ? "bg-teal-100" : "bg-red-100")}
                            // indicatorColor via class not supported directly in standard shadcn Progress, need custom or inline style
                            // Assuming standard shadcn uses bg-primary for indicator
                            />
                            {/* Custom Indicator Color Hack if needed, or rely on primary theme */}
                        </div>
                    </CardContent>
                </Card>

                {/* Teacher Feedback */}
                {result.feedback && (
                    <Card className="border-l-4 border-l-blue-500 shadow-sm bg-blue-50/50">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 text-blue-700 font-semibold">
                                <MessageSquare className="h-5 w-5" />
                                Feedback del Profesor
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-4">
                                <Avatar>
                                    <AvatarImage src="/placeholder-avatar.jpg" />
                                    <AvatarFallback>PR</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-neutral-900 mb-1">
                                        {result.reviewedBy || "Instructor"}
                                    </div>
                                    <p className="text-neutral-700 text-sm leading-relaxed">
                                        {result.feedback}
                                    </p>
                                    <div className="text-xs text-neutral-400 mt-2">
                                        {result.reviewedAt ? new Date(result.reviewedAt).toLocaleDateString() : "Reciente"}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Detailed Review */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-neutral-800">Revisión de Respuestas</h2>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {result.review?.map((item: any, idx: number) => (
                            <AccordionItem key={item.id} value={item.id} className="border rounded-xl bg-white shadow-sm overflow-hidden px-0">
                                <AccordionTrigger className="px-6 py-4 hover:bg-neutral-50 hover:no-underline">
                                    <div className="flex items-center gap-4 text-left w-full">
                                        <div className={cn(
                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                                            item.isCorrect ? "bg-teal-100 border-teal-200 text-teal-700" : "bg-red-100 border-red-200 text-red-700"
                                        )}>
                                            {item.isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-semibold text-neutral-700 block">Pregunta {idx + 1}</span>
                                            <span className="text-sm text-neutral-500 line-clamp-1">{item.question}</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="bg-neutral-50/50 px-6 py-6 border-t">
                                    <p className="text-neutral-800 font-medium mb-4 text-lg">{item.question}</p>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className={cn("p-4 rounded-lg border", item.isCorrect ? "bg-white border-teal-200" : "bg-red-50 border-red-100")}>
                                            <span className="text-xs font-bold uppercase text-neutral-500 mb-1 block">Tu Respuesta</span>
                                            <p className={cn("font-medium", item.isCorrect ? "text-teal-700" : "text-red-700")}>
                                                {String(item.userAnswer || "Sin respuesta")}
                                            </p>
                                        </div>

                                        {!item.isCorrect && (
                                            <div className="p-4 rounded-lg border bg-white border-neutral-200">
                                                <span className="text-xs font-bold uppercase text-neutral-500 mb-1 block">Respuesta Correcta</span>
                                                <p className="font-medium text-neutral-700">
                                                    {String(item.correctAnswer)}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {item.explanation && (
                                        <div className="mt-4 flex gap-3 p-4 rounded-lg bg-blue-50 text-blue-800 text-sm">
                                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-bold block mb-1">Explicación</span>
                                                {item.explanation}
                                            </div>
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
                    {result.passed ? (
                        <Button size="lg" className="flex-1 bg-teal-600 hover:bg-teal-700 text-lg h-14" asChild>
                            {/* Redirect to next lesson? Or course index? MVP: Course Page */}
                            <Link href={`/courses/${result.evaluation?.course?.slug || "compliance-2024"}`}>
                                Continuar con el curso <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    ) : (
                        <>
                            {result.attemptsLeft > 0 ? (
                                <Button
                                    size="lg"
                                    className="flex-1 text-lg h-14"
                                    onClick={() => router.push(`/evaluations/${result.evaluationId}`)}
                                >
                                    <RotateCcw className="ml-2 h-5 w-5" /> Reintentar ({result.attemptsLeft} intentos restantes)
                                </Button>
                            ) : (
                                <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-center">
                                    <p className="font-semibold mb-2">No te quedan intentos disponibles</p>
                                    <p className="text-sm opacity-90 mb-4">Contacta a tu profesor para solicitar una revisión o más intentos.</p>
                                    <Button variant="outline" className="bg-white border-yellow-300 text-yellow-800 hover:bg-yellow-100">
                                        Contactar Profesor
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    <Button variant="ghost" size="lg" className="h-14" asChild>
                        <Link href="/dashboard">Volver al Dashboard</Link>
                    </Button>
                </div>
            </main>
        </div>
    )
}
