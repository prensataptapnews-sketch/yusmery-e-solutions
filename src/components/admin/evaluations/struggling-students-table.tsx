import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Student {
    user: {
        name: string | null
        email: string | null
        avatar: string | null
    }
    avgScore: number
    evaluationsTaken: number
    failedCount: number
}

interface TableProps {
    students: Student[]
}

export function StrugglingStudentsTable({ students }: TableProps) {
    return (
        <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
                <CardTitle>Colaboradores con Dificultades</CardTitle>
                <CardDescription>
                    Alumnos con promedio inferior al 60% en sus evaluaciones.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Colaborador</TableHead>
                            <TableHead className="text-center">Promedio</TableHead>
                            <TableHead className="text-center">Evaluaciones</TableHead>
                            <TableHead className="text-center">Reprobadas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                    ¡Excelente! No hay colaboradores en riesgo por el momento.
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student, index) => (
                                <TableRow key={index}>
                                    <TableCell className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={student.user.avatar || ""} />
                                            <AvatarFallback>{student.user.name?.substring(0, 2).toUpperCase() || "AL"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{student.user.name || "Sin Nombre"}</div>
                                            <div className="text-xs text-muted-foreground">{student.user.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-red-600">
                                        {student.avgScore}%
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {student.evaluationsTaken}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {student.failedCount}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
