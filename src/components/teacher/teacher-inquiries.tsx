"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, CheckCircle2 } from "lucide-react"
import { answerInquiry } from "@/app/actions/teacher/inquiries"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export function TeacherInquiries({ initialInquiries }: { initialInquiries: any[] }) {
    const [inquiries, setInquiries] = useState(initialInquiries)
    const [answeringId, setAnsweringId] = useState<string | null>(null)
    const [answerText, setAnswerText] = useState("")

    const handleAnswer = async (id: string) => {
        if (!answerText.trim()) return

        const res = await answerInquiry(id, answerText)
        if (res.success) {
            toast.success("Respuesta enviada")
            setInquiries(prev => prev.filter(i => i.id !== id))
            setAnsweringId(null)
            setAnswerText("")
        } else {
            toast.error("Error al enviar respuesta")
        }
    }

    if (inquiries.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-20" />
                <p>No hay consultas pendientes</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {inquiries.map((inquiry) => (
                <Card key={inquiry.id} className="border-slate-200">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={inquiry.student?.avatar || inquiry.student?.image} />
                                    <AvatarFallback>{inquiry.student?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{inquiry.student?.name}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        En {inquiry.course?.title} • {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true, locale: es })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                            "{inquiry.question}"
                        </p>

                        {answeringId === inquiry.id ? (
                            <div className="space-y-3">
                                <Textarea
                                    placeholder="Escribe tu respuesta..."
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    className="text-sm min-h-[80px]"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setAnsweringId(null)}>Cancelar</Button>
                                    <Button size="sm" onClick={() => handleAnswer(inquiry.id)} className="bg-indigo-600 hover:bg-indigo-700">
                                        <Send className="mr-2 h-3 w-3" /> Responder
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setAnsweringId(inquiry.id)}>
                                Responder Consulta
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
