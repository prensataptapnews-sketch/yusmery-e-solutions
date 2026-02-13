"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50/50">

            {/* Background Decor */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

            <div className="container mx-auto px-4 relative">

                {/* Floating Stat Left (Hidden on mobile) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="hidden lg:flex absolute left-0 top-1/4 items-center gap-3 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-[200px]"
                >
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">300+</p>
                        <p className="text-xs text-slate-500 font-medium leading-tight">Programas especializados</p>
                    </div>
                </motion.div>

                {/* Floating Stat Right (Hidden on mobile) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="hidden lg:flex absolute right-0 top-1/3 items-center gap-3 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-[200px]"
                >
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">50k+</p>
                        <p className="text-xs text-slate-500 font-medium leading-tight">Colaboradores capacitados</p>
                    </div>
                </motion.div>

                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">

                    {/* Social Proof Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-8 shadow-sm"
                    >
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">
                                    Logo
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-slate-600">500+ empresas confían en nosotros</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]"
                    >
                        Desarrolla talento. <br />
                        <span className="text-slate-500">Impulsa resultados.</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed"
                    >
                        E-SOLUTIONS ofrece programas de capacitación empresarial y soluciones digitales integrales que transforman tu capital humano y elevan el desempeño organizacional.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <Button asChild size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all">
                            <Link href="#soluciones">
                                Conoce nuestras soluciones
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base gap-2 hover:bg-white hover:text-slate-900 border-slate-300">
                            <Play className="h-4 w-4 fill-current" />
                            Ver Video Demo
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
