"use client"
import { useState, useOptimistic, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Sparkles, Wand2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { answerInquiry } from "@/app/actions/teacher/inquiries"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export function TeacherInquiries({ initialInquiries }: { initialInquiries: any[] }) {
    const router = useRouter()
    const [answeringId, setAnsweringId] = useState<string | null>(null)
    const [answerText, setAnswerText] = useState("")
    const [isPending, startTransition] = useTransition()
    const [isGeneratingAI, setIsGeneratingAI] = useState(false)

    // Supabase Realtime WebSockets: Zero-Latency Server Sync
    useEffect(() => {
        const channel = supabase.channel('realtime-inquiries')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'Inquiry' },
                (payload) => {
                    console.log('⚡ [Supabase Realtime] Event received:', payload)
                    // Trigger a silent server re-fetch without losing client state
                    router.refresh()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [router])

    const [optimisticInquiries, addOptimisticInquiry] = useOptimistic(
        initialInquiries,
        (state, removedId: string) => state.filter((i) => i.id !== removedId)
    )

    const handleAnswer = (id: string) => {
        if (!answerText.trim()) return

        const currentAnswer = answerText
        setAnsweringId(null)
        setAnswerText("")

        startTransition(async () => {
            addOptimisticInquiry(id)
            const res = await answerInquiry(id, currentAnswer)
            if (res.success) {
                toast.success("Respuesta enviada extiosamente")
            } else {
                toast.error("Error al sincronizar con el servidor")
            }
        })
    }

    const handleAIGenerate = () => {
        setIsGeneratingAI(true)
        // Simulated AI Copilot Response Delay
        setTimeout(() => {
            setAnswerText("¡Hola! He revisado tu avance y encuentro que tu trabajo está excelente. Para esta duda en particular, te sugiero repasar el módulo 2, en la lección de integraciones. ¡Cualquier otra consulta, sigo aquí para apoyarte!")
            setIsGeneratingAI(false)
        }, 1200)
    }

    if (optimisticInquiries.length === 0) {
        return (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
                <MessageSquare className="mx-auto h-8 w-8 mb-3 text-slate-300 dark:text-slate-700" />
                <p className="text-slate-500 dark:text-slate-400 font-bold">No hay consultas pendientes</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Has respondido a todos tus alumnos.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {optimisticInquiries.map((inquiry) => (
                <div key={inquiry.id} className="group bg-white dark:bg-slate-900 border border-slate-200 hover:border-indigo-300 dark:border-slate-800/80 dark:hover:border-indigo-500/50 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-50 dark:border-slate-800/50 flex items-start justify-between bg-slate-50/30 dark:bg-slate-800/20">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-slate-900 shadow-sm">
                                <AvatarImage src={inquiry.student?.avatar || inquiry.student?.image} />
                                <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold">{inquiry.student?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{inquiry.student?.name}</p>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    En <span className="text-indigo-600 dark:text-indigo-400">{inquiry.course?.title}</span> • {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true, locale: es })}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-5">
                        <div className="text-sm text-slate-700 dark:text-slate-200 mb-5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed shadow-inner italic">
                            "{inquiry.question}"
                        </div>

                        {answeringId === inquiry.id ? (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Textarea
                                    placeholder="Escribe tu respuesta clara y amigable..."
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    className="text-sm min-h-[100px] resize-none bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-indigo-500 dark:focus:ring-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl"
                                />
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={handleAIGenerate}
                                        disabled={isGeneratingAI}
                                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 rounded-xl transition-all"
                                    >
                                        {isGeneratingAI ? <Sparkles className="mr-2 h-4 w-4 animate-pulse" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                        {isGeneratingAI ? "Pensando Sugerencia..." : "AI Copilot Mágico"}
                                    </Button>
                                    
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold transition-all" onClick={() => setAnsweringId(null)}>
                                            Cancelar
                                        </Button>
                                        <Button size="sm" onClick={() => handleAnswer(inquiry.id)} className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold shadow-sm shadow-indigo-500/20 rounded-xl transition-all">
                                            <Send className="mr-2 h-3.5 w-3.5" /> Enviar Mensaje
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Button variant="outline" size="sm" className="w-full text-xs font-bold text-slate-700 dark:text-slate-300 border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white rounded-xl transition-all py-5" onClick={() => setAnsweringId(inquiry.id)}>
                                Responder Consulta
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
