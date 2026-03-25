"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, HeartHandshake, Smile } from "lucide-react"
import { ReturnToEvaluations } from "@/components/dashboard/evaluaciones/return-to-evaluations"
import { saveClimateResponse } from "@/app/actions/talent-actions"

const moods = [
    { id: 1, emoji: '😠', label: 'Muy Mal', color: 'bg-red-100 dark:bg-red-500/20 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300' },
    { id: 2, emoji: '😕', label: 'Mal', color: 'bg-orange-100 dark:bg-orange-500/20 border-orange-500 dark:border-orange-400 text-orange-700 dark:text-orange-300' },
    { id: 3, emoji: '😐', label: 'Regular', color: 'bg-yellow-100 dark:bg-yellow-500/20 border-yellow-500 dark:border-yellow-400 text-yellow-700 dark:text-yellow-300' },
    { id: 4, emoji: '🙂', label: 'Bien', color: 'bg-blue-100 dark:bg-blue-500/20 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-300' },
    { id: 5, emoji: '🤩', label: 'Excelente', color: 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300' }
]

export default function WorkClimateThermometerPage() {
    const [selectedMoodId, setSelectedMoodId] = useState<number | null>(null)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async () => {
        if (!selectedMoodId) return
        
        setIsSubmitting(true)

        try {
            const result = await saveClimateResponse({
                category: "GENERAL_CLIMATE",
                score: selectedMoodId,
                comment: comment.trim() || undefined
            })

            if (result.success) {
                setIsSubmitted(true)
            } else {
                alert(result.error || "Error al enviar")
            }
        } catch (error) {
            console.error("Error submitting climate pulse:", error)
            alert("Error de conexión")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 h-[70vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-emerald-50 dark:ring-emerald-950/50">
                    <HeartHandshake className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                    ¡Gracias por compartir!
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-xl max-w-md mx-auto leading-relaxed">
                    Tu participación es fundamental para construir un entorno de trabajo extraordinario.
                </p>
                <div className="mt-12 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-6 py-3 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5" /> Pulso Diario Registrado
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col items-center">
            
            <ReturnToEvaluations />

            {/* Header del Termómetro */}
            <div className="text-center mb-16 max-w-2xl">
                <div className="w-16 h-16 bg-pink-50 dark:bg-pink-900/40 border border-pink-100 dark:border-pink-800 rounded-full flex items-center justify-center shadow-sm mx-auto mb-6">
                    <Smile className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                    ¿Cómo te sientes hoy en el equipo?
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg border border-slate-200 dark:border-slate-800 rounded-full px-6 py-2 inline-block bg-white dark:bg-slate-900/50 shadow-sm">
                    🔒 Tu respuesta es estrictamente confidencial
                </p>
            </div>

            {/* Selector interactivo de Emojis */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-16 w-full px-2">
                {moods.map((mood) => {
                    const isSelected = selectedMoodId === mood.id
                    
                    return (
                        <div key={mood.id} className="flex flex-col items-center gap-4 group">
                            <button
                                onClick={() => setSelectedMoodId(mood.id)}
                                className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-4xl sm:text-5xl transition-all duration-300 border-[3px] shadow-sm
                                    ${isSelected 
                                        ? `${mood.color} scale-110 shadow-lg` 
                                        : 'bg-white dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:scale-110 hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }
                                `}
                            >
                                <span className="transform transition-transform group-hover:scale-110">
                                    {mood.emoji}
                                </span>
                            </button>
                            
                            {/* Label sutil debajo de cada botón */}
                            <span className={`font-bold text-sm transition-colors duration-300 ${isSelected ? mood.color.split(' ').pop() : 'text-slate-400 dark:text-slate-500'}`}>
                                {mood.label}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Caja Comentario Opcional y Envío */}
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                        ¿Quieres agregar algún comentario constructivo? <span className="text-slate-400 font-normal">(Opcional)</span>
                    </label>
                    <Textarea 
                        placeholder="Ej. Me sentí apoyado por el equipo hoy, pero la reunión de la mañana fue un poco desorganizada..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[120px] resize-none border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 focus-visible:ring-1 focus-visible:ring-indigo-500/50 rounded-2xl p-4 text-[15px] font-medium"
                    />
                </div>

                <Button 
                    onClick={handleSubmit}
                    disabled={selectedMoodId === null || isSubmitting}
                    className="w-full h-14 rounded-2xl font-black text-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-xl disabled:opacity-50 transition-all duration-300"
                >
                    {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        "Enviar Pulso Diario"
                    )}
                </Button>
            </div>

        </div>
    )
}
