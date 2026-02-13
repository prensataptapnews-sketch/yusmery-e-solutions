import Link from "next/link"
import { ArrowRight, PlayCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface HeroCardProps {
    course: {
        id: string
        title: string
        slug: string
        progress: number
        thumbnail?: string
    } | null
}

export function HeroCard({ course }: HeroCardProps) {
    if (!course) {
        return (
            <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-teal-500 to-blue-600 text-white">
                <CardContent className="flex flex-col items-start justify-center p-8 min-h-[200px]">
                    <h2 className="text-2xl font-bold mb-2">¡Bienvenido a e-Solutions!</h2>
                    <p className="mb-6 opacity-90 max-w-md">
                        Comienza tu viaje de aprendizaje explorando nuestro catálogo de cursos diseñados para tu crecimiento profesional.
                    </p>
                    <Button asChild variant="secondary" className="bg-white text-teal-600 hover:bg-teal-50">
                        <Link href="/catalog">
                            Explorar Catálogo
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-teal-500 to-blue-600 text-white">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <PlayCircle className="h-64 w-64 -mr-12 -mt-12" />
            </div>
            <CardContent className="flex flex-col items-start justify-center p-8 relative z-10">
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium mb-4 backdrop-blur-sm">
                    Curso en progreso
                </div>

                <h2 className="text-3xl font-bold mb-2 line-clamp-2 max-w-2xl">
                    {course.title}
                </h2>

                <div className="w-full max-w-md space-y-2 mb-6">
                    <div className="flex justify-between text-sm font-medium">
                        <span>Tu progreso</span>
                        <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2 bg-white/20" indicatorClassName="bg-white" />
                </div>

                <Button asChild size="lg" className="bg-white text-teal-600 hover:bg-teal-50 font-semibold border-0">
                    <Link href={`/classroom/courses/${course.id}`}>
                        Continuar Aprendizaje
                        <PlayCircle className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
