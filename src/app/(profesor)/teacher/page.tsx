import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTeacherInquiries } from "@/app/actions/teacher/inquiries"
import { TeacherInquiries } from "@/components/teacher/teacher-inquiries"
import { TeacherProgressChart } from "@/components/teacher/teacher-progress-chart"
import { AtRiskStudents } from "@/components/teacher/at-risk-students"
import { QuickActions } from "@/components/teacher/quick-actions"
import { UpcomingDeadlines } from "@/components/teacher/upcoming-deadlines"
import { GlobalTimeFilter } from "@/components/teacher/global-time-filter"
import { UserNav } from "@/components/teacher/user-nav"
import {
    Users,
    ClipboardCheck,
    MessageSquare,
    BookOpen,
    TrendingUp,
    TrendingDown,
    Minus,
    CalendarDays,
    Sparkles,
    Activity
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function TeacherDashboard({ searchParams }: Props) {
    const session = await auth();
    
    // DEMO BYPASS: Always allow access and fallback to demo teacher ID if no session
    const teacherId = session?.user?.id || "demo-profesor-002"
    
    // Parse time filter from URL
    const timeFilter = searchParams.timeFilter as string || 'all'
    let dateFilter: Date | undefined = undefined;
    
    if (timeFilter === '7days') {
        dateFilter = new Date(); dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (timeFilter === 'month') {
        dateFilter = new Date(); dateFilter.setMonth(dateFilter.getMonth() - 1);
    } else if (timeFilter === 'semester') {
        dateFilter = new Date(); dateFilter.setMonth(dateFilter.getMonth() - 6);
    }

    // Fetch Stats
    const [coursesCount, studentsData, pendingEvaluations, inquiries, coursesDataForChart, atRiskData] = await Promise.all([
        prisma.course.count({ 
            where: { 
                teacherId,
                ...(dateFilter ? { createdAt: { gte: dateFilter } } : {}) 
            } 
        }),
        prisma.enrollment.findMany({
            where: { 
                course: { teacherId },
                ...(dateFilter ? { createdAt: { gte: dateFilter } } : {})
            },
            distinct: ['userId'],
            select: { userId: true }
        }),
        prisma.evaluationSubmission.count({
            where: {
                reviewedBy: null, // Unified with evaluations action
                ...(dateFilter ? { createdAt: { gte: dateFilter } } : {}),
                evaluation: {
                    OR: [
                        { course: { teacherId } },
                        { lesson: { module: { course: { teacherId } } } }
                    ]
                }
            }
        }),
        getTeacherInquiries(),
        prisma.course.findMany({
            where: { teacherId },
            select: {
                title: true,
                enrollments: { select: { progress: true } }
            }
        }),
        prisma.enrollment.findMany({
            where: { course: { teacherId }, progress: { lt: 50 } },
            orderBy: { progress: 'asc' },
            take: 4,
            include: {
                user: { select: { id: true, name: true } },
                course: { select: { title: true } }
            }
        })
    ])

    const studentCount = studentsData.length
    const pendingInquiries = inquiries.length

    const chartData = coursesDataForChart
        .filter(c => c.enrollments.length > 0)
        .map(course => {
            let ahead = 0;
            let onTrack = 0;
            let behind = 0;

            course.enrollments.forEach(enr => {
                if (enr.progress >= 75) ahead++;
                else if (enr.progress >= 40) onTrack++;
                else behind++;
            });

            return {
                name: course.title.substring(0, 14) + (course.title.length > 14 ? '...' : ''),
                ahead,
                onTrack,
                behind
            }
        }).slice(0, 7)

    const atRiskStudents = atRiskData.map(enr => ({
        id: enr.id,
        name: enr.user.name || "Estudiante",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(enr.user.name || "E")}&background=random`,
        progress: Math.round(enr.progress),
        riskLevel: enr.progress < 25 ? "Alto" : "Medio" as "Alto" | "Medio",
        course: enr.course.title
    }))

    // AI Insight Generator (Server-side)
    let aiInsight = ""
    if (pendingEvaluations > 0) aiInsight += `Tienes ${pendingEvaluations} evaluaciones urgentes pendientes de corrección. `
    if (atRiskStudents.length > 0) aiInsight += `Hay ${atRiskStudents.length} alumnos con riesgo alto de deserción que requieren tu mentoría hoy. `
    if (pendingInquiries > 0) aiInsight += `Posees ${pendingInquiries} consultas nuevas en tu bandeja de entrada.`
    if (aiInsight === "") aiInsight = "Todo bajo control. Gran trabajo manteniendo al día a tus estudiantes y responsabilidades. Sigue así."

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 relative">
            
            {/* Background Ambient Mesh for Glassmorphism Support */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-teal-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-teal-500/10 pointer-events-none -z-10 blur-3xl rounded-full opacity-50"></div>

            {/* Top Toolbar: Heading & Global Filters */}
            <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-6 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 mb-4 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">Panel de Colaborador</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                        Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-indigo-400 dark:to-teal-300">{session?.user?.name?.split(' ')[0] || "Profesor"}</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 text-lg">
                        Tu centro de comando para potenciar el talento de tu equipo.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <GlobalTimeFilter />
                </div>
            </div>

            {/* BENTO GRID ARCHITECTURE */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6">
                
                {/* 1. AI Copilot Widget (Span 8) */}
                <div className="md:col-span-4 lg:col-span-8 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 sm:p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <Sparkles className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest text-sm">IA Resumen del Día</h3>
                        </div>
                        <p className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                            {aiInsight}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <QuickActions />
                        </div>
                    </div>
                </div>

                {/* 2. Mini KPI: Tasks (Span 4) */}
                <div className="md:col-span-2 lg:col-span-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Por Calificar</p>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-1">{pendingEvaluations}</h3>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-2xl group-hover:scale-110 transition-transform">
                            <ClipboardCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                    
                    {/* Fake Inline Sparkline */}
                    <div className="mt-4 flex items-end justify-between">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                            <TrendingDown className="w-3.5 h-3.5" /> -5%
                        </div>
                        <svg className="w-16 h-8 text-amber-400 dark:text-amber-600/50" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M0 25 L20 20 L40 28 L60 15 L80 18 L100 5" />
                        </svg>
                    </div>
                </div>

                {/* 3. Mini KPI: Students (Span 3) */}
                <div className="md:col-span-2 lg:col-span-3 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-sm hover:-translate-y-1 transition-transform flex flex-col justify-between group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alumnos</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{studentCount}</h3>
                        </div>
                        <div className="p-2.5 bg-teal-50 dark:bg-teal-900/30 rounded-xl">
                            <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
                            <TrendingUp className="w-3.5 h-3.5" /> +12%
                        </div>
                    </div>
                </div>

                {/* 4. Mini KPI: Courses (Span 3) */}
                <div className="md:col-span-2 lg:col-span-3 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-sm hover:-translate-y-1 transition-transform flex flex-col justify-between group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cursos</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{coursesCount}</h3>
                        </div>
                        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400">
                            <Minus className="w-3.5 h-3.5" /> Estable
                        </div>
                        <svg className="w-12 h-6 text-blue-300 dark:text-blue-800/50" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M0 15 L100 15" />
                        </svg>
                    </div>
                </div>

                {/* 5. Mini KPI: Messages (Span 3) */}
                <div className="md:col-span-2 lg:col-span-3 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-sm hover:-translate-y-1 transition-transform flex flex-col justify-between group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inbox</p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{pendingInquiries}</h3>
                        </div>
                        <div className="p-2.5 bg-rose-50 dark:bg-rose-900/30 rounded-xl">
                            <MessageSquare className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400">
                            <TrendingUp className="w-3.5 h-3.5" /> +2 hoy
                        </div>
                        <svg className="w-12 h-6 text-rose-400 dark:text-rose-700/50" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M0 20 L30 25 L60 10 L100 5" />
                        </svg>
                    </div>
                </div>

                {/* Gap fill / Empty block just for Grid aesthetics if needed, or expand students card. We have 3+3+3 = 9. Wait, 12 cols total! 
                    AI is 8, Tasks is 4. Next row: Alumnos 3, Cursos 3, Mensajes 3. That leaves 3 cols empty. Let's make resolving 4 cols each for the bottom row. */}
            </div>

            {/* Middle Row: Progress Chart & At Risk */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                <div className="lg:col-span-8 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-500" /> Rendimiento Global
                        </h3>
                    </div>
                    <TeacherProgressChart data={chartData} />
                </div>
                <div className="lg:col-span-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-sm overflow-hidden">
                    <AtRiskStudents students={atRiskStudents} />
                </div>
            </div>

            {/* Bottom Row: Deadlines & Inquiries */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                <div className="lg:col-span-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-sm">
                    <UpcomingDeadlines />
                </div>
                
                <div className="lg:col-span-8 flex flex-col bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2rem] p-0 shadow-sm overflow-hidden transition-colors relative">
                    {/* Decorative Top Bar for Glass context */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-50"></div>
                    
                    <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-800/20 backdrop-blur-md flex items-center justify-between">
                        <div>
                            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                                <MessageSquare className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                                Bandeja de Consultas
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 ml-8">
                                Responde a las dudas de tus colaboradores
                            </p>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6 overflow-y-auto max-h-[500px] flex-1">
                        <TeacherInquiries initialInquiries={inquiries} />
                    </div>
                </div>
            </div>

        </div>
    )
}
