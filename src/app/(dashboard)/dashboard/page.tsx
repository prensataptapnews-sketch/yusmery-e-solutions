import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { HeroCard } from "@/components/dashboard/hero-card"
import { auth } from "@/lib/auth"
import { getStudentDashboardData } from "@/app/actions/dashboard"
import { getDashboardStats, getPerformanceTrend } from "@/app/actions/bi-actions"

import { PerformanceAnalytics } from "@/components/dashboard/premium/performance-analytics"
import { SmartAgenda } from "@/components/dashboard/premium/smart-agenda"
import Link from "next/link"
import { Target, Heart, ClipboardList, Activity, Sparkles } from "lucide-react"

export default async function DashboardPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const data = await getStudentDashboardData()
    const talentStats = await getDashboardStats()
    const performanceTrend = await getPerformanceTrend()

    const dashboardData: any = data || {
        currentCourse: null,
        courses: [],
        stats: { totalCourses: 0, completed: 0, inProgress: 0, avgProgress: 0 },
        performance: [],
        agenda: [],
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                        Hola, {session.user?.name?.split(" ")[0] || "Colaborador"} 
                        <Sparkles className="h-6 w-6 text-indigo-500 animate-pulse" />
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Tienes {dashboardData.stats.inProgress} cursos en progreso. Sigue así.
                    </p>
                </div>
            </header>

            {/* Bento Grid Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                
                {/* Left Column - Core Focus (8/12) */}
                <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
                    
                    {/* Hero Course */}
                    <div className="rounded-[2rem] overflow-hidden shadow-sm ring-1 ring-slate-200 dark:ring-slate-800/80">
                        <HeroCard course={dashboardData.currentCourse as any} />
                    </div>

                    {/* Quick Access to Interactive Modules */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Link href="/dashboard/evaluaciones/mis-metas" className="group bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                <Target className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">Mis Metas (OKRs)</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {talentStats.goalsProgress}% de progreso promedio
                                </p>
                            </div>
                            {talentStats.goalsProgress > 0 && (
                                <div className="absolute top-4 right-4 bg-indigo-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
                                    LIVE
                                </div>
                            )}
                        </Link>

                        <Link href="/dashboard/evaluaciones/reconocimientos" className="group bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:border-pink-500/30 transition-all flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden">
                            <div className="h-14 w-14 rounded-2xl bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all">
                                <Heart className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">Kudos y Reconocimientos</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Has recibido {talentStats.kudosReceived} kudos
                                </p>
                            </div>
                            {talentStats.kudosReceived > 0 && (
                                <div className="absolute top-4 right-4 bg-pink-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg animate-bounce">
                                    {talentStats.kudosReceived}
                                </div>
                            )}
                        </Link>

                         <Link href="/dashboard/evaluaciones/clima-laboral" className="group bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:border-teal-500/30 transition-all flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden">
                            <div className="h-14 w-14 rounded-2xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-white transition-all">
                                <Activity className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">Clima Laboral</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {talentStats.climatePulse > 0 ? `Tu último pulso: ${talentStats.climatePulse}/10` : "Comparte cómo te sientes hoy"}
                                </p>
                            </div>
                        </Link>

                        <Link href="/dashboard/evaluaciones" className="group bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <ClipboardList className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">Hub de Evaluaciones</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {talentStats.evaluationsCount} evaluaciones históricas
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Right Column - Analytics & Schedule (4/12) */}
                <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
                    <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-sm overflow-hidden">
                        <PerformanceAnalytics data={performanceTrend} stats={dashboardData.stats} />
                    </div>

                    <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-sm flex-1 overflow-hidden">
                        <SmartAgenda items={dashboardData.agenda || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}
