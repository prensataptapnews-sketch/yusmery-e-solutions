
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default async function SuperAdminSettingsPage() {
    const session = await auth();

    if (session?.user?.role !== 'SUPER_ADMIN') {
        redirect("/login");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Configuración de Plataforma</h1>
                <p className="text-muted-foreground">Ajustes generales del sistema SaaS.</p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Datos de la Plataforma</CardTitle>
                    <CardDescription>Información visible para los inquilinos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Nombre de la Plataforma</Label>
                        <Input defaultValue="E-Solutions" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Email de Soporte</Label>
                        <Input defaultValue="soporte@esolutions.com" />
                    </div>
                    <Button>Guardar Cambios</Button>
                </CardContent>
            </Card>
        </div>
    )
}
