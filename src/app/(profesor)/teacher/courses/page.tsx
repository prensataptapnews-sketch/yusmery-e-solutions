import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, MoreHorizontal } from "lucide-react"
import { getTeacherCourses } from "@/app/actions/teacher"
import Image from "next/image"
import Link from "next/link"

export default async function TeacherCoursesPage() {
    const courses = await getTeacherCourses()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Mis Cursos Asignados</h1>
                <p className="text-muted-foreground">Gestiona el contenido y seguimiento de tus cursos.</p>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                    <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No tienes cursos asignados</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2">
                        Contacta al administrador si crees que esto es un error.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="h-40 bg-slate-100 relative overflow-hidden">
                                {course.thumbnail ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={course.thumbnail}
                                            alt={course.title}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                                        <BookOpen className="h-12 w-12" />
                                    </div>
                                )}
                                {course.published ? (
                                    <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">Publicado</Badge>
                                ) : (
                                    <Badge variant="secondary" className="absolute top-2 right-2">Borrador</Badge>
                                )}
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
                                <CardDescription className="line-clamp-2 h-10">
                                    {course.description || "Sin descripción"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-slate-500 mb-4 bg-slate-50 p-2 rounded-md">
                                    <div className="flex items-center gap-1.5">
                                        <Users className="h-4 w-4 text-indigo-500" />
                                        <span>{course._count?.enrollments || 0} alumnos</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen className="h-4 w-4 text-indigo-500" />
                                        <span>{course._count?.modules || 0} módulos</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/teacher/courses/${course.id}`} className="w-full">
                                        <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">Ver Detalles</Button>
                                    </Link>
                                    <Button variant="ghost" size="icon" className="text-slate-400">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
