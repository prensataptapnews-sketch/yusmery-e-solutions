"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, ClipboardList, Target, Heart, UserCircle, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/teacher/theme-toggle"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { UserNav } from "@/components/dashboard/user-nav"
import { PanelSwitcher } from "@/components/dashboard/panel-switcher"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const navItems = [
        { name: "Inicio", href: "/dashboard", icon: LayoutDashboard },
        { name: "Mis Cursos", href: "/courses", icon: BookOpen },
        { name: "Evaluaciones 360", href: "/dashboard/evaluaciones", icon: ClipboardList },
        { name: "Mis Metas (OKR)", href: "/dashboard/evaluaciones/mis-metas", icon: Target },
        { name: "Muro Kudos", href: "/dashboard/evaluaciones/reconocimientos", icon: Heart },
        { name: "Mi Perfil DNC", href: "/dashboard/evaluaciones/mi-perfil", icon: UserCircle },
    ]

    return (
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#020617] font-sans selection:bg-indigo-500/20 dark:selection:bg-indigo-500/40 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
            {/* Premium Dark Sidebar */}
            <aside className="w-72 bg-[#0B1121] text-slate-300 flex-col hidden md:flex border-r border-slate-800 relative overflow-hidden shadow-2xl">
                {/* Subtle top glare & ambient glow */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
                <div className="absolute top-0 -left-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="p-8 pb-6 flex items-center gap-4 relative z-10">
                    <div className="h-11 w-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 ring-1 ring-white/10 flex-shrink-0">
                        E<span className="text-indigo-200">s</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-xl text-white tracking-tight leading-none mb-1">E-Solutions</span>
                        <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-[0.2em] line-clamp-1">Colaborador</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto relative z-10 custom-scrollbar">
                    <div className="mb-6 px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Navegación Personal</div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300",
                                    isActive
                                        ? "bg-indigo-500/10 text-indigo-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] ring-1 ring-indigo-500/20"
                                        : "hover:bg-slate-800/50 hover:text-slate-100"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110 flex-shrink-0",
                                    isActive ? "text-indigo-400" : "text-slate-300 group-hover:text-slate-100"
                                )} />
                                <span className="truncate">{item.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(129,140,248,0.8)] flex-shrink-0" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 mx-4 mb-4 border border-slate-800/60 rounded-2xl bg-slate-900/40 backdrop-blur-md relative z-10 shadow-inner">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl font-medium transition-colors"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                    >
                        <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
                        <span className="truncate">Cerrar Sesión</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/4" />

                {/* Highly Organized Inner Header */}
                <header className="h-16 px-8 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl flex items-center justify-between sticky top-0 z-40 transition-colors">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none">Tu Espacio</h1>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1.5">Aprendizaje y Desarrollo</p>
                        </div>

                    </div>
                    
                    <div className="flex items-center gap-3">
                        <PanelSwitcher />
                        <ThemeToggle />
                        <UserNav />
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-10 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
