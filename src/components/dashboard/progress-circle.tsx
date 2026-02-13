"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProgressCircleProps {
    stats: {
        totalCourses: number
        completed: number
        avgProgress: number
    }
}

export function ProgressCircle({ stats }: ProgressCircleProps) {
    const data = [
        { name: "Completado", value: stats.avgProgress },
        { name: "Restante", value: 100 - stats.avgProgress },
    ]

    const COLORS = ["#14B8A6", "#E2E8F0"] // Teal and Slate-200

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">Tu Progreso Global</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={0}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                                strokeWidth={0}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                <Label
                                    value={`${Math.round(stats.avgProgress)}%`}
                                    position="center"
                                    className="fill-foreground text-3xl font-bold"
                                />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-teal-600">{stats.totalCourses}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Cursos</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-blue-600">{stats.completed}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Certificados</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
