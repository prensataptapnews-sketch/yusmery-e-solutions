"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Map, CheckCircle2, Circle, Trophy, ArrowRight } from "lucide-react"
import Link from "next/link"

const pathSteps = [
    { id: 1, title: "Liderazgo Esencial", status: "COMPLETED", duration: "12h" },
    { id: 2, title: "Comunicación Estratégica", status: "CURRENT", duration: "8h" },
    { id: 3, title: "Gestión de Equipos", status: "LOCKED", duration: "15h" },
    { id: 4, title: "Mentoring Avanzado", status: "LOCKED", duration: "10h" },
]

export function CareerRoadmap() {
    return (
        <Card className="border-none shadow-xl bg-white dark:bg-slate-950 overflow-hidden">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Map className="h-5 w-5 text-indigo-500" />
                    Mi Ruta de Carrera
                </CardTitle>
                <CardDescription>Progreso hacia tu certificación Senior</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative space-y-2">
                    {/* Vertical Line */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />

                    {pathSteps.map((step, idx) => (
                        <div key={step.id} className="relative pl-10 pb-6 last:pb-0">
                            {/* Connector Node */}
                            <div className={`absolute left-0 top-1 h-8 w-8 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-950 z-10 ${step.status === 'COMPLETED' ? 'bg-indigo-500 text-white' :
                                step.status === 'CURRENT' ? 'bg-white dark:bg-slate-900 border-indigo-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                }`}>
                                {step.status === 'COMPLETED' ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : step.status === 'CURRENT' ? (
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="h-2 w-2 bg-indigo-500 rounded-full"
                                    />
                                ) : (
                                    <Circle className="h-4 w-4" />
                                )}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-4 rounded-2xl border transition-all ${step.status === 'CURRENT'
                                    ? 'bg-indigo-50/50 border-indigo-100 ring-2 ring-indigo-500/10 cursor-pointer hover:shadow-md'
                                    : 'bg-transparent border-transparent'
                                    }`}
                            >
                                {step.status === 'CURRENT' ? (
                                    <Link href="/courses">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                    {step.title}
                                                </h5>
                                                <p className="text-[10px] text-slate-500 mt-1">{step.duration} de estudio estimados</p>
                                            </div>
                                            <div className="bg-indigo-500 text-white p-1 rounded-lg">
                                                <ArrowRight className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h5 className={`text-sm font-bold ${step.status === 'LOCKED' ? 'text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                                                {step.title}
                                            </h5>
                                            <p className="text-[10px] text-slate-500 mt-1">{step.duration} de estudio estimados</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    ))}

                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-100 dark:border-amber-900/30 flex items-center gap-4">
                        <div className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center text-white">
                            <Trophy className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">Próximo Hito</p>
                            <p className="text-xs font-bold">Certificado Senior de Liderazgo</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
