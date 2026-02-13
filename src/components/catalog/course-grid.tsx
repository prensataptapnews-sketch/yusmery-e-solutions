"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, Loader2 } from "lucide-react"
import { enrollInCourse } from "@/app/actions/enrollment"
import { toast } from "sonner"
import Link from "next/link"

interface Course {
    id: string
    title: string
    description: string
    area: string
    modality: string
    duration: string
    image?: string
    progress?: number // undefined if not enrolled
    isEnrolled: boolean
}

interface CourseGridProps {
    courses: Course[]
    loading: boolean
}

export function CourseGrid({ courses, loading }: CourseGridProps) {
    const router = useRouter()
    const [enrollingId, setEnrollingId] = useState<string | null>(null)

    const handleEnroll = async (courseId: string) => {
        setEnrollingId(courseId)
        try {
            const res = await enrollInCourse(courseId)
            if (res.success) {
                toast.success(res.message)
                // Redirect to classroom immediately as requested:
                router.push(`/classroom/courses/${courseId}`)
                setTimeout(() => router.refresh(), 100)
            } else {
                toast.error(res.error || "Error al inscribirse")
            }
        } catch (error) {
            toast.error("Error de conexión")
        } finally {
            setEnrollingId(null)
        }
    }

    if (loading) {
        return <div className="p-8 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" /><p className="mt-2 text-muted-foreground">Cargando catálogo...</p></div>
    }

    if (courses.length === 0) {
        return (
            <div className="p-12 text-center border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No se encontraron cursos publicados.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    <div className="aspect-video w-full bg-muted relative">
                        {/* Placeholder generic image/gradient if no image - could use course.image if valid url */}
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 bg-gradient-to-br from-muted to-muted/50">
                            <BookOpen className="h-10 w-10" />
                        </div>
                        <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-background/90 backdrop-blur text-foreground">
                                {course.modality}
                            </Badge>
                        </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="text-xs font-normal">
                                {course.area}
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {course.duration}
                            </div>
                        </div>
                        <CardTitle className="text-lg line-clamp-2 leading-tight min-h-[3rem]">
                            {course.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {course.description || "Sin descripción disponible."}
                        </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                        {!course.isEnrolled ? (
                            <Button
                                className="w-full"
                                onClick={() => handleEnroll(course.id)}
                                disabled={enrollingId === course.id}
                            >
                                {enrollingId === course.id ? <Loader2 className="animate-spin h-4 w-4" /> : "Inscribirme"}
                            </Button>
                        ) : course.progress === 100 ? (
                            <Button className="w-full" variant="secondary" asChild>
                                <Link href="/certificates">Ver Certificado</Link>
                            </Button>
                        ) : (
                            <Button className="w-full" variant="default" asChild>
                                <Link href={`/classroom/courses/${course.id}`}>Continuar</Link>
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
