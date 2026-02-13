
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, BookOpen, BarChart3, TrendingUp, AlertCircle } from "lucide-react"
import { redirect } from "next/navigation"
import { ParticipationChart } from "@/components/admin/participation-chart"
import { ModalityChart } from "@/components/admin/modality-chart"
import { Area } from "@prisma/client"

export default async function AdminDashboard() {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMINISTRADOR") {
        redirect("/")
    }

    // Logic for ADMINISTRADOR
    let userAreas: string[] = [];
    // @ts-ignore
    const assignedData = session.user.assignedAreas;
    // @ts-ignore
    const singleArea = session.user.area as string;

    if (assignedData) {
        if (Array.isArray(assignedData)) {
            userAreas = assignedData;
        } else if (typeof assignedData === 'string') {
            try {
                // Handle if it's a JSON string "['TALENTO', 'FINANZAS']" or single
                // @ts-ignore
                const parsed = JSON.parse(assignedData.replace(/'/g, '"'));
                userAreas = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                // Fallback if parsing fails but it's a simple string
                userAreas = [assignedData];
            }
        }
    } else if (singleArea) {
        userAreas = [singleArea];
    }

    // If no area assigned, show empty state
    if (userAreas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <AlertCircle className="h-10 w-10 text-amber-500 mb-4" />
                <h2 className="text-xl font-semibold">Sin Área Asignada</h2>
                <p className="text-slate-500">Contacta al Super Admin para asignarte un área de gestión.</p>
            </div>
        )
    }

    // Prisma Queries filtered by Area
    // 1. Users in Area
    // @ts-ignore
    const usersCount = await prisma.user.count({
        where: {
            // @ts-ignore
            area: { in: userAreas }
        }
    })

    // 2. Enrollments in Area (Active enrollments where user is in Area)
    const activeEnrollments = await prisma.enrollment.count({
        where: {
            status: 'ACTIVE',
            user: {
                // @ts-ignore
                area: { in: userAreas }
            }
        }
    })

    // 3. Courses placeholder
    const coursesCount = await prisma.course.count({
        where: {
            teacher: {
                // @ts-ignore
                area: { in: userAreas }
            }
        }
    })

    // Recent Users
    const recentUsers = await prisma.user.findMany({
        // @ts-ignore
        where: { area: { in: userAreas } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, area: true, createdAt: true }
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard de {userAreas.join(", ")}</h1>
                <p className="text-slate-500">Vista general de tu área asignada.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usersCount}</div>
                        <p className="text-xs text-muted-foreground">En {userAreas.length} área(s)</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Matrículas Activas</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeEnrollments}</div>
                        <p className="text-xs text-muted-foreground">Estudiantes activos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cursos del Área</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{coursesCount}</div>
                        <p className="text-xs text-muted-foreground">Gestionados por instructores del área</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ParticipationChart data={
                    // Mock data for now, ideally this comes from DB aggregation
                    userAreas.map(area => ({ name: area, value: Math.floor(Math.random() * 100) + 10 }))
                } />
                <ModalityChart data={[
                    { name: 'Online', value: 400 },
                    { name: 'Presencial', value: 300 },
                    { name: 'Híbrido', value: 300 },
                ]} />
            </div>

            {/* Lists section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Colaboradores Recientes</CardTitle>
                        <CardDescription>Últimos usuarios registrados en tu área.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentUsers.length === 0 ? (
                                <p className="text-sm text-slate-500">No hay colaboradores recientes.</p>
                            ) : (
                                recentUsers.map(u => (
                                    <div key={u.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div>
                                            <p className="font-medium text-sm">{u.name}</p>
                                            <p className="text-xs text-slate-500">{u.email}</p>
                                        </div>
                                        <div className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">
                                            {u.area}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 bg-slate-50 border-dashed">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            Reporte Rápido
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 mb-4">
                            Como administrador de <strong>{userAreas.join(", ")}</strong>, puedes generar reportes detallados de avance y cumplimiento.
                        </p>
                        <div className="h-32 bg-white rounded border flex items-center justify-center text-slate-400 text-sm">
                            Gráfico de Avance (Próximamente)
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
