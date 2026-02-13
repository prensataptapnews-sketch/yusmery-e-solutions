
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Eye } from "lucide-react"
import { getTeacherStudents } from "@/app/actions/teacher"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export default function TeacherStudentsPage() {
    const [students, setStudents] = useState<any[]>([])
    const [filterCourse, setFilterCourse] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            const data = await getTeacherStudents()
            setStudents(data)
            setIsLoading(false)
        }
        loadData()
    }, [])

    const courses = Array.from(new Set(students.map(s => s.course)))

    const filteredStudents = students.filter(student => {
        const matchesCourse = filterCourse === "all" || student.course === filterCourse
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCourse && matchesSearch
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis Estudiantes</h1>
                <p className="text-slate-500">Gestiona y monitorea el progreso de tus alumnos asignados.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-[300px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar estudiante..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={filterCourse} onValueChange={setFilterCourse}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filtrar por curso" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los cursos</SelectItem>
                            {courses.map(course => (
                                <SelectItem key={course} value={course}>{course}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Estudiante</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead>Progreso</TableHead>
                            <TableHead>Última Actividad</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Cargando estudiantes...
                                </TableCell>
                            </TableRow>
                        ) : filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No se encontraron estudiantes.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={student.image} />
                                            <AvatarFallback>{student.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-slate-900">{student.name}</div>
                                        <div className="text-xs text-slate-500">{student.email}</div>
                                    </TableCell>
                                    <TableCell>{student.course}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-600 rounded-full"
                                                    style={{ width: `${student.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">{Math.round(student.progress)}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground italic">
                                        hace {formatDistanceToNow(new Date(student.lastActive), { locale: es })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

