"use client"

import { Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const PROGRAMS = [
    {
        title: "Liderazgo en la Era Digital",
        level: "Intermedio",
        duration: "12h",
        image: "/assets/landing/program-leadership.png",
        category: "Management"
    },
    {
        title: "Análisis de Datos con Power BI",
        level: "Avanzado",
        duration: "24h",
        image: "/assets/landing/program-data.png",
        category: "Data"
    },
    {
        title: "Gestión de Proyectos Ágiles",
        level: "Principiante",
        duration: "16h",
        image: "/assets/landing/program-agile.png",
        category: "Proyectos"
    }
]

export function ProgramsPreview() {
    return (
        <section id="programas" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="max-w-2xl">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Programas Destacados</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Capacitación de alto impacto
                        </h3>
                    </div>
                    <Button variant="outline" asChild className="hidden md:flex">
                        <Link href="/catalog">
                            Ver Catálogo Completo
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {PROGRAMS.map((prog, idx) => (
                        <div key={idx} className="group rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 bg-white flex flex-col h-full">
                            {/* Image Header */}
                            <div className="h-56 w-full relative overflow-hidden">
                                <Image
                                    src={prog.image}
                                    alt={prog.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors"></div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                                        {prog.category}
                                    </Badge>
                                    <div className="flex items-center text-xs text-slate-500 gap-1">
                                        <Clock className="h-3 w-3" />
                                        {prog.duration}
                                    </div>
                                </div>

                                <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                                    {prog.title}
                                </h4>
                                <p className="text-sm text-slate-500 mb-6 flex-1">
                                    Domina las habilidades clave y metodologías actuales para destacar en tu sector.
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                                    <span className="text-sm font-medium text-slate-500">Nivel: {prog.level}</span>
                                    <Button size="sm" variant="ghost" className="text-slate-900 hover:text-amber-600 p-0 hover:bg-transparent">
                                        Ver detalles <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center md:hidden">
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/catalog">Ver Catálogo Completo</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
