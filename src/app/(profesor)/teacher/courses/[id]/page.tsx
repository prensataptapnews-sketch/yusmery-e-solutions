import { notFound } from "next/navigation"
import { getTeacherCourseDetails } from "@/app/actions/teacher"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Users,
    BookOpen,
    ChevronLeft,
    LayoutDashboard,
    GraduationCap,
    FileText,
    TrendingUp,
    MoreVertical,
    BarChart2
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function TeacherCourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const course = await getTeacherCourseDetails(id) as any

    if (!course) {
        notFound()
    }

    const totalStudents = course.enrollments.length
    const completedStudents = course.enrollments.filter((e: any) => e.status === "COMPLETED").length
    const avgProgress = totalStudents > 0
        ? Math.round(course.enrollments.reduce((acc: number, curr: any) => acc + curr.progress, 0) / totalStudents)
        : 0

    return (
        <div className="space-y-6">
            {/* Breadcrumbs / Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                        <Link href="/teacher/courses" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                            <ChevronLeft className="h-4 w-4" />
                            Mis Cursos
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{course.title}</h1>
                    <p className="text-muted-foreground mt-1">Gestión avanzada del programa y seguimiento de alumnos.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Reporte PDF
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Añadir Contenido
                    </Button>
                </div>
            </div>

            {/* Quick Stats Dashboard */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-indigo-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Alumnos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStudents}</div>
                        <p className="text-xs text-muted-foreground mt-1">Matriculados activos</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completados</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedStudents}</div>
                        <p className="text-xs text-muted-foreground mt-1">{totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0}% de tasa éxito</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgProgress}%</div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${avgProgress}%` }}></div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-slate-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Módulos</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{course._count.modules}</div>
                        <p className="text-xs text-muted-foreground mt-1">Unidades de aprendizaje</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="students" className="space-y-4">
                <TabsList className="bg-slate-100/50 p-1 border">
                    <TabsTrigger value="students" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Alumnos Matriculados
                    </TabsTrigger>
                    <TabsTrigger value="content" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Estructura del Curso
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Analíticas
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="students">
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg">Seguimiento Individual</CardTitle>
                            <CardDescription>Monitorea el avance de tus alumnos y gestiona sus inscripciones.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border border-slate-200 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-4 py-3 text-left font-medium text-slate-500">Alumno</th>
                                            <th className="px-4 py-3 text-left font-medium text-slate-500">Progreso</th>
                                            <th className="px-4 py-3 text-left font-medium text-slate-500">Estado</th>
                                            <th className="px-4 py-3 text-left font-medium text-slate-500">Acceso</th>
                                            <th className="px-4 py-3 text-right font-medium text-slate-500"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {course.enrollments.map((e: any) => (
                                            <tr key={e.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold border border-indigo-100">
                                                            {e.user.name?.[0] || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">{e.user.name}</p>
                                                            <p className="text-xs text-slate-500">{e.user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2 max-w-[120px]">
                                                        <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${e.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                                style={{ width: `${e.progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs font-semibold text-slate-700 min-w-[30px]">{Math.round(e.progress)}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge variant={e.status === 'COMPLETED' ? 'default' : 'secondary'} className={e.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'}>
                                                        {e.status === 'COMPLETED' ? 'Finalizado' : 'En curso'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4 text-slate-500 text-xs">
                                                    {new Date(e.updatedAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-slate-600">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="content">
                    <Card className="border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Temario del Programa</CardTitle>
                                <CardDescription>Distribución de módulos y lecciones del curso.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                Reordenar
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {course.modules.map((m: any, idx: number) => (
                                <div key={m.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50/30 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white border rounded-md px-3 py-1 text-sm font-bold text-slate-400">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{m.title}</p>
                                            <p className="text-xs text-slate-500">{m._count.lessons} lecciones configuradas</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                        Configurar Módulo
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics">
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg">Rendimiento Detallado</CardTitle>
                            <CardDescription>Gráficas de interacción y puntos de abandono.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-64 flex flex-col items-center justify-center text-center p-12 bg-slate-50/50 rounded-lg border-2 border-dashed">
                            <BarChart2 className="h-12 w-12 text-slate-300 mb-2" />
                            <p className="text-slate-500 font-medium">Estadísticas avanzadas disponibles próximamente</p>
                            <p className="text-slate-400 text-sm max-w-sm">Estamos procesando los datos de interacción para generar reportes de retención por lección.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
