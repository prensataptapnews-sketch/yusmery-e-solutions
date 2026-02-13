"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area as ReArea
} from "recharts"
import { Download, Filter, Calendar as CalendarIcon, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

const PROGRESS_DATA = [
    { name: "Liderazgo", progress: 68 },
    { name: "IA RH", progress: 42 },
    { name: "Gestión Equipos", progress: 85 },
    { name: "Mindfulness", progress: 92 },
    { name: "Comunicación", progress: 75 },
    { name: "Negociación", progress: 30 },
]

const APPROVAL_DATA = [
    { name: "Aprobados", value: 78, color: "#10b981" },
    { name: "Reprobados", value: 12, color: "#f43f5e" },
    { name: "Pendientes", value: 10, color: "#94a3b8" },
]

const ACTIVITY_DATA = [
    { month: "Ene", login: 400, courses: 240 },
    { month: "Feb", login: 300, courses: 139 },
    { month: "Mar", login: 200, courses: 980 },
    { month: "Abr", login: 278, courses: 390 },
    { month: "May", login: 189, courses: 480 },
    { month: "Jun", login: 239, courses: 380 },
]

export function AdminReportsDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">
                        <CalendarIcon className="mr-2 h-4 w-4" /> Últimos 30 días
                    </Button>
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" /> Filtrar por Área
                    </Button>
                </div>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    <Download className="mr-2 h-4 w-4" /> Descargar PDF Completo
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Avance General */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Avance General por Curso</CardTitle>
                            <CardDescription>Progreso porcentual promedio por área temática.</CardDescription>
                        </div>
                        <Info className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent className="h-80 pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={PROGRESS_DATA} layout="vertical" margin={{ left: 20, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={120}
                                    style={{ fontSize: '12px', fontWeight: 500 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="progress" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 2. Aprobación de Evaluaciones */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Tasa de Aprobación</CardTitle>
                            <CardDescription>Resultados de las evaluaciones este mes.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center pt-4">
                        <div className="w-full h-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={APPROVAL_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {APPROVAL_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-slate-900">78%</span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Éxito Total</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Actividad en Plataforma */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg">Compromiso (Engagement)</CardTitle>
                        <CardDescription>Accesos vs Completitud de Cursos.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ACTIVITY_DATA}>
                                <defs>
                                    <linearGradient id="colorLogin" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" style={{ fontSize: '11px' }} axisLine={false} tickLine={false} />
                                <YAxis style={{ fontSize: '11px' }} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <ReArea type="monotone" dataKey="courses" stroke="#4f46e5" fillOpacity={1} fill="url(#colorLogin)" strokeWidth={2} />
                                <ReArea type="monotone" dataKey="login" stroke="#10b981" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 4. Tablero de Cumplimiento por Departamento */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg">Cumplimiento por Departamento</CardTitle>
                        <CardDescription>KPIs de formación por área corporativa.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="space-y-4">
                            {[
                                { dept: "Recursos Humanos", score: 95, status: "Alta", color: "bg-emerald-500" },
                                { dept: "Ventas y Comercial", score: 42, status: "Crítica", color: "bg-rose-500" },
                                { dept: "Operaciones", score: 78, status: "Estable", color: "bg-amber-500" },
                                { dept: "Tecnología", score: 88, status: "Alta", color: "bg-emerald-500" },
                                { dept: "Finanzas", score: 65, status: "Estable", color: "bg-amber-500" },
                            ].map((row, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="min-w-[140px] text-sm font-medium text-slate-700">{row.dept}</div>
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${row.color}`} style={{ width: `${row.score}%` }} />
                                    </div>
                                    <div className="min-w-[40px] text-xs font-bold text-right">{row.score}%</div>
                                    <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${row.status === 'Alta' ? 'bg-emerald-50 text-emerald-700' : row.status === 'Crítica' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                                        {row.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
