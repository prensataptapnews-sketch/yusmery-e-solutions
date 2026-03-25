"use client"

import { CalendarClock, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'

const mockDeadlines = [
    { id: 1, title: "Revisión Proyecto Final", course: "Advanced React", type: "Grading", time: "En 2 horas", urgency: "critical" },
    { id: 2, title: "Tutoría en Vivo (Grupo B)", course: "UI/UX Basics", type: "Session", time: "Mañana, 10:00 AM", urgency: "warning" },
    { id: 3, title: "Carga de Calificaciones", course: "TypeScript Pro", type: "Admin", time: "Mañana, 23:59 PM", urgency: "normal" }
]

export function UpcomingDeadlines() {
    return (
        <div className="flex flex-col h-full w-full">
            <div className="mb-6 flex flex-col gap-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                    <CalendarClock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    Próximas Entregas
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-7">Cronograma a 48 horas</p>
            </div>

            <div className="flex-1">
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-8">
                    {mockDeadlines.map((deadline) => {
                        let dotColor = "bg-slate-200 dark:bg-slate-700", dotRing = "ring-white dark:ring-slate-900", Icon = Clock
                        if (deadline.urgency === 'critical') {
                            dotColor = "bg-rose-500 dark:bg-rose-400"; dotRing = "ring-rose-50 dark:ring-rose-500/20"; Icon = AlertCircle
                        } else if (deadline.urgency === 'warning') {
                            dotColor = "bg-amber-500 dark:bg-amber-400"; dotRing = "ring-amber-50 dark:ring-amber-500/20"; Icon = Clock
                        } else {
                            dotColor = "bg-indigo-500 dark:bg-indigo-400"; dotRing = "ring-indigo-50 dark:ring-indigo-500/20"; Icon = CheckCircle2
                        }

                        return (
                            <div key={deadline.id} className="relative pl-6 group">
                                <div className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 ${dotColor} ring-4 ${dotRing} group-hover:scale-125 transition-transform`} />
                                
                                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                                            {deadline.title}
                                        </h4>
                                        <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-md tracking-wider ${
                                            deadline.urgency === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' : 
                                            deadline.urgency === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                        }`}>
                                            {deadline.type}
                                        </span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">{deadline.course}</p>
                                    
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/50 w-fit px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <Icon className={`w-3.5 h-3.5 ${deadline.urgency === 'critical' ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
                                        <span className={deadline.urgency === 'critical' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'}>{deadline.time}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
