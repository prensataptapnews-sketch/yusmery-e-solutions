"use client"

import Link from "next/link"
import { ClipboardList, Star, UserPlus, FileText, LayoutGrid, MessageCircle, Sliders, Users, Heart, Target, KanbanSquare, Smile, Activity, Tags, Brain } from "lucide-react"
import { EvaluacionesTour } from "@/components/dashboard/evaluaciones/evaluaciones-tour"

const AVAILABLE_EVALUATIONS = [
    {
        id: "ev-360",
        title: "Evaluación Dinámica",
        description: "Análisis integral de competencias directivas e inteligencia emocional cruzada.",
        icon: UserPlus,
        color: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-100 dark:border-indigo-900/50",
        route: "/dashboard/evaluaciones/360",
        status: "Disponible"
    },
    {
        id: "ev-9box",
        title: "Matriz de Talento 9-Box",
        description: "Mapeo transversal del equipo según su potencial a futuro y desempeño real.",
        icon: LayoutGrid,
        color: "bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400",
        border: "border-teal-100 dark:border-teal-900/50",
        route: "/dashboard/evaluaciones/matriz-talento",
        status: "Disponible"
    },
    {
        id: "ev-chat-sim",
        title: "Simulador de Retroalimentación",
        description: "Entrena tu asertividad en conversaciones difíciles tipo 'WhatsApp' interactivo.",
        icon: MessageCircle,
        color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
        border: "border-blue-100 dark:border-blue-900/50",
        route: "/dashboard/evaluaciones/entrega-resultados",
        status: "Disponible"
    },
    {
        id: "ev-auto",
        title: "Autoevaluación Dinámica",
        description: "Calibra tu propio nivel de desarrollo e inteligencia emocional usando selectores reactivos.",
        icon: Sliders,
        color: "bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
        border: "border-fuchsia-100 dark:border-fuchsia-900/50",
        route: "/dashboard/evaluaciones/autoevaluacion",
        status: "Disponible"
    },
    {
        id: "ev-peers",
        title: "Selección de Pares",
        description: "Elige estratégicamente a los 3 compañeros que te evaluarán en el cruzamiento 360.",
        icon: Users,
        color: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
        border: "border-orange-100 dark:border-orange-900/50",
        route: "/dashboard/evaluaciones/seleccionar-pares",
        status: "Disponible"
    },
    {
        id: "ev-kudos",
        title: "Muro de Reconocimientos",
        description: "Feed corporativo para celebrar logros de tus compañeros de forma abierta.",
        icon: Heart,
        color: "bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400",
        border: "border-pink-100 dark:border-pink-900/50",
        route: "/dashboard/evaluaciones/reconocimientos",
        status: "Disponible"
    },
    {
        id: "ev-metas",
        title: "Alineación de Metas OKR",
        description: "Reordena tus prioridades trimestrales mediante Drag & Drop para alinear la estrategia corporativa.",
        icon: Target,
        color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
        border: "border-blue-100 dark:border-blue-900/50",
        route: "/dashboard/evaluaciones/mis-metas",
        status: "Disponible"
    },
    {
        id: "ev-kanban",
        title: "Plan de Acción",
        description: "Transforma tus áreas de mejora en tareas tangibles utilizando una metodología ágil.",
        icon: KanbanSquare,
        color: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-100 dark:border-indigo-900/50",
        route: "/dashboard/evaluaciones/plan-accion",
        status: "Disponible"
    },
    {
        id: "ev-clima",
        title: "Termómetro de Clima",
        description: "El pulso diario de bienestar. Encuesta relámpago con emojis para medir la moral del equipo.",
        icon: Smile,
        color: "bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400",
        border: "border-pink-100 dark:border-pink-900/50",
        route: "/dashboard/evaluaciones/clima-laboral",
        status: "Disponible"
    },
    {
        id: "ev-radar",
        title: "Radar de Competencias",
        description: "Análisis cruzado en tiempo real entre tu autoevaluación y la calificación de tu líder.",
        icon: Activity,
        color: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-100 dark:border-indigo-900/50",
        route: "/dashboard/evaluaciones/radar-competencias",
        status: "Disponible"
    },
    {
        id: "ev-perfil",
        title: "Creador de Perfil",
        description: "Estructura tu ADN laboral seleccionando las top 5 competencias core de tu rol.",
        icon: Tags,
        color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
        border: "border-blue-100 dark:border-blue-900/50",
        route: "/dashboard/evaluaciones/mi-perfil",
        status: "Disponible"
    },
    {
        id: "ev-cou-ment",
        title: "Cou-Ment",
        description: "Simulador de liderazgo: toma decisiones ante casos reales y descubre tu estilo directivo.",
        icon: Brain,
        color: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400",
        border: "border-violet-100 dark:border-violet-900/50",
        route: "/dashboard/evaluaciones/cou-ment",
        status: "Disponible"
    }
]

export default function EvaluacionesMenuPage() {
    return (
        <div className="max-w-6xl mx-auto py-8 px-4 h-full flex flex-col">
            <div id="tour-header" className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <ClipboardList className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        Centro de Evaluaciones
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-2xl">
                        Bienvenido a tu hub de diagnósticos. Completa estas evaluaciones para desbloquear hitos en tu Plan Profesional Inteligente impulsado por IA.
                    </p>
                </div>
                <EvaluacionesTour />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {AVAILABLE_EVALUATIONS.map((ev) => (
                    <Link href={ev.route} key={ev.id} id={ev.id} className={ev.status === 'Disponible' ? 'cursor-pointer' : 'cursor-not-allowed pointer-events-none opacity-80'}>
                        <div className={`h-full bg-white dark:bg-slate-900 border ${ev.border} rounded-3xl p-6 transition-all duration-300 transform ${ev.status === 'Disponible' ? 'hover:-translate-y-1 hover:shadow-xl shadow-slate-200/50 dark:shadow-none' : 'shadow-none'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${ev.color}`}>
                                    <ev.icon className="w-7 h-7" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    ev.status === 'Disponible' 
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                                    : ev.status === 'Cerrado'
                                        ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                }`}>
                                    {ev.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{ev.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                                {ev.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
