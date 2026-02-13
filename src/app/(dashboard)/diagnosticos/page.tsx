
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, Circle, FileText, BarChart, Users, Brain } from "lucide-react"
import Link from "next/link"

const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
        case 'excel': return <FileText className="h-6 w-6 text-green-600" />
        case 'powerbi': return <BarChart className="h-6 w-6 text-yellow-600" />
        case 'liderazgo': return <Users className="h-6 w-6 text-blue-600" />
        default: return <Brain className="h-6 w-6 text-purple-600" />
    }
}

export default async function DiagnosticsPage() {
    const session = await auth()

    if (!session?.user?.id) return null

    const diagnostics = await prisma.diagnostic.findMany({
        where: { published: true },
        include: {
            questions: {
                select: { id: true }
            },
            results: {
                where: { userId: session.user.id },
                select: { level: true, score: true, maxScore: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">🔍 Diagnósticos</h1>
                <p className="text-muted-foreground mt-2">
                    Evalúa tu nivel actual en diferentes áreas y recibe recomendaciones personalizadas.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diagnostics.map((diagnostic) => {
                    const result = diagnostic.results[0]
                    const isCompleted = !!result
                    const questionCount = diagnostic.questions.length
                    const estimatedTime = Math.ceil(questionCount * 1.5) // ~1.5 min per question

                    return (
                        <Card key={diagnostic.id} className="flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-muted rounded-lg">
                                        {getCategoryIcon(diagnostic.category)}
                                    </div>
                                    <div>
                                        <Badge variant="outline" className="mb-1">{diagnostic.category}</Badge>
                                        <CardTitle className="text-xl">{diagnostic.title}</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <CardDescription className="line-clamp-3 mb-4">
                                    {diagnostic.description}
                                </CardDescription>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <FileText className="h-4 w-4" />
                                        <span>{questionCount} preguntas</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>~{estimatedTime} min</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-4 border-t bg-muted/20">
                                {isCompleted ? (
                                    <div className="w-full flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-green-600 font-medium">
                                            <CheckCircle2 className="h-5 w-5" />
                                            <span>Completado</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-muted-foreground">Nivel</span>
                                            <Badge variant={
                                                result.level === 'EXPERTO' ? 'default' :
                                                    result.level === 'AVANZADO' ? 'secondary' :
                                                        'outline'
                                            }>
                                                {result.level}
                                            </Badge>
                                        </div>
                                        <Link href={`/diagnosticos/${diagnostic.id}/resultado`} className="ml-4">
                                            <Button variant="ghost" size="sm">Ver resultados</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <Link href={`/diagnosticos/${diagnostic.id}`} className="w-full">
                                        <Button className="w-full group">
                                            Comenzar diagnóstico
                                            <Circle className="ml-2 h-4 w-4 group-hover:fill-current" />
                                        </Button>
                                    </Link>
                                )}
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
