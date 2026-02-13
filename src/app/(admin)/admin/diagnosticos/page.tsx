
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

export default async function AdminDiagnosticsPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMINISTRADOR' && session.user.role !== 'SUPER_ADMIN') {
        redirect("/login");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Diagnósticos</h1>
                <p className="text-muted-foreground">Resultados de diagnósticos de nivelación.</p>
            </div>
            <Card>
                <CardContent className="p-10 text-center text-slate-500">
                    No hay diagnósticos activos para esta área.
                </CardContent>
            </Card>
        </div>
    )
}
