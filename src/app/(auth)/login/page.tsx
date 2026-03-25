"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { LayoutDashboard, GraduationCap, ShieldCheck, UserCircle, Loader2, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function onSelectRole(email: string, roleName: string) {
        setIsLoading(roleName)
        setError(null)
        try {
            const result = await signIn("credentials", {
                email: email,
                password: "developer",
                redirect: false,
            })
            if (result?.error) {
                setError("Error al acceder al panel. Intenta nuevamente.")
                setIsLoading(null)
            } else {
                window.location.href = "/"
            }
        } catch (error) {
            setError("Ocurrió un error inesperado.")
            setIsLoading(null)
        }
    }

    const panels = [
        {
            title: "Colaborador",
            description: "Accede a tus cursos, metas OKR y reconocimientos.",
            email: "colaborador@empresa.com",
            icon: UserCircle,
            color: "from-blue-500 to-indigo-600",
            hoverColor: "group-hover:text-blue-400"
        },
        {
            title: "Profesor",
            description: "Gestiona clases, evaluaciones y feedback de alumnos.",
            email: "profe@empresa.com",
            icon: GraduationCap,
            color: "from-purple-500 to-pink-600",
            hoverColor: "group-hover:text-purple-400"
        },
        {
            title: "Administrador",
            description: "Panel de control total de la plataforma y usuarios.",
            email: "admin@esolutions.com",
            icon: ShieldCheck,
            color: "from-amber-400 to-orange-600",
            hoverColor: "group-hover:text-amber-400"
        }
    ]

    return (
        <div className="w-full max-w-6xl px-4 py-12 mx-auto">
            <div className="text-center mb-16">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest animate-pulse">
                    Acceso Instantáneo • Modo Demo
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                    Selecciona tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400">Experiencia</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    Explora las funcionalidades de E-Solutions sin esperas. Elige un perfil para entrar directamente al panel.
                </p>
                {error && (
                    <div className="mt-8 mx-auto max-w-md p-4 bg-rose-500/20 border border-rose-500/50 rounded-2xl text-rose-300 font-bold animate-shake">
                        ⚠️ {error}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {panels.map((panel) => (
                    <Card 
                        key={panel.title}
                        className={cn(
                            "group cursor-pointer relative overflow-hidden bg-slate-900/40 border-slate-800 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(79,70,229,0.3)]",
                            isLoading === panel.title && "ring-2 ring-indigo-500 ring-offset-4 ring-offset-[#020617] opacity-90"
                        )}
                        onClick={() => !isLoading && onSelectRole(panel.email, panel.title)}
                    >
                        {/* Background Effects */}
                        <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-br", panel.color)} />
                        <div className={cn("absolute -right-16 -top-16 w-64 h-64 blur-[100px] opacity-20 transition-all duration-700 group-hover:opacity-60", panel.color)} />
                        
                        <CardHeader className="relative z-10 pt-10 pb-6 px-10">
                            <div className={cn(
                                "w-16 h-16 rounded-[2rem] flex items-center justify-center mb-8 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 bg-gradient-to-br shadow-2xl",
                                panel.color
                            )}>
                                <panel.icon className="w-9 h-9 text-white drop-shadow-md" />
                            </div>
                            <CardTitle className="text-3xl font-black text-white group-hover:tracking-wider transition-all duration-500 uppercase">
                                {panel.title}
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="relative z-10 px-10 pb-12">
                            <CardDescription className="text-slate-400 text-base leading-relaxed mb-10 min-h-[4rem] group-hover:text-slate-300 transition-colors">
                                {panel.description}
                            </CardDescription>
                            
                            <Button 
                                className={cn(
                                    "w-full h-14 rounded-2xl font-black text-sm uppercase tracking-[0.1em] shadow-xl transition-all duration-500",
                                    "bg-white text-slate-900 hover:bg-indigo-500 hover:text-white"
                                )}
                                disabled={!!isLoading}
                            >
                                {isLoading === panel.title ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Acceder Ahora
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                                    </div>
                                )}
                            </Button>
                        </CardContent>

                        {/* Interactive Border */}
                        <div className={cn(
                            "absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r transition-all duration-700",
                            panel.color,
                            isLoading === panel.title ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )} />
                    </Card>
                ))}
            </div>

            <div className="mt-20 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900/60 border border-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-widest backdrop-blur-xl">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Plataforma E-Learning de Última Generación
                </div>
            </div>
        </div>
    )
}
