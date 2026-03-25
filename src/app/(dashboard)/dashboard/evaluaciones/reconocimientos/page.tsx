"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Award, Heart, Send, MessageSquareHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReturnToEvaluations } from "@/components/dashboard/evaluaciones/return-to-evaluations"
import { Textarea } from "@/components/ui/textarea"
import { sendKudo, getKudos, getTeamMembers } from "@/app/actions/talent-actions"

interface Kudo {
    id: string
    senderName: string
    receiverName: string
    message: string
    claps: number
    timestamp: string
}

interface UserSummary {
    id: string
    name: string | null
    role: string | null
}

export default function KudosFeedPage() {
    const [kudos, setKudos] = useState<Kudo[]>([])
    const [teamMembers, setTeamMembers] = useState<UserSummary[]>([])
    const [newReceiverId, setNewReceiverId] = useState("")
    const [newMessage, setNewMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Simulador del usuario actual (en una app real vendría de la sesión)
    const currentUser = "Usuario Demo"

    useEffect(() => {
        async function loadData() {
            const [fetchedKudos, fetchedMembers] = await Promise.all([
                getKudos(),
                getTeamMembers()
            ])
            setKudos(fetchedKudos)
            setTeamMembers(fetchedMembers)
            setIsLoading(false)
        }
        loadData()
    }, [])

    const handleClap = (id: string) => {
        setKudos((prev: Kudo[]) => prev.map((kudo: Kudo) => 
            kudo.id === id ? { ...kudo, claps: kudo.claps + 1 } : kudo
        ))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!newReceiverId || !newMessage.trim()) return

        setIsSubmitting(true)
        
        try {
            const result = await sendKudo({
                receiverId: newReceiverId,
                message: newMessage.trim(),
                category: "GENERAL"
            })

            if (result.success) {
                // Refrescar feed localmente para feedback instantáneo
                const receiverName = teamMembers.find((m: UserSummary) => m.id === newReceiverId)?.name || "Compañero"
                const newKudoEntry: Kudo = {
                    id: result.id!,
                    senderName: "Yo",
                    receiverName: receiverName,
                    message: newMessage.trim(),
                    claps: 0,
                    timestamp: 'Justo ahora'
                }

                setKudos((prev: Kudo[]) => [newKudoEntry, ...prev])
                setNewReceiverId("")
                setNewMessage("")
            } else {
                alert(result.error || "Error al enviar")
            }
        } catch (error) {
            console.error("Error enviando kudo:", error)
            alert("Error de conexión")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col space-y-6 pb-20">
            
            <ReturnToEvaluations />

            {/* Cabecera Clásica */}
            <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 bg-pink-50 dark:bg-pink-900/40 border border-pink-100 dark:border-pink-800 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                    <MessageSquareHeart className="w-7 h-7 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Muro de Reconocimientos
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Celebra los logros, el esfuerzo y la cultura de tus compañeros.
                    </p>
                </div>
            </div>

            {/* Zona de Publicación (LinkedIn Style) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-bold rounded-full flex items-center justify-center shrink-0">
                            {currentUser.charAt(0)}
                        </div>
                        <div className="flex-1 flex flex-col sm:flex-row gap-3">
                            <select 
                                value={newReceiverId}
                                onChange={(e) => setNewReceiverId(e.target.value)}
                                className="w-full sm:w-1/2 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                            >
                                <option value="" disabled>Selecciona a quién reconocer...</option>
                                {teamMembers.map(member => (
                                    <option key={member.id} value={member.id}>{member.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Textarea 
                        placeholder="Escribe un mensaje de agradecimiento. Se específico sobre el valor o impacto que logró..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="min-h-[100px] resize-none border-none bg-slate-50 dark:bg-slate-950/50 focus-visible:ring-1 focus-visible:ring-pink-500/50 rounded-2xl p-4 text-[15px] font-medium placeholder:text-slate-400"
                    />

                    <div className="flex justify-end pt-2">
                        <Button 
                            type="submit"
                            disabled={!newReceiverId || !newMessage.trim() || isSubmitting}
                            className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full px-8 shadow-md transition-all h-10"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Enviar Reconocimiento <Send className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Separador Visual */}
            <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Feed en Vivo</span>
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
            </div>

            {/* Feed de Kudos */}
            <div className="flex flex-col gap-6">
                {isLoading ? (
                    <div className="flex flex-col gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-slate-100 dark:bg-slate-900/50 animate-pulse rounded-3xl border border-slate-200 dark:border-slate-800"></div>
                        ))}
                    </div>
                ) : (
                    kudos.map((kudo) => (
                    <div 
                        key={kudo.id} 
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                        {/* Header del Kudo */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-[15px] text-slate-900 dark:text-white leading-tight">
                                    <span className="font-bold text-slate-900 dark:text-white">{kudo.senderName}</span>
                                    <span className="text-slate-500 dark:text-slate-400 mx-1.5 font-medium">ha reconocido a</span>
                                    <span className="font-black text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-100 dark:border-pink-900/50 inline-block mt-1 sm:mt-0">{kudo.receiverName}</span>
                                </h3>
                            </div>
                            <span className="text-xs font-bold text-slate-400 whitespace-nowrap ml-4 shrink-0 mt-1">
                                {kudo.timestamp}
                            </span>
                        </div>

                        {/* Mensaje */}
                        <div className="mb-6">
                            <p className="text-[17px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                "{kudo.message}"
                            </p>
                        </div>

                        {/* Footer / Acción Clap */}
                        <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => handleClap(kudo.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-slate-800/50 hover:bg-pink-50 dark:hover:bg-pink-900/20 text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 border border-slate-200 dark:border-slate-700 hover:border-pink-200 dark:hover:border-pink-800 transition-all active:scale-95 group font-bold text-sm"
                            >
                                <Heart className={`w-4 h-4 transition-transform group-hover:scale-110 ${kudo.claps > 0 ? 'fill-pink-500 text-pink-500 dark:fill-pink-500/50 dark:text-pink-400' : ''}`} />
                                Celebrar ({kudo.claps})
                            </button>
                        </div>
                    </div>
                    ))
                )}
            </div>
        </div>
    )
}
