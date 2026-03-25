"use client"

import { useState } from "react"
import Link from "next/link"
import { Brain, Star, CheckCircle2, ChevronRight, Award, Sliders, MessageSquare, AlertCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReturnToEvaluations } from "@/components/dashboard/evaluaciones/return-to-evaluations"
import { Textarea } from "@/components/ui/textarea"

import { saveCompetencyEvaluation } from "@/app/actions/talent-actions"

const competencies = [
    { id: 'c1', name: 'Resolución de Conflictos', description: 'Capacidad para mediar y solucionar problemas entre compañeros manteniendo un ambiente laboral sano e integrador.' },
    { id: 'c2', name: 'Proactividad', description: 'Iniciativa para anticipar necesidades, proponer soluciones innovadoras y actuar antes de que las situaciones lo exijan.' },
    { id: 'c3', name: 'Trabajo en Equipo', description: 'Disposición para colaborar, escuchar activamente a otros y sumar esfuerzos para alcanzar los objetivos estratégicos.' },
    { id: 'c4', name: 'Gestión del Estrés', description: 'Habilidad para mantener el enfoque y la calidad del trabajo frente a picos elevados de presión y deadlines cortos.' },
    { id: 'c5', name: 'Innovación', description: 'Predisposición continua hacia el aprendizaje, experimentación de nuevos enfoques y tolerancia al fracaso iterativo.' }
]

const getScoreColor = (score: number) => {
    if (score >= 1 && score <= 3) return { text: "text-rose-500 dark:text-rose-400", bg: "bg-rose-500", border: "border-rose-200 dark:border-rose-900/50" }
    if (score >= 4 && score <= 7) return { text: "text-amber-500 dark:text-amber-400", bg: "bg-amber-500", border: "border-amber-200 dark:border-amber-900/50" }
    if (score >= 8 && score <= 10) return { text: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-200 dark:border-emerald-900/50" }
    return { text: "text-slate-500", bg: "bg-slate-500", border: "border-slate-200" }
}

export default function AutoevaluacionPage() {
    // Inicializar el diccionario de ratings con el valor 5
    const initialRatings = competencies.reduce((acc, comp) => ({ ...acc, [comp.id]: 5 }), {} as Record<string, number>)
    
    const [ratings, setRatings] = useState<Record<string, number>>(initialRatings)
    const [generalComment, setGeneralComment] = useState("")
    
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleRatingChange = (id: string, value: number) => {
        setRatings(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        
        try {
            // Convertir ratings a formato solicitado por el action
            const scores = competencies.map(c => ({
                name: c.name,
                score: ratings[c.id]
            }))

            const result = await saveCompetencyEvaluation({
                type: "SELF",
                scores: scores,
                feedback: generalComment
            })

            if (result.success) {
                setIsSuccess(true)
            } else {
                alert(result.error || "Ocurrió un error al guardar")
            }
        } catch (error) {
            console.error("Error en submit:", error)
            alert("Error de conexión con el servidor")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="max-w-3xl mx-auto py-20 px-4 h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                    ¡Autoevaluación Registrada!
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-lg font-medium">
                    Tus respuestas honestas ayudarán a calibrar tu <strong className="text-emerald-600 dark:text-emerald-400">Plan de Desarrollo Profesional</strong>. La información ya fue encriptada y enviada a la base de datos principal.
                </p>
                <Button 
                    onClick={() => window.location.href = '/dashboard/evaluaciones'} 
                    className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-bold transition-all shadow-lg"
                >
                    Volver al Centro de Evaluaciones
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col pb-32">
            <ReturnToEvaluations />

            <div className="mb-10 flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 rounded-2xl flex items-center justify-center shadow-sm">
                    <Sliders className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Autoevaluación Dinámica
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-lg">
                        Calibra tu propio desempeño usando la escala del 1 al 10.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {competencies.map((comp) => {
                    const currentScore = ratings[comp.id]
                    const theme = getScoreColor(currentScore)

                    return (
                        <div 
                            key={comp.id} 
                            className={`bg-white dark:bg-slate-900/80 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 transform hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 relative overflow-hidden`}
                        >
                            {/* Accent highlight strip */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.bg} transition-colors duration-500`}></div>
                            
                            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10 pl-2">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                        {comp.name}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-[15px] font-medium leading-relaxed">
                                        {comp.description}
                                    </p>
                                </div>
                                
                                <div className="w-full md:w-[300px] flex flex-col items-center justify-center shrink-0">
                                    <div className="flex w-full justify-between items-end mb-4">
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Escala</span>
                                        <div className={`text-4xl font-black ${theme.text} transition-colors duration-500 leading-none`}>
                                            {currentScore}<span className="text-2xl text-slate-300 dark:text-slate-600">/10</span>
                                        </div>
                                    </div>
                                    
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="10" 
                                        step="1"
                                        value={currentScore}
                                        onChange={(e) => handleRatingChange(comp.id, parseInt(e.target.value))}
                                        className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all custom-slider"
                                    />
                                    
                                    <div className="flex w-full justify-between mt-3 px-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Deficiente</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Avanzado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Área de Comentarios Generales */}
                <div className="bg-white dark:bg-slate-900/80 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mt-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-indigo-500" />
                        Comentarios Adicionales
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                        ¿Hay algo que quieras agregar sobre tu desempeño que no esté cubierto en los sliders anteriores?
                    </p>
                    <Textarea 
                        placeholder="Escribe tus reflexiones, obstáculos o logros clave aquí..."
                        className="min-h-[150px] resize-none border-slate-200 dark:border-slate-800 p-4 text-[15px] font-medium rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        value={generalComment}
                        onChange={(e) => setGeneralComment(e.target.value)}
                    />
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 md:p-6 z-50 flex justify-center shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
                <div className="w-full max-w-4xl flex items-center justify-between">
                    <div className="hidden sm:flex items-center gap-3 text-slate-500 dark:text-slate-400">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Todos los sliders están pre-cargados en 5 (Promedio). Revisa cuidadosamente.</span>
                    </div>
                    <Button 
                        disabled={isLoading}
                        onClick={handleSubmit}
                        className={`w-full sm:w-auto h-14 px-8 rounded-2xl font-bold text-lg shadow-xl shrink-0 transition-all duration-300 ${isLoading ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:-translate-y-1 hover:bg-indigo-700 text-white'}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <span className="w-5 h-5 border-4 border-slate-400 border-t-white rounded-full animate-spin mr-3"></span>
                                Procesando Cierre...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                Enviar Autoevaluación <Send className="w-5 h-5 ml-3" />
                            </div>
                        )}
                    </Button>
                </div>
            </div>
            
            <style jsx global>{`
                .custom-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    background: #4f46e5;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2);
                    transition: all 0.2s ease;
                }
                .custom-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.15);
                    box-shadow: 0 0 0 6px rgba(79, 70, 229, 0.3);
                }
                .dark .custom-slider::-webkit-slider-thumb {
                    background: #818cf8;
                    box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.2);
                }
                .dark .custom-slider::-webkit-slider-thumb:hover {
                    box-shadow: 0 0 0 6px rgba(129, 140, 248, 0.3);
                }
            `}</style>
        </div>
    )
}
