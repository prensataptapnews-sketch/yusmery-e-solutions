"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { UserCircle, GraduationCap, ShieldCheck, ChevronDown, Loader2, ArrowRightLeft } from "lucide-react"

interface Panel {
    id: string
    name: string
    email: string
    route: string
    icon: React.ElementType
    gradient: string
    dotColor: string
}

const PANELS: Panel[] = [
    {
        id: "colaborador",
        name: "Colaborador",
        email: "colaborador@empresa.com",
        route: "/dashboard",
        icon: UserCircle,
        gradient: "from-blue-500 to-indigo-600",
        dotColor: "bg-blue-400"
    },
    {
        id: "profesor",
        name: "Profesor",
        email: "profe@empresa.com",
        route: "/teacher",
        icon: GraduationCap,
        gradient: "from-purple-500 to-pink-600",
        dotColor: "bg-purple-400"
    },
    {
        id: "administrador",
        name: "Administrador",
        email: "admin@esolutions.com",
        route: "/super-admin",
        icon: ShieldCheck,
        gradient: "from-amber-400 to-orange-500",
        dotColor: "bg-amber-400"
    }
]

export function PanelSwitcher() {
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState<string | null>(null)

    // Detect current panel based on pathname
    const current = PANELS.find(p => pathname.startsWith(p.route)) || PANELS[0]

    const switchTo = (e: React.MouseEvent, panel: Panel) => {
        if (panel.id === current.id) {
            e.preventDefault()
            return
        }
        
        e.preventDefault()
        setOpen(false)
        router.push(panel.route)
        router.refresh()
    }

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className="group flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all duration-200 hover:shadow-md"
            >
                <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
                <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${current.gradient} shrink-0`} />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-none mt-px">
                    {current.name}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            {open && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

                    {/* Panel */}
                    <div className="absolute right-0 top-full mt-2 w-64 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl shadow-slate-900/15 dark:shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                                Cambiar Panel
                            </p>
                        </div>

                        <div className="p-2 flex flex-col gap-1">
                            {PANELS.map((panel) => {
                                const Icon = panel.icon
                                const isActive = panel.id === current.id
                                const isLoading = loading === panel.id

                                return (
                                    <button
                                        key={panel.id}
                                        type="button"
                                        onClick={(e) => switchTo(e, panel)}
                                        disabled={isActive || isLoading}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
                                            isActive
                                                ? "bg-slate-50 dark:bg-slate-800/60 cursor-default"
                                                : "hover:bg-slate-50 dark:hover:bg-slate-800/50 active:scale-[0.98] cursor-pointer"
                                        } ${isLoading ? "opacity-70 pointer-events-none" : ""}`}
                                    >
                                        {/* Icon */}
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${panel.gradient} shadow-sm`}>
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                                            ) : (
                                                <Icon className="w-4 h-4 text-white" />
                                            )}
                                        </div>

                                        {/* Label */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-bold leading-none ${isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                                                        {panel.name}
                                                    </span>
                                                    {isActive && (
                                                        <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-900/50 px-1.5 py-0.5 rounded-md leading-none">
                                                            Activo
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    {panel.route}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        {!isActive && !isLoading && (
                                            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0 group-hover:text-indigo-400 dark:group-hover:text-indigo-400 transition-colors" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 text-center">
                                🔒 Modo Demo — cambio instantáneo
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
