"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
    Plus, Megaphone, Video, UploadCloud, FileText, 
    Send, Link as LinkIcon, Copy, CheckCircle2, FileUp, Loader2
} from "lucide-react"
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

export function QuickActions() {
    const router = useRouter()
    const [activeModal, setActiveModal] = useState<'aviso' | 'material' | 'tutoria' | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [generatedLink, setGeneratedLink] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    // Simulated Server Action handlers
    const handleSendNotice = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        await new Promise(r => setTimeout(r, 1200))
        setIsSubmitting(false)
        setActiveModal(null)
        toast.success("¡Aviso masivo enviado exitosamente a todos los alumnos!")
    }

    const handleUploadMaterial = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFile) {
            toast.error("Por favor, selecciona o arrastra un archivo primero.")
            return
        }
        setIsSubmitting(true)
        try {
            const fileName = `material-${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
            const { error } = await supabase.storage.from('materials').upload(fileName, selectedFile)
            if (error) throw error
            toast.success("¡Archivo subido exitosamente a la CDN global de Supabase!")
            setActiveModal(null)
        } catch (error: any) {
            console.error(error)
            toast.error("Fallo al subir: " + error.message)
        } finally {
            setIsSubmitting(false)
            setSelectedFile(null)
        }
    }

    const generateMeetingLink = () => {
        setIsSubmitting(true)
        setTimeout(() => {
            setGeneratedLink(`https://meet.yusmery.com/tutor-${Math.random().toString(36).substring(7)}`)
            setIsSubmitting(false)
            toast.success("Sala de tutoría aprovisionada")
        }, 800)
    }

    const handleMenuSelection = (action: 'aviso' | 'material' | 'tutoria' | 'evaluacion') => {
        if (action === 'evaluacion') {
            toast.success("Redirigiendo a creacion de evaluaciones...")
            router.push('/teacher/evaluations')
        } else {
            setActiveModal(action)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 dark:shadow-slate-100/10 transition-all hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Acciones</span>
                    </button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] rounded-2xl p-2 z-[100] mt-2">
                    <DropdownMenuLabel className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider px-3 py-2">
                        Herramientas Rápidas
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 mb-2" />
                    
                    <DropdownMenuItem onSelect={() => handleMenuSelection('aviso')} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 focus:bg-slate-50 dark:focus:bg-slate-800/80 rounded-xl py-3 px-3 transition-colors group">
                        <div className="flex items-center gap-3 w-full">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:scale-110 transition-transform shadow-sm">
                                <Megaphone className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">Aviso Masivo</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Notificar a todos tus cursos</span>
                            </div>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={() => handleMenuSelection('tutoria')} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 focus:bg-slate-50 dark:focus:bg-slate-800/80 rounded-xl py-3 px-3 transition-colors group mt-1">
                        <div className="flex items-center gap-3 w-full">
                            <div className="p-2 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg group-hover:scale-110 transition-transform shadow-sm">
                                <Video className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">Sala de Tutoría</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Iniciar sesión en vivo</span>
                            </div>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={() => handleMenuSelection('material')} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 focus:bg-slate-50 dark:focus:bg-slate-800/80 rounded-xl py-3 px-3 transition-colors group mt-1">
                        <div className="flex items-center gap-3 w-full">
                            <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg group-hover:scale-110 transition-transform shadow-sm">
                                <UploadCloud className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">Subir Material</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Archivos o PDFs nuevos</span>
                            </div>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-2" />
                    
                    <DropdownMenuItem onSelect={() => handleMenuSelection('evaluacion')} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 focus:bg-slate-50 dark:focus:bg-slate-800/80 rounded-xl py-3 px-3 transition-colors group">
                        <div className="flex items-center gap-3 w-full">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg group-hover:scale-110 transition-transform shadow-sm">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">Crear Evaluación</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Diseñar cuestionario</span>
                            </div>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Logical Modals */}
            <Dialog open={activeModal !== null} onOpenChange={(open) => !open && setActiveModal(null)}>
                <DialogContent className="sm:max-w-[480px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-0 overflow-hidden" aria-describedby="quick-action-modal">
                    {activeModal === 'aviso' && (
                        <form onSubmit={handleSendNotice} className="flex flex-col h-full">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
                                <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Megaphone className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> Aviso Masivo
                                </DialogTitle>
                                <DialogDescription className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                    Envía un comunicado urgente a tus estudiantes.
                                </DialogDescription>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Destinatarios</label>
                                    <select className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option>Todos los cursos activos</option>
                                        <option>Desarrollo de Liderazgo Estratégico</option>
                                        <option>Coaching Ejecutivo Avanzado</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Asunto</label>
                                    <Input required placeholder="Ej. Cambio de fecha de evaluación" className="rounded-xl font-medium border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white shadow-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mensaje</label>
                                    <Textarea required placeholder="Escribe tu comunicado aquí..." className="min-h-[120px] font-medium resize-none rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white shadow-none" />
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-2 mt-auto">
                                <Button type="button" variant="ghost" className="rounded-xl font-bold dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={() => setActiveModal(null)}>Cancelar</Button>
                                <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold shadow-md shadow-indigo-500/20">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                    Enviar Aviso
                                </Button>
                            </div>
                        </form>
                    )}

                    {activeModal === 'material' && (
                        <form onSubmit={handleUploadMaterial}>
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
                                <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                    <UploadCloud className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> Subir Material
                                </DialogTitle>
                                <DialogDescription className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                    Anexa archivos, videos o PDFs para tus cursos.
                                </DialogDescription>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Curso de Destino</label>
                                    <select className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option>Desarrollo de Liderazgo Estratégico</option>
                                        <option>Coaching Ejecutivo Avanzado</option>
                                    </select>
                                </div>
                                
                                <div className="mt-4 relative border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer group overflow-hidden">
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    />
                                    <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                        {selectedFile ? <CheckCircle2 className="w-7 h-7 text-emerald-500" /> : <FileUp className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />}
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 text-center px-4">
                                        {selectedFile ? selectedFile.name : "Haz clic para buscar archivo"}
                                    </p>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                                        {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB listo para subir` : "o arrastra un documento aquí (Max. 50MB)"}
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-2">
                                <Button type="button" variant="ghost" className="rounded-xl font-bold dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800" onClick={() => setActiveModal(null)}>Cancelar</Button>
                                <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold shadow-md shadow-indigo-500/20">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                                    Subir Archivo
                                </Button>
                            </div>
                        </form>
                    )}

                    {activeModal === 'tutoria' && (
                        <div>
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
                                <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Video className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> Sala de Tutoría
                                </DialogTitle>
                                <DialogDescription className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                    Crea una sesión de videoconferencia instantánea en vivo.
                                </DialogDescription>
                            </div>
                            <div className="p-8 flex flex-col items-center justify-center min-h-[240px] bg-white dark:bg-slate-900">
                                {!generatedLink ? (
                                    <Button 
                                        size="lg" 
                                        disabled={isSubmitting}
                                        onClick={generateMeetingLink}
                                        className="rounded-2xl w-full max-w-[280px] bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold shadow-xl shadow-slate-900/20 py-7 text-sm transition-all hover:scale-[1.02]"
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Creando Sala Segura...</>
                                        ) : (
                                            <><LinkIcon className="w-5 h-5 mr-3" /> Generar Enlace Único</>
                                        )}
                                    </Button>
                                ) : (
                                    <div className="w-full space-y-5 animate-in fade-in zoom-in-95 duration-300">
                                        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl flex items-center gap-4">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Sala Lista</p>
                                                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300 truncate mt-0.5">{generatedLink}</p>
                                            </div>
                                            <Button size="icon" variant="ghost" className="text-emerald-600 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-500/20 shrink-0" onClick={() => { navigator.clipboard.writeText(generatedLink); toast.success("Enlace copiado") }}>
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <Button className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold shadow-md shadow-indigo-500/20 py-6 text-sm" onClick={() => { setActiveModal(null); setGeneratedLink(""); toast.success("Navegando a la sala..."); }}>
                                            <Video className="w-5 h-5 mr-2" /> Entrar a la Sala Ahora
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
