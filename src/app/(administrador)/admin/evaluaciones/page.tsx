import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAdminEvaluationStats } from "@/app/actions/admin/evaluations"
import { EvaluationKPIs } from "@/components/admin/evaluations/evaluation-kpis"
import { EvaluationBarChart } from "@/components/admin/evaluations/evaluation-bar-chart"
import { StrugglingStudentsTable } from "@/components/admin/evaluations/struggling-students-table"
import { Separator } from "@/components/ui/separator"

export default async function AdminEvaluationsPage() {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMINISTRADOR' && session.user.role !== 'SUPER_ADMIN')) {
        redirect("/login")
    }

    // Filters would be passed here from searchParams eventually.
    // For now, fetching default (all time, all courses).
    const stats = await getAdminEvaluationStats()

    if (!stats) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                No se pudieron cargar las estadísticas.
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Evaluaciones y Rendimiento</h1>
                <p className="text-muted-foreground">
                    Análisis detallado del desempeño de los colaboradores en las evaluaciones.
                </p>
            </div>

            <Separator />

            {/* KPIs */}
            <EvaluationKPIs stats={stats.kpis} />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Bar Chart (Left/Top) */}
                <div className="col-span-4">
                    <EvaluationBarChart data={stats.chartData} />
                </div>

                {/* Struggling Students (Right/Bottom) */}
                <div className="col-span-4 lg:col-span-3">
                    <StrugglingStudentsTable students={stats.strugglingStudents} />
                </div>
            </div>
        </div>
    )
}
