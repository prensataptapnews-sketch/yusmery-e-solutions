
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, GripVertical } from "lucide-react"
import { toast } from "sonner"

type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SCALE_1_5' | 'OPEN_TEXT'

interface Question {
    id: string
    question: string
    type: QuestionType
    options: string[]
    correctAnswer: string
    points: number
}

export default function CreateDiagnosticPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [published, setPublished] = useState(false)
    const [questions, setQuestions] = useState<Question[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const addQuestion = () => {
        setQuestions([...questions, {
            id: crypto.randomUUID(),
            question: "",
            type: "MULTIPLE_CHOICE",
            options: ["", ""],
            correctAnswer: "",
            points: 1
        }])
    }

    const updateQuestion = (id: string, field: keyof Question, value: any) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q))
    }

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id))
    }

    const updateOption = (qId: string, idx: number, val: string) => {
        const q = questions.find(q => q.id === qId)
        if (!q) return
        const newOptions = [...q.options]
        newOptions[idx] = val
        updateQuestion(qId, "options", newOptions)
    }

    const addOption = (qId: string) => {
        const q = questions.find(q => q.id === qId)
        if (q) updateQuestion(qId, "options", [...q.options, ""])
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const payload = {
                title,
                description,
                category,
                published,
                questions: questions.map((q, idx) => ({
                    ...q,
                    order: idx
                }))
            }

            const res = await fetch("/api/diagnostics/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const errorData = await res.text()
                throw new Error(errorData || "Error al crear el diagnóstico")
            }

            toast.success("Diagnóstico creado exitosamente")
            router.push("/super-admin/diagnosticos")
            router.refresh()
        } catch (e: any) {
            console.error(e)
            toast.error(e.message || "Error al guardar")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-8 pb-32">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Crear Nuevo Diagnóstico</h1>
                <div className="flex items-center gap-2">
                    <Label htmlFor="published">Publicado</Label>
                    <Switch id="published" checked={published} onCheckedChange={setPublished} />
                </div>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Título</Label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Excel Intermedio" />
                        </div>
                        <div className="space-y-2">
                            <Label>Categoría</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Excel">Excel</SelectItem>
                                    <SelectItem value="PowerBI">Power BI</SelectItem>
                                    <SelectItem value="Liderazgo">Liderazgo</SelectItem>
                                    <SelectItem value="Gestión">Gestión</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Breve descripción del diagnóstico..." />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Preguntas ({questions.length})</h2>
                    <Button onClick={addQuestion} variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Pregunta
                    </Button>
                </div>

                {questions.map((q, idx) => (
                    <Card key={q.id} className="relative">
                        <div className="absolute left-4 top-8 cursor-move text-muted-foreground">
                            <GripVertical className="h-5 w-5" />
                        </div>
                        <CardContent className="pl-12 pt-6 space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <Label>Pregunta {idx + 1}</Label>
                                    <Input value={q.question} onChange={e => updateQuestion(q.id, 'question', e.target.value)} />
                                </div>
                                <div className="w-[200px] space-y-2">
                                    <Label>Tipo</Label>
                                    <Select value={q.type} onValueChange={val => updateQuestion(q.id, 'type', val)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MULTIPLE_CHOICE">Opción Múltiple</SelectItem>
                                            <SelectItem value="TRUE_FALSE">Verdadero/Falso</SelectItem>
                                            <SelectItem value="SCALE_1_5">Escala 1-5</SelectItem>
                                            <SelectItem value="OPEN_TEXT">Texto Abierto</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {q.type === 'MULTIPLE_CHOICE' && (
                                <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                                    <Label>Opciones</Label>
                                    {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="flex items-center gap-2">
                                            <Input
                                                value={opt}
                                                onChange={e => updateOption(q.id, oIdx, e.target.value)}
                                                placeholder={`Opción ${oIdx + 1}`}
                                            />
                                            <input
                                                type="radio"
                                                name={`correct-${q.id}`}
                                                checked={q.correctAnswer === opt && opt !== ""}
                                                onChange={() => updateQuestion(q.id, 'correctAnswer', opt)}
                                                className="h-4 w-4"
                                            />
                                        </div>
                                    ))}
                                    <Button size="sm" variant="ghost" onClick={() => addOption(q.id)}>+ Agregar opción</Button>
                                </div>
                            )}

                            {q.type === 'TRUE_FALSE' && (
                                <div className="flex gap-4 bg-muted/30 p-4 rounded-lg">
                                    <Label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name={`correct-${q.id}`}
                                            checked={q.correctAnswer === 'Verdadero'}
                                            onChange={() => updateQuestion(q.id, 'correctAnswer', 'Verdadero')}
                                        /> Verdadero
                                    </Label>
                                    <Label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name={`correct-${q.id}`}
                                            checked={q.correctAnswer === 'Falso'}
                                            onChange={() => updateQuestion(q.id, 'correctAnswer', 'Falso')}
                                        /> Falso
                                    </Label>
                                </div>
                            )}

                            <div className="flex justify-between items-end">
                                <div className="w-24">
                                    <Label>Puntos</Label>
                                    <Input type="number" value={q.points} onChange={e => updateQuestion(q.id, 'points', Number(e.target.value))} />
                                </div>
                                <Button variant="destructive" size="sm" onClick={() => removeQuestion(q.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-end gap-4 container mx-auto max-w-4xl z-10">
                <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Guardando...' : 'Guardar Diagnóstico'}
                </Button>
            </div>
        </div>
    )
}
