import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react"

interface Question {
    id: string
    question: string
    type: string
    options: string // JSON
    correctAnswer: string // JSON or string
    points: number
    explanation: string | null
}

interface AnswerReviewProps {
    questions: Question[]
    studentAnswers: string // JSON { questionId: answer }
}

export function AnswerReview({ questions, studentAnswers }: AnswerReviewProps) {
    const answersMap = JSON.parse(studentAnswers || '{}')

    const getAnswerDisplay = (question: Question, answer: any) => {
        if (!answer) return <span className="text-muted-foreground italic">Sin respuesta</span>

        // Basic handling for now - expand based on question type if needed (e.g. if options are JSON array)
        // Assuming answer is the string value/key stored.
        return <span className="font-medium">{String(answer)}</span>
    }

    const isCorrect = (question: Question, answer: any) => {
        // Simple string comparison for MVP. Complex types need better logic.
        // Clean strings involved
        const cleanAnswer = String(answer || "").trim()
        const cleanCorrect = String(question.correctAnswer || "").trim()
        return cleanAnswer === cleanCorrect
    }

    // Parse options if needed to display "Label" instead of "Value"
    // For now, assuming relatively simple match.

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Revisión de Respuestas</h3>
            {questions.map((q, index) => {
                const answer = answersMap[q.id]
                const correct = isCorrect(q, answer)

                return (
                    <Card key={q.id} className={`border-l-4 ${correct ? 'border-l-green-500' : 'border-l-red-500'}`}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex gap-2">
                                    <span className="font-bold text-muted-foreground">#{index + 1}</span>
                                    <span className="font-medium text-base">{q.question}</span>
                                </div>
                                <div className="flex-shrink-0">
                                    {correct ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                                    <span className="block text-xs text-muted-foreground mb-1">Respuesta del alumno:</span>
                                    {getAnswerDisplay(q, answer)}
                                </div>
                                {!correct && (
                                    <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-md border border-green-100 dark:border-green-900/20">
                                        <span className="block text-xs text-green-700 dark:text-green-400 mb-1">Respuesta correcta:</span>
                                        <span className="font-medium text-green-800 dark:text-green-300">{q.correctAnswer}</span>
                                    </div>
                                )}
                            </div>
                            {q.explanation && !correct && (
                                <div className="mt-3 text-xs text-muted-foreground flex gap-2 items-start">
                                    <HelpCircle className="h-3 w-3 mt-0.5" />
                                    <span>{q.explanation}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
