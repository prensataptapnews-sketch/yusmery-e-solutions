'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">Configuración de Perfil</h1>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="general">Información General</TabsTrigger>
                    <TabsTrigger value="password">Seguridad</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tu Información</CardTitle>
                            <CardDescription>Actualiza tus datos personales y de contacto.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src="/avatars/01.png" />
                                    <AvatarFallback className="text-xl">AG</AvatarFallback>
                                </Avatar>
                                <Button variant="outline">Cambiar Avatar</Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre Completo</Label>
                                    <Input id="name" defaultValue="Ana García" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Corporativo</Label>
                                    <Input id="email" defaultValue="ana.garcia@example.com" disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dept">Departamento</Label>
                                    <Input id="dept" defaultValue="Recursos Humanos" disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pos">Cargo</Label>
                                    <Input id="pos" defaultValue="Analista Senior" disabled />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Button>Guardar Cambios</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contraseña</CardTitle>
                            <CardDescription>Tu cuenta es gestionada por tu organización.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Para cambiar tu contraseña, por favor contacta al administrador de sistemas o utiliza el portal de auto-servicio de tu empresa.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
