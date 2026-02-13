"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from "recharts"
import { motion } from "framer-motion"
import { Activity, TrendingUp, Award } from "lucide-react"

const data = [
    { name: 'Lun', horas: 2, progreso: 45 },
    { name: 'Mar', horas: 5, progreso: 52 },
    { name: 'Mie', horas: 3, progreso: 48 },
    { name: 'Jue', horas: 8, progreso: 70 },
    { name: 'Vie', horas: 6, progreso: 65 },
    { name: 'Sab', horas: 4, progreso: 85 },
    { name: 'Dom', horas: 9, progreso: 92 },
]

export function PerformanceAnalytics({ data, stats }: { data: any[], stats: any }) {
    const chartData = data.length > 0 ? data : [
        { name: 'Lun', score: 0 },
        { name: 'Mar', score: 0 },
        { name: 'Mie', score: 0 },
        { name: 'Jue', score: 0 },
        { name: 'Vie', score: 0 },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden relative group">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all duration-700" />

                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Activity className="h-5 w-5 text-indigo-500" />
                                Tu Rendimiento Semanal
                            </CardTitle>
                            <CardDescription>Estás superando el 85% de tus metas semanales</CardDescription>
                        </div>
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">+12.5%</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="h-[250px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorProgreso" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(4px)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="progreso"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorProgreso)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-white dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Cursos Activos</p>
                            <p className="text-lg font-bold">{stats.inProgress}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Módulos OK</p>
                            <p className="text-lg font-bold">{stats.completed}/{stats.totalCourses}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Promedio Gral</p>
                            <div className="flex items-center gap-1">
                                <Award className="h-4 w-4 text-amber-500" />
                                <p className="text-lg font-bold text-indigo-600">{stats.avgProgress / 10}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
