import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTeacherInquiries } from "@/app/actions/teacher/inquiries"
import { TeacherInquiries } from "@/components/teacher/teacher-inquiries"
import { UserNav } from "@/components/teacher/user-nav"
import {
    Users,
    BookOpen,
    GraduationCap,
    MessageSquare,
    Activity,
    ArrowUpRight,
    TrendingUp,
    CheckCircle2,
    Clock,
    ClipboardCheck
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function TeacherDashboard() {
    const session = await auth();

    if (!session?.user || !['PROFESOR', 'TEACHER', 'SUPER_ADMIN'].includes(session.user.role as string)) {
        redirect("/login");
    }

    // Use top-level prisma instead of dynamic import
    const teacherId = session.user.id

    // Fetch Stats
    const [coursesCount, studentsData, pendingEvaluations, inquiries] = await Promise.all([
        prisma.course.count({ where: { teacherId } }),
        prisma.enrollment.findMany({
            where: { course: { teacherId } },
            distinct: ['userId'],
            select: { userId: true }
        }),
        prisma.evaluationSubmission.count({
            where: {
                reviewedBy: null, // Unified with evaluations action
                evaluation: {
                    OR: [
                        { course: { teacherId } },
                        { lesson: { module: { course: { teacherId } } } }
                    ]
                }
            }
        }),
        getTeacherInquiries()
    ])

    const studentCount = studentsData.length
    const pendingInquiries = inquiries.length

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bienvenido, {session.user.name?.split(' ')[0]}</h1>
                    <p className="text-slate-500">Panel de Control para Instructores • E-Solutions LMS</p>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-slate-900">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-xs text-slate-500">Estado del sistema: Óptimo</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-indigo-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cursos Asignados</CardTitle>
                        <BookOpen className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{coursesCount}</div>
                        <p className="text-xs text-slate-500 mt-1">Activos para tutoría</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-teal-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Alumnos</CardTitle>
                        <Users className="h-4 w-4 text-teal-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{studentCount}</div>
                        <p className="text-xs text-slate-500 mt-1">Bajo tu supervisión</p>
                    </CardContent>
                </Card>

                <Card className={`border-l-4 ${pendingEvaluations > 0 ? 'border-l-amber-500 shadow-amber-50' : 'border-l-slate-200'} shadow-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tareas/Exámenes</CardTitle>
                        <ClipboardCheck className={`h-4 w-4 ${pendingEvaluations > 0 ? 'text-amber-500' : 'text-slate-300'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{pendingEvaluations}</div>
                        <p className="text-xs text-slate-500 mt-1">Pendientes de calificar</p>
                    </CardContent>
                </Card>

                <Card className={`border-l-4 ${pendingInquiries > 0 ? 'border-l-rose-500 shadow-rose-50' : 'border-l-slate-200'} shadow-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Consultas</CardTitle>
                        <MessageSquare className={`h-4 w-4 ${pendingInquiries > 0 ? 'text-rose-500' : 'text-slate-300'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{pendingInquiries}</div>
                        <p className="text-xs text-slate-500 mt-1">Mensajes directos</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 shadow-sm border-slate-200">
                    <CardHeader className="border-b pb-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Progreso del Programa</CardTitle>
                                <CardDescription>Avance acumulado en tus áreas de enseñanza.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">Ver Reporte Detallado</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        {/* Inline Mock Chart for high-fidelity look */}
                        <div className="h-full w-full flex flex-col justify-end gap-2 pt-6">
                            <div className="flex items-end justify-around h-full px-4 border-b border-l pb-2">
                                {[
                                    { name: "Liderazgo", value: 85, color: "bg-indigo-500" },
                                    { name: "IA Aplicada", value: 42, color: "bg-indigo-400" },
                                    { name: "Equipos", value: 65, color: "bg-indigo-300" },
                                    { name: "Bienestar", value: 92, color: "bg-teal-500" },
                                    { name: "Habilidades", value: 78, color: "bg-indigo-600" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-2 group relative w-12">
                                        <div className="absolute -top-8 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {item.value}% Progreso
                                        </div>
                                        <div
                                            className={`${item.color} w-full rounded-t-sm transition-all hover:scale-110`}
                                            style={{ height: `${item.value}%` }}
                                        />
                                        <span className="text-[10px] font-medium text-slate-500 rotate-45 mt-4 origin-left whitespace-nowrap">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 shadow-sm border-slate-200 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <MessageSquare className="h-4 w-4 text-indigo-500" />
                            Consultas Pendientes
                        </CardTitle>
                        <CardDescription>Responde a las dudas de tus alumnos.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 overflow-y-auto max-h-[450px]">
                        <TeacherInquiries initialInquiries={inquiries} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
