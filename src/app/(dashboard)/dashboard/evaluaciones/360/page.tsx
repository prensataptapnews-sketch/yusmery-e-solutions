"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClipboardList, Star, TrendingUp, CheckCircle2, ChevronRight, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReturnToEvaluations } from "@/components/dashboard/evaluaciones/return-to-evaluations"

const COMPETENCIES = [
    { id: 1, title: "Comunicación Asertiva", description: "Capacidad para expresar ideas de forma clara, directa y respetuosa, fomentando un diálogo abierto y constructivo con el equipo.", icon: "💬" },
    { id: 2, title: "Liderazgo Inspirador", description: "Habilidad para motivar y guiar a otros hacia metas comunes, promoviendo el desarrollo profesional del equipo.", icon: "🚀" },
    { id: 3, title: "Resolución de Problemas", description: "Destreza para identificar obstáculos rápidamente y proponer soluciones innovadoras y efectivas bajo presión.", icon: "🧩" },
    { id: 4, title: "Trabajo en Equipo", description: "Disposición para colaborar activamente, compartir conocimientos y apoyar a los compañeros para el éxito del proyecto.", icon: "🤝" },
    { id: 5, title: "Adaptabilidad", description: "Flexibilidad para ajustarse a nuevos entornos, cambios de prioridades y metodologías de trabajo ágiles.", icon: "🌊" }
]

export default function EvaluacionesPage() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<{ id: number, type: 'virtud' | 'mejora' }[]>([])
    const [isFinished, setIsFinished] = useState(false)

    const handleAnswer = (type: 'virtud' | 'mejora') => {
        setAnswers([...answers, { id: COMPETENCIES[currentIndex].id, type }])
        
        if (currentIndex < COMPETENCIES.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            setIsFinished(true)
        }
    }

    const currentCard = COMPETENCIES[currentIndex]

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col pb-20">
            <ReturnToEvaluations />

            <div className="mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center shadow-inner">
                    <ClipboardList className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Evaluación 360 Dinámica</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Reflexiona sobre tus competencias profesionales y áreas de desarrollo.</p>
                </div>
            </div>

            {!isFinished ? (
                <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full relative min-h-[500px]">
                    {/* Progress indicator */}
                    <div className="w-full flex justify-between items-center mb-6 px-2">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                            Competencia {currentIndex + 1} de {COMPETENCIES.length}
                        </span>
                        <div className="flex gap-1.5">
                            {COMPETENCIES.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-indigo-600' : idx < currentIndex ? 'w-2 bg-indigo-300' : 'w-2 bg-slate-200 dark:bg-slate-700'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -50, scale: 0.95 }}
                            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                            className="bg-white/80 backdrop-blur-md dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full text-center flex flex-col h-[400px]"
                        >
                            <div className="text-6xl mb-6 mt-4">{currentCard.icon}</div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{currentCard.title}</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-medium px-4 mb-auto">
                                {currentCard.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <Button 
                                    onClick={() => handleAnswer('virtud')}
                                    className="h-16 rounded-2xl bg-emerald-50 hover:bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 border-2 border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-400 font-bold text-lg transition-all hover:scale-105 shadow-sm"
                                    variant="outline"
                                >
                                    <Star className="w-5 h-5 mr-2" /> Es una Virtud
                                </Button>
                                <Button 
                                    onClick={() => handleAnswer('mejora')}
                                    className="h-16 rounded-2xl bg-amber-50 hover:bg-amber-500/10 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 border-2 border-amber-200 dark:border-amber-900/50 hover:border-amber-400 font-bold text-lg transition-all hover:scale-105 shadow-sm"
                                    variant="outline"
                                >
                                    <TrendingUp className="w-5 h-5 mr-2" /> Área de Mejora
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto py-12"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-full flex items-center justify-center text-white p-6 shadow-2xl shadow-indigo-500/30 mb-8 border-4 border-white dark:border-slate-950">
                        <Award className="w-full h-full" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        ¡Evaluación Completada!
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 font-medium">
                        Gracias por tu autoevaluación sincera. Estos datos se sincronizarán directamente con tu nuevo <span className="text-indigo-600 dark:text-indigo-400 font-bold">Plan Profesional de Liderazgo</span>.
                    </p>
                    
                    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8 text-left shadow-xl shadow-slate-900/5">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Resumen Interactivo
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                                <span className="font-bold text-emerald-700 dark:text-emerald-400">Fortalezas Identificadas</span>
                                <span className="bg-emerald-200 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1 rounded-full text-sm">
                                    {answers.filter(a => a.type === 'virtud').length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/50">
                                <span className="font-bold text-amber-700 dark:text-amber-400">Oportunidades de Desarrollo</span>
                                <span className="bg-amber-200 dark:bg-amber-500/30 text-amber-800 dark:text-amber-300 font-bold px-3 py-1 rounded-full text-sm">
                                    {answers.filter(a => a.type === 'mejora').length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button className="rounded-xl px-8 h-12 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-transform hover:-translate-y-1">
                        Construir Mi Plan Profesional <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </motion.div>
            )}
        </div>
    )
}
