"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    PlayCircle,
    MessageSquare,
    FileText,
    Download,
    Trophy,
    Send
} from "lucide-react"
import { markLessonComplete, getLessonResources, getLessonComments, addComment } from "@/app/actions/classroom"
import { toast } from "sonner"
import { LessonEvaluationCard } from "./evaluations/lesson-evaluation-card"
import Link from "next/link"

interface LessonViewerProps {
    lesson: {
        id: string
        title: string
        content: string | null
        contentType: string
        videoUrl: string | null
        evaluations: any[]
    }
    isCompleted: boolean
    onComplete: () => void
    onNext: () => void
    onPrev: () => void
    hasPrev: boolean
    hasNext: boolean
    courseProgress: number
    courseId: string
}

export function LessonViewer({
    lesson,
    isCompleted,
    onComplete,
    onNext,
    onPrev,
    hasPrev,
    hasNext,
    courseProgress,
    courseId
}: LessonViewerProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [resources, setResources] = useState<any[]>([])
    const [comments, setComments] = useState<any[]>([])
    const [newComment, setNewComment] = useState("")
    const [isSubmittingComment, setIsSubmittingComment] = useState(false)

    useEffect(() => {
        const loadLessonData = async () => {
            const [resResources, resComments] = await Promise.all([
                getLessonResources(lesson.id),
                getLessonComments(lesson.id)
            ])
            if (resResources.success) setResources(resResources.resources || [])
            if (resComments.success) setComments(resComments.comments || [])
        }
        loadLessonData()
    }, [lesson.id])

    const handleMarkComplete = async () => {
        setIsLoading(true)
        try {
            const res = await markLessonComplete(lesson.id)
            if (res.success) {
                toast.success("Lección completada")
                onComplete()
            } else {
                toast.error("Error al marcar como completada")
            }
        } catch (error) {
            toast.error("Error de conexión")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddComment = async () => {
        if (!newComment.trim()) return
        setIsSubmittingComment(true)
        try {
            const res = await addComment(lesson.id, newComment)
            if (res.success && res.comment) {
                setComments(prev => [res.comment, ...prev])
                setNewComment("")
                toast.success("Comentario añadido")
            }
        } catch (error) {
            toast.error("Error al publicar comentario")
        } finally {
            setIsSubmittingComment(false)
        }
    }

    const hasEvaluation = lesson.evaluations && lesson.evaluations.length > 0
    const evaluation = hasEvaluation ? lesson.evaluations[0] : null
    const isCourseFinished = courseProgress >= 100

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto w-full p-6">

            {/* Video / Content Area */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-6 relative group border border-slate-800">
                {lesson.videoUrl ? (
                    <iframe
                        src={lesson.videoUrl.replace("watch?v=", "embed/")}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : lesson.contentType === "VIDEO" ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white bg-slate-900">
                        <PlayCircle className="h-20 w-20 mb-4 text-blue-500 opacity-80 group-hover:scale-110 transition-transform" />
                        <p className="text-xl font-semibold">Video de la Lección</p>
                        <p className="text-sm text-slate-400 mt-2">Reproductor multimedia</p>
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500">
                        <p>Contenido de Lectura / Interactivo</p>
                    </div>
                )}
            </div>

            <div className="flex-1 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{lesson.title}</h1>
                        <p className="text-slate-500">Módulo de aprendizaje continuo</p>
                    </div>

                    {isCourseFinished && (
                        <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white gap-2 shadow-lg animate-bounce">
                            <Link href={`/certificates/${courseId}`}>
                                <Trophy className="h-5 w-5" />
                                Descargar Certificado
                            </Link>
                        </Button>
                    )}
                </div>

                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="content">Descripción</TabsTrigger>
                        <TabsTrigger value="resources" className="gap-2">
                            Recursos
                            {resources.length > 0 && (
                                <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 rounded-full">
                                    {resources.length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="comments" className="gap-2">
                            Comentarios
                            {comments.length > 0 && (
                                <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 rounded-full">
                                    {comments.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="mt-6">
                        <Card className="p-6 border-slate-200 bg-white/50 backdrop-blur-sm">
                            <div className="prose max-w-none text-slate-700 leading-relaxed">
                                {lesson.content || "En esta lección profundizaremos en los conceptos clave del módulo. Sigue las instrucciones del video y toma notas de los puntos más importantes."}
                            </div>

                            {hasEvaluation && (
                                <div className="mt-8 pt-8 border-t">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        Evaluación Obligatoria
                                    </h3>
                                    <LessonEvaluationCard
                                        evaluation={evaluation}
                                        isCompleted={evaluation.submissions?.length > 0}
                                    />
                                </div>
                            )}
                        </Card>
                    </TabsContent>

                    <TabsContent value="resources" className="mt-6">
                        <div className="grid gap-4">
                            {resources.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl text-slate-400">
                                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                    No hay recursos disponibles para esta lección.
                                </div>
                            ) : (
                                resources.map((resource) => (
                                    <Card key={resource.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">{resource.title}</p>
                                                <p className="text-xs text-slate-500 capitalize">{resource.type}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" asChild>
                                            <a href={resource.url} download className="gap-2">
                                                <Download className="h-4 w-4" />
                                                Descargar
                                            </a>
                                        </Button>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="comments" className="mt-6">
                        <div className="space-y-6">
                            <div className="flex gap-3">
                                <Avatar className="h-10 w-10 flex-shrink-0">
                                    <AvatarFallback className="bg-blue-600 text-white">YO</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 flex gap-2">
                                    <Input
                                        placeholder="Escribe un comentario o duda..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                        className="bg-white"
                                    />
                                    <Button
                                        size="icon"
                                        disabled={isSubmittingComment || !newComment.trim()}
                                        onClick={handleAddComment}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {comments.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400 italic">
                                        Sé el primero en comentar esta lección.
                                    </div>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <Avatar className="h-9 w-9 flex-shrink-0">
                                                <AvatarImage src={comment.user.avatar || ""} />
                                                <AvatarFallback className="bg-slate-200">
                                                    {(comment.user.name || "U")[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-semibold text-sm text-slate-900">{comment.user.name}</span>
                                                    <span className="text-[10px] text-slate-400">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-700">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex items-center justify-between pt-8 border-t mt-12 mb-8">
                    <Button
                        variant="ghost"
                        onClick={onPrev}
                        disabled={!hasPrev}
                        className="gap-2 text-slate-600 hover:text-slate-900"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        Anterior
                    </Button>

                    <div className="flex gap-4">
                        {!isCompleted && (
                            <Button
                                onClick={handleMarkComplete}
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700 text-white min-w-[140px] shadow-md"
                            >
                                {isLoading ? "Guardando..." : "Marcar como Visto"}
                            </Button>
                        )}

                        <Button
                            onClick={onNext}
                            disabled={!hasNext}
                            variant={isCompleted ? "default" : "outline"}
                            className={isCompleted ? "bg-blue-600 hover:bg-blue-700 shadow-md gap-2" : "gap-2"}
                        >
                            Siguiente Lección
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

