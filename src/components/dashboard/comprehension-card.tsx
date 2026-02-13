"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from "recharts"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { GraduationCap, Trophy, TrendingUp } from "lucide-react"

interface ComprehensionData {
    date: string // ISO Date
    score: number
    passed: boolean
    title: string
}

interface ComprehensionStats {
    totalEvaluations: number
    averageScore: number
    highestScore: number
    history: ComprehensionData[]
}

interface ComprehensionCardProps {
    stats: ComprehensionStats
}

export function ComprehensionCard({ stats }: ComprehensionCardProps) {
    if (!stats || stats.history.length === 0) {
        return (
            <Card className="col-span-full xl:col-span-2">
                <CardHeader>
                    <CardTitle>Mi Comprensión</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Aún no has completado ninguna evaluación.
                </CardContent>
            </Card>
        )
    }

    // Format data for chart
    const chartData = stats.history.map(item => ({
        ...item,
        dateFormatted: format(new Date(item.date), 'dd MMM', { locale: es }),
        fullDate: format(new Date(item.date), 'dd MMMM yyyy HH:mm', { locale: es })
    }))

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Mi Comprensión</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Stat Canards */}
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Evaluaciones</p>
                            <p className="text-2xl font-bold">{stats.totalEvaluations}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Promedio Global</p>
                            <p className="text-2xl font-bold">{stats.averageScore}%</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/10">
                        <div className="p-3 bg-amber-500/10 rounded-full text-amber-500">
                            <Trophy className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Mejor Resultado</p>
                            <p className="text-2xl font-bold">{stats.highestScore}%</p>
                        </div>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis
                                dataKey="dateFormatted"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Evaluación
                                                        </span>
                                                        <span className="font-bold text-muted-foreground">
                                                            {data.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Puntuación
                                                        </span>
                                                        <span className={`font-bold ${data.score >= 70 ? 'text-green-500' : 'text-red-500'}`}>
                                                            {data.score}%
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2 text-xs text-muted-foreground pt-1 border-t mt-1">
                                                        {data.fullDate}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <ReferenceLine y={70} stroke="green" strokeDasharray="3 3" label={{ position: 'insideBottomRight', value: 'Aprobado (70%)', fill: 'green', fontSize: 12 }} />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                                dot={{ r: 4, fill: "hsl(var(--background))", stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
