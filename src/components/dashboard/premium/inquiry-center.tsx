"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function InquiryCenter({ initialInquiries, courses }: { initialInquiries: any[], courses: any[] }) {
    const [inquiries, setInquiries] = useState(initialInquiries)
    const [isNewOpen, setIsNewOpen] = useState(false)

    // Simple state for new inquiry
    const [newInquiry, setNewInquiry] = useState({
        courseId: "",
        question: ""
    })

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Buscar consultas..." className="pl-10" />
                </div>
                <div className="space-y-3">
                    {inquiries.map(inq => (
                        <Card key={inq.id} className="cursor-pointer hover:border-indigo-500 transition-colors bg-white dark:bg-slate-950">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant={inq.answer ? "default" : "secondary"} className="text-[10px]">
                                        {inq.answer ? "RESPONDIDA" : "PENDIENTE"}
                                    </Badge>
                                    <span className="text-[10px] text-slate-500">{new Date(inq.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <h4 className="text-sm font-bold line-clamp-1">{inq.question}</h4>
                                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{inq.course?.title}</p>
                            </CardContent>
                        </Card>
                    ))}
                    <Button className="w-full gap-2 font-bold py-6 rounded-xl" onClick={() => setIsNewOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Nueva Consulta
                    </Button>
                </div>
            </div>

            <div className="lg:col-span-2">
                {isNewOpen ? (
                    <Card className="border-none shadow-xl">
                        <CardHeader>
                            <CardTitle>Enviar Nueva Consulta</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Curso Relacionado</label>
                                <Select onValueChange={(v) => setNewInquiry({ ...newInquiry, courseId: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un curso" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Tu Pregunta</label>
                                <Textarea
                                    placeholder="Describe tu duda con detalle..."
                                    className="min-h-[150px]"
                                    value={newInquiry.question}
                                    onChange={(e) => setNewInquiry({ ...newInquiry, question: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 font-bold py-6">Enviar Consulta</Button>
                                <Button variant="outline" className="px-8" onClick={() => setIsNewOpen(false)}>Cancelar</Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : inquiries.length > 0 ? (
                    <div className="space-y-6">
                        {/* Conversation View Placeholder */}
                        <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold">Selecciona una consulta</h3>
                            <p className="text-sm text-slate-500">Selecciona una conversación de la lista para ver el detalle y las respuestas de tus profesores.</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-slate-500">No tienes consultas activas.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
