import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, AlertCircle, Clock } from "lucide-react"

interface KPIProps {
    stats: {
        totalSubmissions: number
        approvalRate: number
        totalFailed: number
        totalPending: number
        avgScore: number
    }
}

export function EvaluationKPIs({ stats }: KPIProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Promedio Aprobación
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.approvalRate}%</div>
                    <p className="text-xs text-muted-foreground">
                        {stats.totalSubmissions} evaluaciones totales
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Promedio Calificación
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.avgScore}/100</div>
                    <p className="text-xs text-muted-foreground">
                        Puntuación media global
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Reprobados
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.totalFailed}</div>
                    <p className="text-xs text-muted-foreground">
                        Entregas no aprobadas
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Pendientes Revisión
                    </CardTitle>
                    <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.totalPending}</div>
                    <p className="text-xs text-muted-foreground">
                        Requieren feedback manual
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
