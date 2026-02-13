"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Award, Zap, Book, Target, ShieldCheck } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const achievements = [
    { id: 1, name: "Rayo", icon: Zap, color: "text-amber-500", bg: "bg-amber-100", progress: 100, locked: false, desc: "Completaste un módulo en < 24h" },
    { id: 2, name: "Explorador", icon: Book, color: "text-indigo-500", bg: "bg-indigo-100", progress: 65, locked: false, desc: "Exploraste 15 recursos únicos" },
    { id: 3, name: "Precisión", icon: Target, color: "text-rose-500", bg: "bg-rose-100", progress: 100, locked: false, desc: "Nota perfecta en Examen Final" },
    { id: 4, name: "Seguro", icon: ShieldCheck, color: "text-teal-500", bg: "bg-teal-100", progress: 30, locked: true, desc: "30 días de racha continua" },
]

export function AchievementsGallery() {
    return (
        <Card className="border-none shadow-xl bg-indigo-900 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

            <CardHeader className="pb-2 relative">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-400" />
                    Tus Logros
                </CardTitle>
                <CardDescription className="text-indigo-200">9 insignias recolectadas de 24 disponibles</CardDescription>
            </CardHeader>
            <CardContent className="relative">
                <div className="grid grid-cols-2 gap-3 mt-2">
                    {achievements.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.05 }}
                            className={`p-3 rounded-2xl ${item.locked ? 'bg-indigo-950/40 opacity-50' : 'bg-indigo-800/50'} border border-indigo-700/50 transition-all`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`h-10 w-10 ${item.bg} rounded-xl flex items-center justify-center`}>
                                    <item.icon className={`h-5 w-5 ${item.color}`} />
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold leading-none">{item.name}</h5>
                                    <p className="text-[10px] text-indigo-300 mt-1 line-clamp-1">{item.desc}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[8px] font-bold uppercase tracking-wider text-indigo-400">
                                    <span>Progreso</span>
                                    <span>{item.progress}%</span>
                                </div>
                                <Progress value={item.progress} className="h-1 bg-indigo-950" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
