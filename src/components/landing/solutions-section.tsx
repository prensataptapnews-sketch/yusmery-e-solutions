"use client"

import { Briefcase, GraduationCap, Rocket, LineChart, Users, ShieldCheck } from "lucide-react"

const SOLUTIONS = [
    {
        title: "Capacitación Corporativa",
        description: "Programas de formación a medida para potenciar las habilidades técnicas y blandas de tu equipo.",
        icon: GraduationCap,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        title: "Consultoría Estratégica",
        description: "Diagnóstico y estrategias de capital humano alineadas con los objetivos de tu negocio.",
        icon: Briefcase,
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    {
        title: "Transformación Digital",
        description: "Implementación de LMS y herramientas digitales para modernizar la gestión del talento.",
        icon: Rocket,
        color: "text-purple-600",
        bg: "bg-purple-50"
    },
    {
        title: "Análisis de Desempeño",
        description: "Metricas y KPIs para medir el impacto real de la formación en la productividad.",
        icon: LineChart,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        title: "Bienestar Organizacional",
        description: "Iniciativas para mejorar el clima laboral y la retención del talento clave.",
        icon: Users,
        color: "text-rose-600",
        bg: "bg-rose-50"
    },
    {
        title: "Certificaciones Oficiales",
        description: "Avalamos el conocimiento de tu equipo con certificaciones válidas y reconocidas.",
        icon: ShieldCheck,
        color: "text-cyan-600",
        bg: "bg-cyan-50"
    }

]

export function SolutionsSection() {
    return (
        <section id="soluciones" className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Nuestras Soluciones</h2>
                    <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Impulsa el crecimiento integral</h3>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Explora nuestras categorías diseñadas para transformar cada aspecto de tu organización.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SOLUTIONS.map((sol, index) => (
                        <div key={index} className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.05)] transition-all duration-300 border-none group cursor-default">
                            {/* Icon Box */}
                            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105 ${sol.bg} ${sol.color}`}>
                                <sol.icon className="h-8 w-8 stroke-[1.5]" />
                            </div>

                            {/* Content */}
                            <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-800 transition-colors">
                                {sol.title}
                            </h4>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                {sol.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
