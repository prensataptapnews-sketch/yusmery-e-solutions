"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { MessageSquare, Send, CheckCheck, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TutorHub({ messages }: { messages?: any[] }) {
    const recentMessages = (messages?.length ?? 0) > 0 ? (messages as any[]) : [
        {
            id: '1',
            tutor: "Sistema",
            avatar: null,
            text: "No tienes consultas recientes.",
            time: "-",
            status: "READ"
        }
    ]

    return (
        <Card className="border-none shadow-xl bg-white dark:bg-slate-950 overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-indigo-500" />
                            TutorHub
                        </CardTitle>
                        <CardDescription>Comunicación directa con tus guías</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {recentMessages.map((msg: any, idx) => (
                        <Link href="/dashboard/tutor" key={msg.id} className="block">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-3 rounded-2xl ${msg.status === 'PENDING' ? 'bg-indigo-50/50 border border-indigo-100' : 'bg-slate-50/50'} relative cursor-pointer hover:shadow-sm transition-all`}
                            >
                                <div className="flex gap-3">
                                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                        <AvatarImage src={msg.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.tutor}`} />
                                        <AvatarFallback>{msg.tutor[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h5 className="text-[11px] font-bold text-slate-900 dark:text-slate-100">{msg.tutor}</h5>
                                            <span className="text-[9px] text-slate-500 font-medium">{typeof msg.time === 'string' ? msg.time : new Date(msg.time).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                            {msg.text}
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute top-2 right-2">
                                    {msg.status === 'REPLIED' || msg.status === 'READ' ? (
                                        <CheckCheck className="h-3 w-3 text-indigo-500" />
                                    ) : (
                                        <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse" />
                                    )}
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-xs gap-2 font-bold py-5 rounded-xl" asChild>
                    <Link href="/dashboard/tutor">
                        <Send className="h-3 w-3" />
                        Enviar Nueva Consulta
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
