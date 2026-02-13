
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
    { name: "TechCorp", completion: 85, satisfaction: 92 },
    { name: "Global Sol.", completion: 65, satisfaction: 88 },
    { name: "StartupHub", completion: 45, satisfaction: 95 },
]

export default function GlobalReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Reportes Globales</h1>
                <p className="text-muted-foreground">Comparativa de rendimiento entre empresas.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Rendimiento por Empresa</CardTitle>
                        <CardDescription>Tasa de finalización vs Satisfacción</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                                    <Bar dataKey="completion" fill="#2563eb" radius={[4, 4, 0, 0]} name="Finalización" />
                                    <Bar dataKey="satisfaction" fill="#10b981" radius={[4, 4, 0, 0]} name="Satisfacción" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Resumen Ejecutivo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div>
                            <div className="text-2xl font-bold">85%</div>
                            <p className="text-xs text-muted-foreground">Tasa de Finalización Promedio</p>
                            <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-blue-600 w-[85%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">92%</div>
                            <p className="text-xs text-muted-foreground">NPS Global</p>
                            <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-green-500 w-[92%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">12.5h</div>
                            <p className="text-xs text-muted-foreground">Tiempo Promedio en Plataforma</p>
                            <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-purple-500 w-[60%]"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
