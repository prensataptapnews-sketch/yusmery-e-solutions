"use client"

import { useState } from "react"
import { Users2, Search, CheckCircle2, AlertCircle, UserPlus, X, Check, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReturnToEvaluations } from "@/components/dashboard/evaluaciones/return-to-evaluations"

import { savePeerNominations } from "@/app/actions/talent-actions"

interface Colleague {
    id: string
    name: string
    role: string
    avatarUrl: string
}

const mockColleagues: Colleague[] = [
    { id: 'usr-1', name: 'Laura Gómez', role: 'UX Designer', avatarUrl: 'https://i.pravatar.cc/150?u=laura' },
    { id: 'usr-2', name: 'Carlos Díaz', role: 'Backend Developer', avatarUrl: 'https://i.pravatar.cc/150?u=carlos' },
    { id: 'usr-3', name: 'Ana Silva', role: 'Product Manager', avatarUrl: 'https://i.pravatar.cc/150?u=ana' },
    { id: 'usr-4', name: 'Luis Pérez', role: 'Data Analyst', avatarUrl: 'https://i.pravatar.cc/150?u=luis' },
    { id: 'usr-5', name: 'Sofía Reyes', role: 'Marketing Lead', avatarUrl: 'https://i.pravatar.cc/150?u=sofia' },
    { id: 'usr-6', name: 'Miguel Torres', role: 'QA Engineer', avatarUrl: 'https://i.pravatar.cc/150?u=miguel' },
    { id: 'usr-7', name: 'Elena Castro', role: 'Frontend Dev', avatarUrl: 'https://i.pravatar.cc/150?u=elena' },
    { id: 'usr-8', name: 'David Ortiz', role: 'DevOps', avatarUrl: 'https://i.pravatar.cc/150?u=david' }
]

const MAX_SELECTION = 3

export default function SelectPeersPage() {
    const [selectedPeers, setSelectedPeers] = useState<string[]>([])
    const [showWarning, setShowWarning] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const toggleSelection = (id: string) => {
        // Ocultar warning residual
        if (showWarning) setShowWarning(false)

        if (selectedPeers.includes(id)) {
            // Quitar si ya está
            setSelectedPeers(prev => prev.filter(peerId => peerId !== id))
        } else {
            // Añadir si hay espacio
            if (selectedPeers.length < MAX_SELECTION) {
                setSelectedPeers(prev => [...prev, id])
            } else {
                // Mostrar advertencia visual
                setShowWarning(true)
                setTimeout(() => setShowWarning(false), 3000)
            }
        }
    }

    const handleConfirm = async () => {
        if (selectedPeers.length === MAX_SELECTION) {
            setIsLoading(true)
            try {
                const result = await savePeerNominations(selectedPeers)
                if (result.success) {
                    setIsSuccess(true)
                } else {
                    alert(result.error || "Error al guardar selección")
                }
            } catch (error) {
                console.error("Error confirmando pares:", error)
                alert("Error de conexión")
            } finally {
                setIsLoading(false)
            }
        }
    }

    const isComplete = selectedPeers.length === MAX_SELECTION

    if (isSuccess) {
        return (
            <div className="max-w-3xl mx-auto py-20 px-4 h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                    ¡Pares Seleccionados!
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-lg font-medium">
                    Tus solicitudes de evaluación cruzada han sido enviadas. Se les notificará a tus compañeros para que acepten la evaluación.
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
        <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col pb-32">
            
            <ReturnToEvaluations />

            {/* Cabecera */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 rounded-2xl flex items-center justify-center shadow-sm">
                            <Users2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Selecciona a tus Pares
                        </h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl">
                        Elige a {MAX_SELECTION} compañeros que trabajarán estrechamente contigo para realizar la evaluación cruzada.
                    </p>
                </div>
                
                {/* Contador Visual Llamativo */}
                <div className={`flex flex-col items-center justify-center px-8 py-3 rounded-2xl border-2 transition-all duration-300 ${isComplete ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}>
                    <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        Seleccionados
                    </span>
                    <div className={`text-3xl font-black tabular-nums transition-colors duration-300 ${isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                        {selectedPeers.length} <span className="text-xl text-slate-400 dark:text-slate-500">/ {MAX_SELECTION}</span>
                    </div>
                </div>
            </div>

            {/* Warning Toast Inline */}
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 transition-all duration-300 ${showWarning ? 'opacity-100 translate-y-0 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400' : 'opacity-0 -translate-y-4 pointer-events-none h-0 overflow-hidden'}`}>
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-bold text-sm">Ya has alcanzado el límite de {MAX_SELECTION} compañeros. Quita uno para seleccionar otro.</span>
            </div>

            {/* Grid de Tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockColleagues.map((colleague) => {
                    const isSelected = selectedPeers.includes(colleague.id)
                    
                    return (
                        <div 
                            key={colleague.id} 
                            className={`bg-white dark:bg-slate-900/80 p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group ${
                                isSelected 
                                    ? 'border-emerald-500 shadow-md shadow-emerald-500/10 scale-[1.02]' 
                                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 shadow-sm'
                            }`}
                        >
                            {/* Halo Background si está seleccionado */}
                            {isSelected && (
                                <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-900/20 pointer-events-none"></div>
                            )}

                            {/* Avatar */}
                            <div className="relative mb-5">
                                <img 
                                    src={colleague.avatarUrl} 
                                    alt={colleague.name} 
                                    className={`w-20 h-20 rounded-full object-cover border-4 transition-colors duration-300 ${isSelected ? 'border-emerald-100 dark:border-emerald-900/50' : 'border-slate-100 dark:border-slate-800 group-hover:border-indigo-50 dark:group-hover:border-slate-700'}`}
                                />
                                {isSelected && (
                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm animate-in zoom-in-50">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">
                                {colleague.name}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">
                                {colleague.role}
                            </p>

                            {/* Botón Interactivo Mágico */}
                            <button
                                onClick={() => toggleSelection(colleague.id)}
                                className={`mt-auto w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                                    isSelected 
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-200 dark:hover:bg-emerald-500/30' 
                                        : 'bg-transparent text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                {isSelected ? (
                                    <>
                                        <Check className="w-4 h-4" /> Seleccionado
                                    </>
                                ) : (
                                    'Seleccionar'
                                )}
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Bottom Action */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 md:p-6 z-50 flex justify-center shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
                <div className="w-full max-w-6xl flex justify-end">
                    <Button 
                        disabled={!isComplete || isLoading}
                        onClick={handleConfirm}
                        className={`h-14 px-10 rounded-2xl font-bold text-lg shadow-xl shrink-0 transition-all duration-300 ${!isComplete || isLoading ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 opacity-50' : 'bg-slate-900 hover:-translate-y-1 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900'}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <span className="w-5 h-5 border-4 border-slate-400 border-t-white rounded-full animate-spin mr-3"></span>
                                Procesando...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                Confirmar Selección de Pares <Save className="w-5 h-5 ml-3" />
                            </div>
                        )}
                    </Button>
                </div>
            </div>

        </div>
    )
}
