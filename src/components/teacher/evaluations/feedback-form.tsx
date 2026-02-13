"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface FeedbackFormProps {
    submissionId: string
}

export function FeedbackForm({ submissionId }: FeedbackFormProps) {
    const router = useRouter()
    const [feedback, setFeedback] = useState("")
    const [action, setAction] = useState("approve")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (feedback.length < 10) {
            toast.error("El feedback debe tener al menos 10 caracteres.")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/evaluations/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ submissionId, feedback, action })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.message || "Error al enviar feedback")

            toast.success("Feedback enviado correctamente")
            router.push("/teacher/evaluations")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold">Enviar Feedback</h3>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="feedback">Comentarios para el alumno</Label>
                    <Textarea
                        id="feedback"
                        placeholder="Escribe aquí tus observaciones y recomendaciones..."
                        className="min-h-[120px]"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <Label>Acción a tomar</Label>
                    <RadioGroup value={action} onValueChange={setAction} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <RadioGroupItem value="approve" id="approve" className="peer sr-only" />
                            <Label
                                htmlFor="approve"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-500 [&:has([data-state=checked])]:border-green-500 cursor-pointer"
                            >
                                <span className="font-semibold">✅ Aprobar</span>
                                <span className="text-xs text-muted-foreground text-center mt-1">Marcar como aprobado y finalizar</span>
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="retry" id="retry" className="peer sr-only" />
                            <Label
                                htmlFor="retry"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-orange-500 [&:has([data-state=checked])]:border-orange-500 cursor-pointer"
                            >
                                <span className="font-semibold">🔄 Reintentar</span>
                                <span className="text-xs text-muted-foreground text-center mt-1">Permitir un nuevo intento</span>
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="schedule" id="schedule" className="peer sr-only" />
                            <Label
                                htmlFor="schedule"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer"
                            >
                                <span className="font-semibold">📅 Refuerzo</span>
                                <span className="text-xs text-muted-foreground text-center mt-1">Programar sesión 1-on-1</span>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                    </>
                ) : (
                    "Enviar Feedback y Finalizar"
                )}
            </Button>
        </form>
    )
}
