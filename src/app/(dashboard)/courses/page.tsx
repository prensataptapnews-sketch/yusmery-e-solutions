'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from 'next/link'

const myCourses = [
    {
        id: "1",
        title: "Liderazgo de Equipos Ágiles",
        progress: 45,
        totalModules: 8,
        completedModules: 3,
        lastAccessed: "Hace 2 días",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
        slug: "liderazgo-agil"
    },
    {
        id: "2",
        title: "Seguridad Industrial Básica",
        progress: 10,
        totalModules: 5,
        completedModules: 0,
        lastAccessed: "Hace 1 semana",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
        slug: "seguridad-basica"
    },
    {
        id: "3",
        title: "Excel Avanzado para Finanzas",
        progress: 90,
        totalModules: 12,
        completedModules: 10,
        lastAccessed: "Ayer",
        image: "https://images.unsplash.com/photo-1543286386-713df548e9cc?w=800&auto=format&fit=crop&q=60",
        slug: "excel-avanzado"
    },
]

export default function CoursesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Mis Cursos</h1>
                    <p className="text-muted-foreground">Continúa tu aprendizaje donde lo dejaste</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Filtrar mis cursos..." className="pl-8" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myCourses.map((course) => (
                    <Card key={course.id} className="flex flex-col overflow-hidden">
                        <div className="relative aspect-video">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Button variant="secondary" size="icon" className="rounded-full h-12 w-12" asChild>
                                    <Link href={`/courses/${course.slug}`}>
                                        <PlayCircle className="h-6 w-6 ml-0.5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                            <CardDescription>Ultimo acceso: {course.lastAccessed}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{course.progress}%</span>
                                    <span className="text-muted-foreground">{course.completedModules}/{course.totalModules} Módulos</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                            </div>
                        </CardContent>
                        <CardFooter className="pt-4">
                            <Button className="w-full" asChild>
                                <Link href={`/courses/${course.slug}`}>Continuar Curso</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
