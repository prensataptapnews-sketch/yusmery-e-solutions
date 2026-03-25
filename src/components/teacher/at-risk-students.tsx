"use client"

import { useState, useEffect } from 'react'
import { AlertCircle, Send, Loader2, Sparkles, Wifi } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export interface AtRiskStudent {
    id: string;
    name: string;
    avatar: string;
    progress: number;
    riskLevel: "Alto" | "Medio";
    course: string;
}

export function AtRiskStudents({ students }: { students: AtRiskStudent[] }) {
    const [selectedStudent, setSelectedStudent] = useState<AtRiskStudent | null>(null)
    const [message, setMessage] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [onlineStudents, setOnlineStudents] = useState<string[]>([])

    // Supabase Realtime Presence
    useEffect(() => {
        const channel = supabase.channel('platform-presence', {
            config: { presence: { key: 'teacher' } }
        })

        channel.on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState()
            const onlineIds = Object.values(state).flatMap(users => users.map((u: any) => u.user_id))
            setOnlineStudents(onlineIds)
        })

        channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.track({ user_id: 'teacher_123' })
            }
        })

        // DEMO EFFECT: Simulate a student coming online randomly after 3.5 seconds
        let simChannel: any;
        if (students.length > 0) {
            const timer = setTimeout(() => {
                simChannel = supabase.channel('platform-presence-sim', {
                    config: { presence: { key: 'student_sim' } }
                })
                simChannel.subscribe(async (s: string) => {
                    if (s === 'SUBSCRIBED') {
                        await simChannel.track({ user_id: students[0].id })
                        toast(`🟢 ${students[0].name.split(' ')[0]} acaba de entrar a la plataforma`)
                    }
                })
            }, 3500)
            return () => {
                clearTimeout(timer)
                supabase.removeChannel(channel)
                if (simChannel) supabase.removeChannel(simChannel)
            }
        }

        return () => {
            supabase.removeChannel(channel)
        }
    }, [students])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return
        
        setIsSending(true)
        // Simulated network request
        await new Promise(r => setTimeout(r, 1000))
        setIsSending(false)
        
        toast.success(`Mensaje urgente enviado a ${selectedStudent?.name}`)
        setSelectedStudent(null)
        setMessage("")
    }

    const handleCopilotTemplate = () => {
        setMessage(`Hola ${selectedStudent?.name}, me he percatado de que tu avance en el curso de ${selectedStudent?.course} se ha pausado recientemente. ¿Hay algo en el material donde necesites mi apoyo directo? Recuerda que estoy aquí para tus dudas.`)
    }

    return (
        <div className="flex flex-col h-full w-full">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                        <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                        Estudiantes en Riesgo
                    </h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Requieren atención prioritaria</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-3 min-h-[300px]">
                {students.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <p className="font-bold text-slate-700 dark:text-slate-200">¡Excelente trabajo!</p>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">No hay alumnos rezagados en este momento.</p>
                    </div>
                ) : (
                    students.map((student) => (
                        <div
                            key={student.id}
                            className="group flex flex-col gap-4 p-4 mb-2 rounded-xl border border-slate-100 hover:border-slate-200 dark:border-slate-800/80 dark:hover:border-slate-700 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-800/30 dark:hover:bg-slate-800/80 transition-all font-medium"
                        >
                            <div className="flex justify-between items-start w-full">
                                {/* User Info */}
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img
                                            src={student.avatar}
                                            alt={student.name}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-900 shadow-sm"
                                        />
                                        {onlineStudents.includes(student.id) && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full z-10">
                                                <span className="absolute inline-flex w-full h-full bg-emerald-400 rounded-full opacity-75 animate-ping"></span>
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{student.name}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[140px] font-medium">{student.course}</p>
                                    </div>
                                </div>
                                {/* Risk Badge */}
                                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${student.riskLevel === 'Alto'
                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                                    }`}>
                                    {student.riskLevel}
                                </span>
                            </div>

                            {/* Progress Bar & Actions */}
                            <div className="flex items-center gap-4 mt-1">
                                <div className="flex-1">
                                    <div className="flex justify-between text-xs mb-1.5 font-bold">
                                        <span className="text-slate-500 dark:text-slate-400">Progreso actual</span>
                                        <span className="text-slate-900 dark:text-slate-100">{student.progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${student.progress < 20 ? 'bg-rose-500 dark:bg-rose-400' : 'bg-amber-500 dark:bg-amber-400'}`}
                                            style={{ width: `${student.progress}%` }}
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedStudent(student)}
                                    className="p-2.5 shrink-0 text-slate-400 dark:text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/20 rounded-xl transition-all shadow-sm" 
                                    title="Enviar Mensaje Directo"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Dialog open={selectedStudent !== null} onOpenChange={(open) => !open && setSelectedStudent(null)}>
                <DialogContent className="sm:max-w-[420px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-0 overflow-hidden">
                    <form onSubmit={handleSendMessage} className="flex flex-col h-full">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
                            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                <Send className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> Nuevo Mensaje Directo
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
                                Notificando a <span className="font-bold text-slate-900 dark:text-slate-200">{selectedStudent?.name}</span>
                            </DialogDescription>
                        </div>
                        <div className="p-5 space-y-4">
                            <Textarea 
                                required 
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder={`Escribe tu alerta de seguimiento a ${selectedStudent?.name}...`} 
                                className="min-h-[120px] font-medium resize-none rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white shadow-none focus:border-indigo-500 dark:focus:border-indigo-500" 
                            />
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={handleCopilotTemplate}
                                className="w-full text-xs font-bold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl"
                            >
                                <Sparkles className="w-3.5 h-3.5 mr-2" />
                                Insertar Sugerencia IA
                            </Button>
                        </div>
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-2 mt-auto">
                            <Button type="button" variant="ghost" className="rounded-xl font-bold dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={() => setSelectedStudent(null)}>Cancelar</Button>
                            <Button type="submit" disabled={isSending} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold shadow-md shadow-indigo-500/20">
                                {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                Despachar Mensaje
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
