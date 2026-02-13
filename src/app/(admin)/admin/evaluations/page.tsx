
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area } from "@prisma/client"

export default async function AdminEvaluationsPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMINISTRADOR' && session.user.role !== 'SUPER_ADMIN') {
        redirect("/login");
    }

    const { default: prisma } = await import("@/lib/prisma")
    // Similar area logic...
    // Listing evaluations taken by users in this area

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Evaluaciones de Área</h1>
                <p className="text-muted-foreground">Resultados de evaluaciones de tus colaboradores.</p>
            </div>
            <Card>
                <CardContent className="p-10 text-center text-slate-500">
                    Funcionalidad de auditoría de evaluaciones en desarrollo.
                </CardContent>
            </Card>
        </div>
    )
}
