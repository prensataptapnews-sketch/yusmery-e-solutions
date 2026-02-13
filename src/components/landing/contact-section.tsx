"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function ContactSection() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate Server Action 
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.success("Mensaje enviado. Nos pondremos en contacto pronto.")
        setIsLoading(false)
        // Reset form would go here
    }

    return (
        <section id="contacto" className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">

                    {/* Left: Contact Info (Dark) */}
                    <div className="lg:w-2/5 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-6">Hablemos de tu proyecto</h3>
                            <p className="text-slate-300 mb-12">
                                ¿Listo para transformar tu organización? Nuestros expertos están listos para diseñar la solución perfecta.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold">Oficinas Centrales</p>
                                        <p className="text-slate-400 text-sm">Av. Reforma 123, Piso 15<br />Ciudad de México, CDMX</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Mail className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold">Correo Electrónico</p>
                                        <p className="text-slate-400 text-sm">contacto@e-solutions.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold">Teléfono</p>
                                        <p className="text-slate-400 text-sm">+52 (55) 1234-5678</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decor */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-slate-800/50 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-600/20 blur-3xl"></div>
                    </div>

                    {/* Right: Form (Light) */}
                    <div className="lg:w-3/5 p-12 bg-white">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre Completo</Label>
                                    <Input id="name" placeholder="Ej. Juan Pérez" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">Empresa</Label>
                                    <Input id="company" placeholder="Ej. Tech Solutions" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Corporativo</Label>
                                <Input id="email" type="email" placeholder="juan@empresa.com" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">¿En qué podemos ayudarte?</Label>
                                <Textarea id="message" placeholder="Cuéntanos sobre tus necesidades de capacitación..." className="min-h-[120px]" required />
                            </div>

                            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={isLoading}>
                                {isLoading ? "Enviando..." : "Enviar Mensaje"}
                            </Button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    )
}
