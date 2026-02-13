
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Trophy } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

export default async function DiagnosticResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) return redirect('/login')

    const result = await prisma.diagnosticResult.findUnique({
        where: {
            userId_diagnosticId: {
                userId: session.user.id,
                diagnosticId: id
            }
        },
        include: {
            diagnostic: true
        }
    })

    if (!result) return redirect(`/diagnosticos/${id}`)

    const percentage = Math.round((result.score / result.maxScore) * 100)

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'BASICO': return 'bg-red-100 text-red-700 border-red-200'
            case 'INTERMEDIO': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            case 'AVANZADO': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'EXPERTO': return 'bg-green-100 text-green-700 border-green-200'
            default: return 'bg-gray-100'
        }
    }

    // Mock recommended courses logic for now as we don't have a CourseLevel field yet
    // In a real app, we'd filter courses by Diagnostic Category + Assigned Level
    const recommendedCourses = [
        { id: 1, title: `Curso de ${result.diagnostic.category} - Nivel ${result.level}`, duration: "4 semanas", image: "/placeholder-course.jpg" },
        { id: 2, title: `Taller Práctico de ${result.diagnostic.category}`, duration: "2 semanas", image: "/placeholder-workshop.jpg" }
    ]

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
            <Link href="/diagnosticos" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Diagnósticos
            </Link>

            <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
                <div className="bg-muted/30 p-8 text-center border-b">
                    <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                        <Trophy className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">¡Resultado Completado!</h1>
                    <p className="text-muted-foreground">Has finalizado el diagnóstico de {result.diagnostic.title}</p>
                </div>

                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Nivel Obtenido</h3>
                                <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold border ${getLevelColor(result.level)}`}>
                                    {result.level}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Puntuación</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold">{result.score}</span>
                                    <span className="text-muted-foreground">/ {result.maxScore} pts</span>
                                    <Badge variant="outline" className="ml-2">
                                        {percentage}%
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/20 rounded-xl p-6 border">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Cursos Recomendados
                            </h3>
                            <div className="space-y-4">
                                {recommendedCourses.map((course) => (
                                    <div key={course.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{course.title}</p>
                                            <p className="text-xs text-muted-foreground">{course.duration}</p>
                                        </div>
                                        <Button size="sm">Inscribirme</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
