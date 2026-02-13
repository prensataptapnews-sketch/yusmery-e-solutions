"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Users, Heart, MessageSquare, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const socialActivity = [
    {
        id: 1,
        user: "María García",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
        action: "comentó en",
        target: "Sesgos de Confirmación",
        preview: "¿Cómo podemos evitar esto en reuniones de equipo?",
        likes: 12,
        comments: 4
    },
    {
        id: 2,
        user: "Juan Rodríguez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juan",
        action: "finalizó el curso",
        target: "IA para Gerentes",
        preview: "¡Increíble contenido! Me ha cambiado la perspectiva.",
        likes: 45,
        comments: 8
    }
]

export function CommunityFeed() {
    return (
        <Card className="border-none shadow-xl bg-white dark:bg-slate-950 overflow-hidden">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-500" />
                    Comunidad
                </CardTitle>
                <CardDescription>Lo que tus compañeros están aprendiendo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {socialActivity.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group"
                    >
                        <div className="flex gap-3">
                            <Avatar className="h-10 w-10 border-2 border-slate-50">
                                <AvatarImage src={item.avatar} />
                                <AvatarFallback>{item.user[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-1 flex-wrap">
                                    <span className="text-sm font-bold">{item.user}</span>
                                    <span className="text-xs text-slate-500">{item.action}</span>
                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{item.target}</span>
                                </div>
                                <div className="mt-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                    "{item.preview}"
                                </div>
                                <div className="mt-3 flex items-center gap-4 text-slate-400">
                                    <div className="flex items-center gap-1 group/like cursor-pointer">
                                        <Heart className="h-3 w-3 group-hover/like:text-rose-500 group-hover/like:fill-rose-500 transition-all" />
                                        <span className="text-[10px] font-medium">{item.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-1 group/comm cursor-pointer">
                                        <MessageSquare className="h-3 w-3 group-hover/comm:text-indigo-500 transition-all" />
                                        <span className="text-[10px] font-medium">{item.comments}</span>
                                    </div>
                                    <div className="flex-1" />
                                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-indigo-500" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    )
}
