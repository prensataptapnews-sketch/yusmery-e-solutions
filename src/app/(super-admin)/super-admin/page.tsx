"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, BookOpen, TrendingUp, Plus, FileText, Download, Target } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { toast } from "sonner"
import { getDashboardStats } from "@/app/actions/super-admin/dashboard"

const growthData2024 = [
    { name: "Ene", active: 4, users: 120 },
    { name: "Feb", active: 7, users: 350 },
    { name: "Mar", active: 12, users: 890 },
    { name: "Abr", active: 18, users: 1450 },
    { name: "May", active: 25, users: 2100 },
    { name: "Jun", active: 32, users: 3400 },
]

const growthData2023 = [
    { name: "Ene", active: 1, users: 20 },
    { name: "Feb", active: 2, users: 50 },
    { name: "Mar", active: 3, users: 100 },
    { name: "Abr", active: 3, users: 150 },
    { name: "May", active: 4, users: 220 },
    { name: "Jun", active: 5, users: 310 },
]

const roleData = [
    { role: "Collaborators", count: 2800, color: "bg-blue-500" },
    { role: "Managers", count: 145, color: "bg-teal-500" },
    { role: "Instructors", count: 42, color: "bg-indigo-500" },
    { role: "Admins", count: 15, color: "bg-slate-800" },
]

export default function SuperAdminDashboard() {
    const [year, setYear] = useState("2024")
    const [stats, setStats] = useState({
        totalCompanies: 0,
        newCompanies: 0,
        totalUsers: 0,
        newUsers: 0,
        totalCourses: 0
    })

    useEffect(() => {
        const loadStats = async () => {
            const data = await getDashboardStats()
            setStats(data)
        }
        loadStats()
    }, [])

    const chartData = year === "2024" ? growthData2024 : growthData2023

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF()

            // Header
            doc.setFontSize(20)
            doc.text("Reporte Dashboard Global", 14, 22)
            doc.setFontSize(11)
            doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 30)

            // KPIs Summary
            const kpiData = [
                ["KPI", "Valor", "Detalle"],
                ["Empresas Activas", stats.totalCompanies.toString(), `+${stats.newCompanies} esta semana`],
                ["Usuarios Totales", stats.totalUsers.toLocaleString(), `+${stats.newUsers} vs mes anterior`],
                ["Cursos Publicados", stats.totalCourses.toString(), "En 5 categorías"],
                ["Crecimiento ARR", "+24.5%", "Proyección anual positiva"]
            ]

            autoTable(doc, {
                head: [kpiData[0]],
                body: kpiData.slice(1),
                startY: 40,
                styles: { fontSize: 10, cellPadding: 3 },
                headStyles: { fillColor: [15, 23, 42] } // slate-900
            })

            // Chart Data Table
            doc.text(`Crecimiento Mensual (${year})`, 14, (doc as any).lastAutoTable.finalY + 15)

            const chartTableData = chartData.map(d => [d.name, d.users.toString(), d.active.toString()])

            autoTable(doc, {
                head: [["Mes", "Usuarios", "Empresas Activas"]],
                body: chartTableData,
                startY: (doc as any).lastAutoTable.finalY + 20,
                styles: { fontSize: 9 },
                headStyles: { fillColor: [37, 99, 235] } // blue-600
            })

            doc.save(`dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`)
            toast.success("Reporte exportado exitosamente")
        } catch (error) {
            console.error(error)
            toast.error("Error al generar el PDF")
        }
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Global</h1>
                    <p className="text-slate-500">Vista general del rendimiento de la plataforma SaaS.</p>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-slate-900 hover:bg-slate-800 gap-2" onClick={handleExportPDF}>
                        <Download className="h-4 w-4" /> Exportar Data (PDF)
                    </Button>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Empresas Activas</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCompanies}</div>
                        <p className="text-xs text-muted-foreground">+{stats.newCompanies} esta semana</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+{stats.newUsers} este mes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cursos Publicados</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCourses}</div>
                        <p className="text-xs text-muted-foreground">En 5 categorías</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Crecimiento ARR</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">$24,500 USD</div>
                        <p className="text-xs text-muted-foreground">+24.5% vs año anterior</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {/* Main Chart */}
                <Card className="col-span-1 lg:col-span-4">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Crecimiento Mensual</CardTitle>
                                <CardDescription>Usuarios activos vs Empresas registradas</CardDescription>
                            </div>
                            <Select value={year} onValueChange={setYear}>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Año" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                                    <Line type="monotone" dataKey="users" name="Usuarios" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="active" name="Empresas" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Role Breakdown & Actions */}
                <div className="col-span-1 lg:col-span-3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Usuarios por Rol</CardTitle>
                            <CardDescription>Distribución actual de la base de usuarios</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {roleData.map((item) => (
                                <div key={item.role} className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${item.color}`} />
                                    <div className="flex-1 text-sm font-medium text-slate-700">{item.role}</div>
                                    <div className="text-sm font-bold text-slate-900">{item.count.toLocaleString()}</div>
                                </div>
                            ))}

                            <div className="pt-4 mt-4 border-t">
                                <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-500">Capacidad del Plan</span>
                                    <span className="text-xs font-bold text-slate-700">85% Utilizado</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                                    <div className="bg-slate-800 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Acciones Rápidas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href="/super-admin/companies/new">
                                <Button className="w-full justify-start mb-3" variant="outline">
                                    <Plus className="mr-2 h-4 w-4" /> Crear Nueva Empresa
                                </Button>
                            </Link>
                            <Link href="/super-admin/users/enroll">
                                <Button className="w-full justify-start mb-3" variant="outline">
                                    <Users className="mr-2 h-4 w-4" /> Matricular Usuarios
                                </Button>
                            </Link>
                            <Link href="/super-admin/reports">
                                <Button className="w-full justify-start" variant="outline">
                                    <FileText className="mr-2 h-4 w-4" /> Ver Reportes Globales
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
