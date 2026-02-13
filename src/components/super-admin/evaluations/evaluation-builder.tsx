"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { QuestionEditor, QuestionDraft } from "./question-editor"

interface BuilderProps {
    courses: { id: string, title: string }[]
    // Ideally we fetch lessons dynamically when course is selected, but for MVP we might load all or use a server action. 
    // To keep it simple, let's assume we pass full context or fetch on demand.
    // For now, let's just use courses for Course Association, and assume Lesson selection is a text input or TODO logic if complex.
    // Actually user requirement says: "Select: Asociar a (Lección / Curso)" + "Combobox: Buscar lección o curso".
}

export function EvaluationBuilder({ courses }: BuilderProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [contextType, setContextType] = useState<"COURSE" | "LESSON">("COURSE")

    // Config State
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [type, setType] = useState("QUIZ")
    const [minPassingScore, setMinPassingScore] = useState(70)
    const [attempts, setAttempts] = useState(3)
    const [timeLimit, setTimeLimit] = useState<number | "">("")
    const [published, setPublished] = useState(false)
    const [selectedCourseId, setSelectedCourseId] = useState("")
    const [lessonIdInput, setLessonIdInput] = useState("") // Temporary manual ID input or simplified

    // Questions State
    const [questions, setQuestions] = useState<QuestionDraft[]>([])

    const handleSubmit = async () => {
        if (!title || questions.length === 0) {
            toast.error("Faltan campos obligatorios (Título o Preguntas)")
            return
        }

        setLoading(true)
        try {
            const payload = {
                title,
                description,
                type, // Enum string
                passingScore: minPassingScore,
                attempts,
                timeLimit: timeLimit === "" ? null : Number(timeLimit),
                published,
                courseId: contextType === 'COURSE' ? selectedCourseId : null,
                lessonId: contextType === 'LESSON' ? lessonIdInput : null, // Assuming manual ID for Lesson MVP if fetch complex
                questions: questions.map((q, i) => ({
                    question: q.question,
                    type: q.type,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    points: q.points,
                    order: i + 1
                }))
            }

            const res = await fetch("/api/evaluations/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error("Error al crear")

            toast.success("Evaluación creada exitosamente")
            router.push("/super-admin/evaluaciones")
            router.refresh()
        } catch (error) {
            toast.error("Error al guardar la evaluación")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column: Configuration */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-card border rounded-lg p-6 space-y-4">
                    <h2 className="font-semibold text-lg">1. Configuración</h2>

                    <div className="space-y-2">
                        <Label>Asociar a</Label>
                        <Select
                            value={contextType}
                            onValueChange={(val: "COURSE" | "LESSON") => setContextType(val)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="COURSE">Curso Completo (Examen Final)</SelectItem>
                                <SelectItem value="LESSON">Lección Específica (Quiz)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {contextType === 'COURSE' ? (
                        <div className="space-y-2">
                            <Label>Seleccionar Curso</Label>
                            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Buscar curso..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label>ID de Lección (Manual MVP)</Label>
                            <Input
                                value={lessonIdInput}
                                onChange={(e) => setLessonIdInput(e.target.value)}
                                placeholder="Pegar ID de lección..."
                            />
                            <p className="text-xs text-muted-foreground">En futuras versiones será un buscador.</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Título</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Examen Final Módulo 1" />
                    </div>

                    <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="QUIZ">Quiz Rápido</SelectItem>
                                <SelectItem value="FINAL_EXAM">Examen Final</SelectItem>
                                <SelectItem value="PRACTICE">Práctica</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>% Aprobación</Label>
                            <Input
                                type="number"
                                value={minPassingScore}
                                onChange={(e) => setMinPassingScore(Number(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Intentos</Label>
                            <Input
                                type="number"
                                value={attempts}
                                onChange={(e) => setAttempts(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Tiempo Límite (min) - Opcional</Label>
                        <Input
                            type="number"
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="Sin límite"
                        />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Switch id="published" checked={published} onCheckedChange={setPublished} />
                        <Label htmlFor="published">Publicar inmediatamente</Label>
                    </div>
                </div>
            </div>

            {/* Right Column: Questions */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-card border rounded-lg p-6">
                    <h2 className="font-semibold text-lg mb-4">2. Preguntas y Respuestas</h2>
                    <QuestionEditor questions={questions} setQuestions={setQuestions} />
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={loading || !title}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Evaluación
                    </Button>
                </div>
            </div>
        </div>
    )
}
