"use client"

import { useState } from "react"
import Link from "next/link"
import { KanbanSquare, Plus, MoreHorizontal, AlertCircle, Calendar, ArrowRight, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReturnToEvaluations } from "@/components/dashboard/evaluaciones/return-to-evaluations"

type Status = 'todo' | 'in-progress' | 'done'

interface ActionItem {
    id: string
    title: string
    status: Status
    dueDate: string
}

interface ImprovementArea {
    id: string
    name: string
    description: string
}

const initialAreas: ImprovementArea[] = [
    { id: 'area-1', name: 'Gestión del Tiempo', description: 'Tiempos de entrega de reportes financieros suelen retrasarse por falta de priorización.' },
    { id: 'area-2', name: 'Comunicación Asertiva', description: 'Feedback recibido señala un tono demasiado confrontativo en las code-reviews semanales.' }
]

const initialItems: ActionItem[] = [
    { id: 'act-1', title: 'Implementar matriz de Eisenhower', status: 'todo', dueDate: '2026-04-15' },
    { id: 'act-2', title: 'Agendar taller de Inteligencia Emocional', status: 'todo', dueDate: '2026-04-30' }
]

export default function ActionPlanKanbanPage() {
    const [actionItems, setActionItems] = useState<ActionItem[]>(initialItems)
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    // Modal Form State
    const [newTaskTitle, setNewTaskTitle] = useState("")
    const [newTaskDate, setNewTaskDate] = useState("")

    const moveItem = (id: string, newStatus: Status) => {
        setActionItems(prev => prev.map(item => 
            item.id === id ? { ...item, status: newStatus } : item
        ))
    }

    const addTask = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTaskTitle.trim() || !newTaskDate) return

        const newItem: ActionItem = {
            id: `act-${Date.now()}`,
            title: newTaskTitle.trim(),
            status: 'todo',
            dueDate: newTaskDate
        }

        setActionItems(prev => [...prev, newItem])
        setNewTaskTitle("")
        setNewTaskDate("")
        setIsModalOpen(false)
    }

    const columns: { id: Status; label: string; bg: string; icon: React.ReactNode }[] = [
        { id: 'todo', label: 'Por Hacer', bg: 'bg-slate-100 dark:bg-slate-900', icon: <AlertCircle className="w-4 h-4 text-slate-500" /> },
        { id: 'in-progress', label: 'En Progreso', bg: 'bg-blue-50 dark:bg-blue-900/10', icon: <Clock className="w-4 h-4 text-blue-500" /> },
        { id: 'done', label: 'Completado', bg: 'bg-emerald-50 dark:bg-emerald-900/10', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> }
    ]

    return (
        <div className="max-w-[1400px] mx-auto py-8 px-4 flex flex-col pb-20 relative">
            
            <ReturnToEvaluations />

            {/* Header + Create Button */}
            <div className="mb-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <KanbanSquare className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        Plan de Acción (OKR)
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
                        Transfórmate convirtiendo retroalimentación en compromisos tangibles.
                    </p>
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg transition-transform hover:-translate-y-1"
                >
                    <Plus className="w-5 h-5 mr-2" /> Nuevo Compromiso
                </Button>
            </div>

            {/* Layout Principal Grid 1-3 */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
                
                {/* Columna 1: Áreas de Mejora */}
                <div className="lg:col-span-1 border-r-0 lg:border-r border-slate-200 dark:border-slate-800 pr-0 lg:pr-8 flex flex-col gap-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                        Áreas de Mejora Detectadas
                    </h2>
                    
                    {initialAreas.map((area) => (
                        <div key={area.id} className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 rounded-2xl p-5 shadow-sm">
                            <h3 className="text-orange-900 dark:text-orange-400 font-black mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> {area.name}
                            </h3>
                            <p className="text-orange-700 dark:text-orange-200/70 text-sm font-medium leading-relaxed">
                                {area.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Columnas 2,3,4: Tablero Kanban */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map((col) => {
                        const colItems = actionItems.filter(item => item.status === col.id)
                        
                        return (
                            <div key={col.id} className={`flex flex-col rounded-[2rem] p-4 ${col.bg} border border-slate-200/50 dark:border-slate-800/50 min-h-[500px]`}>
                                <div className="flex justify-between items-center mb-6 px-2">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        {col.icon} {col.label}
                                    </h3>
                                    <span className="bg-white dark:bg-slate-800 text-slate-500 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                                        {colItems.length}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {colItems.map((item) => (
                                        <div 
                                            key={item.id} 
                                            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-[15px] leading-snug w-5/6">
                                                    {item.title}
                                                </h4>
                                                
                                                {/* Controles: Dropdown Custom simple */}
                                                <div className="relative inline-block text-left group/dropdown">
                                                    <button className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </button>
                                                    <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-10 overflow-hidden text-sm font-medium">
                                                        {columns.filter(c => c.id !== item.status).map(c => (
                                                            <button 
                                                                key={c.id}
                                                                onClick={() => moveItem(item.id, c.id)}
                                                                className="w-full text-left px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                                                            >
                                                                Mover a {c.label} <ArrowRight className="w-3 h-3 ml-auto opacity-50" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                <Calendar className="w-4 h-4" />
                                                Fecha Límite: <span className="text-indigo-600 dark:text-indigo-400">{item.dueDate}</span>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {colItems.length === 0 && (
                                        <div className="h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex items-center justify-center text-sm font-medium text-slate-400 dark:text-slate-500 text-center px-4">
                                            No hay acciones aquí
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Simulación de Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Nuevo Compromiso</h2>
                        
                        <form onSubmit={addTask} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Título de la Acción
                                </label>
                                <input 
                                    type="text"
                                    autoFocus
                                    placeholder="Ej. Inscribirme a curso de React"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[15px] font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Fecha de Vencimiento
                                </label>
                                <input 
                                    type="date"
                                    value={newTaskDate}
                                    onChange={(e) => setNewTaskDate(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[15px] font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-xl font-bold border-slate-200 dark:border-slate-800"
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={!newTaskTitle.trim() || !newTaskDate}
                                    className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400"
                                >
                                    Guardar Acción
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
