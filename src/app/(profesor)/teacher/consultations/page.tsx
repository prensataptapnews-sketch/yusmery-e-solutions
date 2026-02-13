
"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Send, MessageSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"
// import { toast } from "sonner" // Assuming sonner is available

export default function TeacherConsultationsPage() {
    const [inquiries, setInquiries] = useState<any[]>([])
    const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [replyText, setReplyText] = useState("")
    const [sending, setSending] = useState(false)

    useEffect(() => {
        fetchInquiries()
    }, [])

    async function fetchInquiries() {
        try {
            const res = await fetch("/api/teacher/inquiries")
            if (res.ok) {
                const data = await res.json()
                setInquiries(data)
                // Select first pending if available and none selected
                if (!selectedInquiry && data.length > 0) {
                    setSelectedInquiry(data[0].id)
                }
            }
        } catch (error) {
            console.error("Failed to fetch inquiries", error)
        } finally {
            setLoading(false)
        }
    }

    async function handleReply() {
        if (!replyText.trim() || !selectedInquiry) return

        setSending(true)
        try {
            const res = await fetch("/api/teacher/inquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inquiryId: selectedInquiry, answer: replyText })
            })

            if (res.ok) {
                // Update local state
                setInquiries(prev => prev.map(i =>
                    i.id === selectedInquiry
                        ? { ...i, answer: replyText, status: "ANSWERED", teacherId: "me" }
                        : i
                ))
                setReplyText("")
                // toast.success("Respuesta enviada")
            } else {
                // toast.error("Error al enviar respuesta")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setSending(false)
        }
    }

    const activeInquiry = inquiries.find(i => i.id === selectedInquiry)

    if (loading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
    }

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-2xl font-bold tracking-tight">Consultas de Alumnos</h1>
                <p className="text-muted-foreground">Responde las dudas de tus estudiantes en tiempo real.</p>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Inquiry List */}
                <Card className="w-1/3 flex flex-col overflow-hidden">
                    <div className="p-4 border-b bg-slate-50">
                        <h3 className="font-semibold text-sm text-slate-700">Bandeja de Entrada</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {inquiries.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">No hay consultas.</div>
                        ) : (
                            inquiries.map(inquiry => (
                                <div
                                    key={inquiry.id}
                                    onClick={() => setSelectedInquiry(inquiry.id)}
                                    className={cn(
                                        "p-4 border-b cursor-pointer hover:bg-indigo-50 transition-colors",
                                        selectedInquiry === inquiry.id ? "bg-indigo-50 border-l-4 border-l-indigo-600" : "border-l-4 border-l-transparent"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={cn(
                                            "text-xs font-bold px-2 py-0.5 rounded-full",
                                            inquiry.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                                        )}>
                                            {inquiry.status === "PENDING" ? "Pendiente" : "Respondido"}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {new Date(inquiry.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 className="font-medium text-slate-900 line-clamp-1">{inquiry.question}</h4>
                                    <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                                        {inquiry.student?.name} • {inquiry.course?.title}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Chat Area */}
                <Card className="flex-1 flex flex-col overflow-hidden">
                    {activeInquiry ? (
                        <>
                            <div className="p-6 border-b flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={activeInquiry.student?.avatar} />
                                    <AvatarFallback>{activeInquiry.student?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-slate-900">{activeInquiry.student?.name}</h3>
                                    <p className="text-sm text-slate-500">{activeInquiry.course?.title}</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                                {/* Student Question */}
                                <div className="flex gap-4">
                                    <Avatar className="h-8 w-8 mt-1">
                                        <AvatarFallback className="bg-slate-200"><User className="h-4 w-4" /></AvatarFallback>
                                    </Avatar>
                                    <div className="bg-white p-4 rounded-lg rounded-tl-none border shadow-sm max-w-[80%]">
                                        <p className="text-slate-800">{activeInquiry.question}</p>
                                        <span className="text-xs text-slate-400 block mt-2 text-right">
                                            {new Date(activeInquiry.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Teacher Answer */}
                                {activeInquiry.answer && (
                                    <div className="flex gap-4 flex-row-reverse">
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarFallback className="bg-indigo-100 text-indigo-700">YO</AvatarFallback>
                                        </Avatar>
                                        <div className="bg-indigo-600 text-white p-4 rounded-lg rounded-tr-none shadow-sm max-w-[80%]">
                                            <p>{activeInquiry.answer}</p>
                                            <span className="text-xs text-indigo-200 block mt-2 text-right">
                                                {activeInquiry.updatedAt ? new Date(activeInquiry.updatedAt).toLocaleString() : "Reciente"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Reply Input */}
                            <div className="p-4 border-t bg-white">
                                {activeInquiry.status === "PENDING" ? (
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Escribe tu respuesta..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleReply()}
                                        />
                                        <Button onClick={handleReply} disabled={sending || !replyText.trim()} className="bg-indigo-600 hover:bg-indigo-700">
                                            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center text-sm text-slate-500 py-2 bg-slate-50 rounded">
                                        Esta consulta ya ha sido respondida.
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
                            <p>Selecciona una consulta para ver los detalles.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
