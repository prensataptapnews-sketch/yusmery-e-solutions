"use client"

import { cn } from "@/lib/utils"
import { Hexagon, Globe, Zap, Cloud, Shield, Cpu, Layers, Box } from "lucide-react"

const COMPANIES = [
    { name: "PolyTech", icon: Hexagon },
    { name: "GlobalSync", icon: Globe },
    { name: "EnergyCorp", icon: Zap },
    { name: "CloudSystems", icon: Cloud },
    { name: "SecureNet", icon: Shield },
    { name: "FutureLogic", icon: Cpu },
    { name: "StackSolutions", icon: Layers },
    { name: "CubeWorks", icon: Box },
]

export function CompaniesSection() {
    return (
        <section id="empresas" className="py-12 bg-white border-y border-slate-100 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Confían en nosotros las empresas líderes
                </p>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-16 py-4">
                    {[...COMPANIES, ...COMPANIES, ...COMPANIES].map((company, idx) => (
                        <div key={`${company.name}-${idx}`} className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 cursor-default">
                            <div className="h-10 w-10 flex items-center justify-center text-slate-800">
                                <company.icon className="h-8 w-8 fill-current/10" />
                            </div>
                            <span className="text-xl font-bold text-slate-700">{company.name}</span>
                        </div>
                    ))}
                </div>

                <div className="animate-marquee2 whitespace-nowrap flex items-center gap-16 py-4 absolute top-0 left-0">
                    {[...COMPANIES, ...COMPANIES, ...COMPANIES].map((company, idx) => (
                        <div key={`${company.name}-dup-${idx}`} className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 cursor-default">
                            <div className="h-10 w-10 flex items-center justify-center text-slate-800">
                                <company.icon className="h-8 w-8 fill-current/10" />
                            </div>
                            <span className="text-xl font-bold text-slate-700">{company.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
