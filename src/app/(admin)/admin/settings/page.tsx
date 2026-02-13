
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default async function AdminSettingsPage() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMINISTRADOR' && session.user.role !== 'SUPER_ADMIN') {
        redirect("/login");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
                <p className="text-muted-foreground">Administra tus preferencias.</p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Perfil de Administrador</CardTitle>
                    <CardDescription>Información básica de tu cuenta.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Nombre</Label>
                        <Input defaultValue={session.user.name || ""} disabled />
                    </div>
                    <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input defaultValue={session.user.email || ""} disabled />
                    </div>
                    <div className="grid gap-2">
                        <Label>Área Asignada</Label>
                        <Input defaultValue={String(session.user.assignedAreas || session.user.area || "N/A")} disabled />
                    </div>
                    <Button>Guardar Cambios</Button>
                </CardContent>
            </Card>
        </div>
    )
}
