'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Video, Mic, Calendar } from "lucide-react"

const categories = [
    { id: "hr", title: "Gestión de RRHH", icon: "📊" },
    { id: "perf", title: "Evaluación de Desempeño", icon: "📈" },
    { id: "planning", title: "Planificación Laboral", icon: "📅" },
    { id: "leadership", title: "Liderazgo", icon: "🎯" },
    { id: "compliance", title: "Cumplimiento", icon: "🛡️" },
    { id: "wellness", title: "Bienestar Organizacional", icon: "💚" },
]

const resources = [
    {
        id: 1,
        title: "Guía Completa de Onboarding 2024",
        type: "E-book",
        category: "Gestión de RRHH",
        icon: FileText,
        color: "text-blue-500",
        description: "Manual paso a paso para integrar nuevos talentos a la cultura organizacional."
    },
    {
        id: 2,
        title: "Plantilla de Evaluación 360°",
        type: "Plantilla",
        category: "Evaluación de Desempeño",
        icon: FileText,
        color: "text-green-500",
        description: "Formato editable en Excel para implementar evaluaciones integrales."
    },
    {
        id: 3,
        title: "Tendencias de Liderazgo Remoto",
        type: "Webinar",
        category: "Liderazgo",
        icon: Video,
        color: "text-purple-500",
        description: "Grabación del seminario web sobre gestión de equipos distribuidos."
    },
    {
        id: 4,
        title: "Checklist de Seguridad Laboral",
        type: "Plantilla",
        category: "Cumplimiento",
        icon: FileText,
        color: "text-red-500",
        description: "Lista de verificación para auditorías internas de seguridad."
    },
    {
        id: 5,
        title: "Podcast: Bienestar Mental en el Trabajo",
        type: "Audio",
        category: "Bienestar Organizacional",
        icon: Mic,
        color: "text-yellow-500",
        description: "Entrevista con expertos sobre salud mental corporativa."
    },
    {
        id: 6,
        title: "Calendario Fiscal y Laboral 2025",
        type: "Plantilla",
        category: "Planificación Laboral",
        icon: Calendar,
        color: "text-orange-500",
        description: "Fechas clave para el departamento de personal y finanzas."
    }
]

export default function LibraryPage() {
    return (
        <div className="space-y-8 pb-8">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 p-8 md:p-12 text-white shadow-lg mx-6 mt-6">
                <div className="relative z-10 max-w-2xl">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white mb-4">Recurso Destacado</Badge>
                    <h1 className="text-3xl font-bold mb-4">Manual de Cultura Organizacional</h1>
                    <p className="text-blue-50 mb-6 text-lg">
                        Descubre las claves para construir equipos de alto rendimiento y retener el mejor talento en tu empresa.
                    </p>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 border-0">
                        <Download className="mr-2 h-5 w-5" /> Descargar Ahora
                    </Button>
                </div>
                {/* Decorative elements */}
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            </div>

            <div className="px-6">
                {/* Categories */}
                <h2 className="text-xl font-semibold mb-4">Explorar por Categoría</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {categories.map((cat) => (
                        <Card key={cat.id} className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                                <span className="text-3xl mb-2" role="img" aria-label={cat.title}>{cat.icon}</span>
                                <span className="text-sm font-medium leading-tight">{cat.title}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Resources Grid */}
                <h2 className="text-xl font-semibold mb-4">Últimos Recursos</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {resources.map((resource) => (
                        <Card key={resource.id} className="flex flex-col">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className={`p-2 rounded-lg bg-muted ${resource.color} bg-opacity-10`}>
                                    <resource.icon className={`h-6 w-6 ${resource.color}`} />
                                </div>
                                <Badge variant="outline">{resource.type}</Badge>
                            </CardHeader>
                            <CardContent className="flex-1 pt-4">
                                <div className="text-sm text-muted-foreground mb-1">{resource.category}</div>
                                <CardTitle className="text-lg mb-2 leading-tight">{resource.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {resource.description}
                                </p>
                            </CardContent>
                            <div className="p-4 pt-0 mt-auto">
                                <Button variant="secondary" className="w-full justify-between group">
                                    Descargar
                                    <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
