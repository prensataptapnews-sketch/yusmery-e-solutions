"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Clock, Calendar, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SmartAgenda({ items }: { items: any[] }) {
    const agendaItems = items?.length > 0 ? items : [
        { id: '1', title: "Sin tareas pendientes", course: "-", type: "N/A", deadline: "Al día", urgent: false }
    ]

    return (
        <Card className="h-full border-none shadow-xl bg-white dark:bg-slate-950 overflow-hidden">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    Tu Agenda de Hoy
                </CardTitle>
                <CardDescription>Prioridades y fechas límite próximas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {agendaItems.map((item, idx) => (
                    <Link href={item.id === '1' ? '#' : `/classroom/evaluations/${item.id}`} key={item.id} className="block">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-4 rounded-2xl border ${item.urgent
                                ? 'bg-rose-50/50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30'
                                : 'bg-slate-50/50 border-slate-100 dark:bg-slate-900/20 dark:border-slate-800/30'
                                } relative group cursor-pointer hover:shadow-md transition-all`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={item.urgent ? "destructive" : "secondary"} className="text-[10px] px-2 py-0">
                                    {item.type}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs font-medium opacity-70">
                                    <Clock className={`h-3 w-3 ${item.urgent ? 'text-rose-500 animate-pulse' : ''}`} />
                                    {item.deadline}
                                </div>
                            </div>
                            <h4 className="text-sm font-bold truncate pr-6 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{item.course}</p>

                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="h-6 w-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-sm">
                                    <ArrowRight className="h-3 w-3" />
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}

                <Button variant="outline" className="w-full text-xs font-bold border-dashed mt-2" asChild>
                    <Link href="/dashboard/calendar">Ver Calendario Completo</Link>
                </Button>
            </CardContent>
        </Card>
    )
}
