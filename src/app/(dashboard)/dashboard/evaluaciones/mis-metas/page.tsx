"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Target, GripVertical, Save, ArrowDownUp, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReturnToEvaluations } from "@/components/dashboard/evaluaciones/return-to-evaluations"
import { getGoals, syncGoal } from "@/app/actions/talent-actions"

interface Goal {
    id: string
    title: string
    description: string | null
    order?: number
    status: string
}

export default function AlignGoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    
    // Referencias para conocer qué item se está arrastrando y sobre cuál pasa
    const draggingItemRef = useRef<number | null>(null)
    const dragOverItemRef = useRef<number | null>(null)

    useEffect(() => {
        async function loadGoals() {
            let data = await getGoals()
            if (data.length === 0) {
                const { seedUserGoals } = await import("@/app/actions/talent-actions")
                const res = await seedUserGoals()
                if (res.success) {
                    data = await getGoals()
                }
            }
            setGoals(data)
            setIsLoading(false)
        }
        loadGoals()
    }, [])

    // Handlers Drag & Drop nativos
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        draggingItemRef.current = position
        
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move"
        }
        
        setTimeout(() => {
            const target = e.target as HTMLElement;
            target.classList.add("opacity-50");
        }, 0)
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        dragOverItemRef.current = position
        
        if (draggingItemRef.current !== null && dragOverItemRef.current !== null && draggingItemRef.current !== dragOverItemRef.current) {
            const newGoals = [...goals]
            const draggingGoal = newGoals[draggingItemRef.current]
            
            newGoals.splice(draggingItemRef.current, 1)
            newGoals.splice(dragOverItemRef.current, 0, draggingGoal)
            
            draggingItemRef.current = dragOverItemRef.current
            setGoals(newGoals)
        }
    }

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        target.classList.remove("opacity-50");
        
        draggingItemRef.current = null
        dragOverItemRef.current = null
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const savePriorities = async () => {
        setIsSaving(true)
        try {
            // Sincronizar cada meta con su nuevo orden
            await Promise.all(goals.map((g, index) => 
                syncGoal({
                    id: g.id,
                    title: g.title,
                    order: index,
                    status: g.status as any
                })
            ))
            setIsSuccess(true)
            setTimeout(() => setIsSuccess(false), 3000)
        } catch (error) {
            console.error("Error saving priorities:", error)
            alert("Error al guardar")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col min-h-screen pb-32">
            
            <ReturnToEvaluations />

            {/* Cabecera */}
            <div className="mb-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 rounded-3xl flex items-center justify-center shadow-sm mb-4">
                    <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    Ordena tus Prioridades del Trimestre
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-xl flex items-center justify-center gap-2">
                    <ArrowDownUp className="w-5 h-5" /> 
                    Arrastra las tarjetas para poner la meta más crítica en la Posición 1.
                </p>
            </div>

            {/* Lista Interactiva Sortable */}
            <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-8 shrink-0">
                <div className="flex flex-col gap-3">
                    {isLoading ? (
                        [1,2,3].map(i => (
                            <div key={i} className="h-24 bg-white dark:bg-slate-900 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800"></div>
                        ))
                    ) : goals.length === 0 ? (
                        <div className="text-center py-20 text-slate-400 dark:text-slate-500 font-bold border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                            No tienes metas definidas para este periodo.
                        </div>
                    ) : (
                        goals.map((goal, index) => (
                            <div
                                key={goal.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                className={`flex items-center gap-4 bg-white dark:bg-slate-900 border-l-4 border-l-blue-500 border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group`}
                            >
                                {/* Grip Icon (Indicador arrastrable) */}
                                <div className="shrink-0 text-slate-300 dark:text-slate-700 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors cursor-grab active:cursor-grabbing">
                                    <GripVertical className="w-6 h-6" />
                                </div>

                                {/* Número Dinámico de Posición */}
                                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black transition-colors ${
                                    index === 0 
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                                    : index === 1
                                        ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                }`}>
                                    {index + 1}
                                </div>

                                {/* Contenido */}
                                <div className="flex-1 pr-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">
                                        {goal.title || "Meta sin título"}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-300 leading-snug">
                                        {goal.description || "Sin descripción detallada"}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 md:p-6 z-50 flex justify-center shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
                <div className="w-full max-w-4xl flex justify-center">
                    <Button 
                        onClick={savePriorities}
                        disabled={isSaving || goals.length === 0}
                        className={`h-14 px-12 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 ${
                            isSuccess 
                                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' 
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/10 hover:-translate-y-1'
                        } text-white`}
                    >
                        {isSaving ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></span>
                                Guardando...
                            </>
                        ) : isSuccess ? (
                            <>
                                ¡Guardado! <CheckCircle2 className="w-6 h-6 ml-3" />
                            </>
                        ) : (
                            <>
                                Guardar Prioridades <Save className="w-6 h-6 ml-3" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
            
        </div>
    )
}
