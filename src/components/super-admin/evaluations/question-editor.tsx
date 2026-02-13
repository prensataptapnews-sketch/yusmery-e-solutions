"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Trash2, Plus } from "lucide-react"

export interface QuestionDraft {
    id: string
    question: string
    type: string
    options: string // Comma separated for MVP
    correctAnswer: string
    points: number
    explanation: string
}

interface EditorProps {
    questions: QuestionDraft[]
    setQuestions: (questions: QuestionDraft[]) => void
}

export function QuestionEditor({ questions, setQuestions }: EditorProps) {
    const addQuestion = () => {
        const newQ: QuestionDraft = {
            id: Math.random().toString(36).substr(2, 9),
            question: "",
            type: "MULTIPLE_CHOICE",
            options: "",
            correctAnswer: "",
            points: 1,
            explanation: ""
        }
        setQuestions([...questions, newQ])
    }

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id))
    }

    const updateQuestion = (id: string, field: keyof QuestionDraft, value: any) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q))
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Preguntas ({questions.length})</h3>
                <Button onClick={addQuestion} type="button" variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Agregar Pregunta
                </Button>
            </div>

            <Accordion type="multiple" className="w-full">
                {questions.map((q, index) => (
                    <AccordionItem value={q.id} key={q.id}>
                        <AccordionTrigger className="hover:no-underline">
                            <span className="flex items-center gap-2">
                                <span className="font-bold mr-2">#{index + 1}</span>
                                {q.question || "(Sin texto)"}
                                <span className="text-xs text-muted-foreground ml-2">[{q.type}]</span>
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4 px-1">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Enunciado de la Pregunta</Label>
                                    <Textarea
                                        value={q.question}
                                        onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                                        placeholder="Ej: ¿Cuál es el objetivo principal del Compliance?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Tipo de Pregunta</Label>
                                    <Select
                                        value={q.type}
                                        onValueChange={(val) => updateQuestion(q.id, 'type', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MULTIPLE_CHOICE">Opción Múltiple</SelectItem>
                                            <SelectItem value="TRUE_FALSE">Verdadero / Falso</SelectItem>
                                            <SelectItem value="OPEN_TEXT">Respuesta Abierta (Manual)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Puntos</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={q.points}
                                        onChange={(e) => updateQuestion(q.id, 'points', parseInt(e.target.value))}
                                    />
                                </div>

                                {q.type !== 'OPEN_TEXT' && (
                                    <>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Opciones (Separadas por coma) (Solo para Opción Múltiple)</Label>
                                            <Input
                                                value={q.options}
                                                onChange={(e) => updateQuestion(q.id, 'options', e.target.value)}
                                                placeholder="Opción A, Opción B, Opción C"
                                                disabled={q.type === 'TRUE_FALSE'}
                                            />
                                            {q.type === 'TRUE_FALSE' && <p className="text-xs text-muted-foreground">Automáticamente será: Verdadero, Falso</p>}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Respuesta Correcta (Exacta)</Label>
                                            <Input
                                                value={q.correctAnswer}
                                                onChange={(e) => updateQuestion(q.id, 'correctAnswer', e.target.value)}
                                                placeholder={q.type === 'TRUE_FALSE' ? "Verdadero" : "Opción B"}
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2 md:col-span-2">
                                    <Label>Explicación / Feedback (Opcional)</Label>
                                    <Textarea
                                        value={q.explanation}
                                        onChange={(e) => updateQuestion(q.id, 'explanation', e.target.value)}
                                        placeholder="Se mostrará después de responder..."
                                    />
                                </div>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="w-full mt-4"
                                onClick={() => removeQuestion(q.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar Pregunta
                            </Button>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
