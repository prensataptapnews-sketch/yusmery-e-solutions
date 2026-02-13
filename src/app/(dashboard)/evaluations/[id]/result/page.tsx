
"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, XCircle, ArrowRight, RotateCcw, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function EvaluationResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const searchParams = useSearchParams()
    const submissionId = searchParams.get("submissionId")
    const router = useRouter()

    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!submissionId) return

        async function fetchResult() {
            try {
                const subRes = await fetch(`/api/evaluations/${id}/submissions/${submissionId}`)
                if (subRes.ok) {
                    const subData = await subRes.json()

                    // Generate Review logic on client if not provided by server fully,
                    // but server `submit` endpoint returns `review`.
                    // The `submission` endpoint returns `answers` string and `evaluation`.
                    // We need to reconstruct the review if possible, or simpler:
                    // Just use the logic from the submission result if we can get it from the POST response?
                    // No, POST response is gone. We re-fetch.
                    // The `submission` endpoint returns raw answers.
                    // We need to re-evaluate locally OR have the API return the review.
                    // Let's modify the Submission API to return the computed review?
                    // Ideally yes, but for now let's reconstruct it here or minimal display.
                    // User wants "Review".

                    // Actually, let's use the data we have:
                    // submission.answers (JSON), submission.evaluation.questions (includes correct answer)

                    const answers = JSON.parse(subData.answers || "{}")
                    const questions = subData.evaluation?.questions || []

                    const review = questions.map((q: any) => {
                        // Re-implement simplified comparison logic for display
                        // NOTE: This assumes string matching which matches backend loose logic
                        // We should be careful about sync, but for display it's usually fine.

                        let userAnswer = answers[q.id]
                        let correctAnswer = q.correctAnswer

                        // Basic normalization for display
                        try {
                            if (correctAnswer.startsWith('"') || correctAnswer.startsWith('[')) {
                                correctAnswer = JSON.parse(correctAnswer)
                            }
                        } catch { }

                        // Compare (simplified)
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

                    setResult({ ...subData, review })
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchResult()
    }, [id, submissionId])

    if (loading) return <div className="flex h-screen items-center justify-center">Cargando resultados...</div>
    if (!result) return <div className="flex h-screen items-center justify-center">No se encontró el resultado.</div>

    return (
        <div className="flex min-h-screen flex-col items-center bg-neutral-50 p-4 pb-20">
            <Card className="w-full max-w-3xl shadow-lg mt-8">
                <CardHeader className="text-center border-b pb-8">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
                        {result.passed ? (
                            <CheckCircle className="h-12 w-12 text-teal-600" />
                        ) : (
                            <XCircle className="h-12 w-12 text-red-500" />
                        )}
                    </div>
                    <CardTitle className="text-3xl font-bold text-neutral-900">
                        {result.passed ? "¡Evaluación Aprobada!" : "Evaluación Reprobada"}
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">
                        {result.passed
                            ? "Has demostrado un excelente dominio del tema."
                            : "Te recomendamos repasar el contenido e intentar nuevamente."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="rounded-lg bg-white border p-6 shadow-sm">
                            <div className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">Calificación</div>
                            <div className={cn("mt-2 text-4xl font-extrabold", result.passed ? "text-teal-600" : "text-red-600")}>
                                {Math.round(result.percentage)}%
                            </div>
                        </div>
                        <div className="rounded-lg bg-white border p-6 shadow-sm">
                            <div className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">Respuestas</div>
                            <div className="mt-2 text-4xl font-bold text-neutral-900">
                                {result.score} <span className="text-xl text-neutral-400 font-normal">/ {result.maxScore} pts</span>
                            </div>
                        </div>
                        <div className="rounded-lg bg-white border p-6 shadow-sm">
                            <div className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">Estado</div>
                            <div className="mt-2 text-xl font-bold text-neutral-900 flex items-center justify-center h-10">
                                {result.passed ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                                        APROBADO
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                        REPROBADO
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                            Revisión de Preguntas
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                            {result.review?.map((item: any, idx: number) => (
                                <AccordionItem key={item.id} value={item.id} className="border rounded-lg mb-2 px-4 bg-white">
                                    <AccordionTrigger className="hover:no-underline py-4">
                                        <div className="flex items-start gap-3 text-left">
                                            {item.isCorrect ? (
                                                <CheckCircle className="h-5 w-5 text-teal-500 mt-0.5 shrink-0" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                                            )}
                                            <div>
                                                <span className="font-medium text-neutral-800">
                                                    {idx + 1}. {item.question}
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-4 pl-8">
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className={cn("p-3 rounded-md border", item.isCorrect ? "bg-teal-50 border-teal-100" : "bg-red-50 border-red-100")}>
                                                    <span className="block text-xs font-semibold opacity-70 mb-1">Tu respuesta:</span>
                                                    <span className="font-medium">{String(item.userAnswer || "Sin respuesta")}</span>
                                                </div>
                                                {!item.isCorrect && (
                                                    <div className="p-3 rounded-md border bg-neutral-50 border-neutral-100">
                                                        <span className="block text-xs font-semibold opacity-70 mb-1">Respuesta correcta:</span>
                                                        <span className="font-medium">{String(item.correctAnswer)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {item.explanation && (
                                                <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                                                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-semibold block mb-1">Explicación:</span>
                                                        {item.explanation}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 pt-4">
                        {result.passed ? (
                            <Button className="flex-1 bg-teal-600 hover:bg-teal-700 h-12 text-base" asChild>
                                <Link href="/dashboard">
                                    Finalizar y Volver al Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                className="flex-1 h-12 text-base" variant="outline"
                                onClick={() => router.push(`/evaluations/${id}`)}
                            >
                                <RotateCcw className="ml-2 h-5 w-5" /> Intentar nuevamente
                            </Button>
                        )}
                        <Button variant="ghost" className="h-12 text-base" asChild>
                            <Link href="/courses/compliance-2024">Volver al curso</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
