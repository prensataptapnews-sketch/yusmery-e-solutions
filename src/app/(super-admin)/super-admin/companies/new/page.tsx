
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus } from "lucide-react"

export default function CreateCompanyPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            router.push("/super-admin/companies")
        }, 1000)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Crear Nueva Empresa</h1>
                <p className="text-muted-foreground">Registrar una nueva organización en la plataforma.</p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Detalles de la Empresa</CardTitle>
                    <CardDescription>Información básica para configurar el tenant.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre de la Empresa</Label>
                            <Input id="name" placeholder="Ej. TechCorp Inc." required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="slug">Identificador (Slug)</Label>
                            <Input id="slug" placeholder="ej. techcorp" required />
                            <p className="text-xs text-muted-foreground">Se usará en la URL: esolutions.com/techcorp</p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="plan">Plan de Suscripción</Label>
                            <Select defaultValue="business">
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="starter">Starter (Hasta 50 usuarios)</SelectItem>
                                    <SelectItem value="business">Business (Hasta 200 usuarios)</SelectItem>
                                    <SelectItem value="enterprise">Enterprise (Ilimitado)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="adminEmail">Email del Administrador Principal</Label>
                            <Input id="adminEmail" type="email" placeholder="admin@empresa.com" required />
                        </div>
                        <div className="pt-4 flex justify-end gap-2">
                            <Button variant="outline" type="button" onClick={() => router.back()}>Cancelar</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Crear Empresa
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
