
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

import { AdminReportsDashboard } from "@/components/admin/reports-dashboard"

export default async function AdminReportsPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMINISTRADOR' && session.user.role !== 'SUPER_ADMIN') {
        redirect("/login");
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analítica Avanzada</h1>
                    <p className="text-slate-500">Monitorización de KPIs de formación y cumplimiento corporativo.</p>
                </div>
            </div>

            <AdminReportsDashboard />
        </div>
    )
}
