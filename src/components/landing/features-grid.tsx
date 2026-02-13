"use client"

import { Play, Star, TrendingUp } from "lucide-react"
import Image from "next/image"

export function FeaturesGrid() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Card 1: Statistic - Satisfaction */}
                    <div className="group relative h-[400px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                        <Image
                            src="/assets/landing/feature-satisfaction.png"
                            alt="Equipo satisfecha"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex text-amber-400">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                                </div>
                                <span className="text-white/80 text-sm">(560 Reviews)</span>
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-1">95%</h3>
                            <p className="text-white/90 text-lg font-medium">Satisfacción Empresarial</p>
                        </div>
                    </div>

                    {/* Card 2: Video/Testimonial - CEO */}
                    <div className="group relative h-[400px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                        <Image
                            src="/assets/landing/feature-ceo.png"
                            alt="CEO Testimonial"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>

                        {/* Play Button */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                            <button className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/30">
                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center pl-1 shadow-lg">
                                    <Play className="h-4 w-4 text-slate-900 fill-current" />
                                </div>
                            </button>
                        </div>

                        <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                            <h3 className="text-xl font-bold text-white mb-1">Mark Jhongson</h3>
                            <p className="text-white/70 text-sm">CEO at E-Solutions</p>
                        </div>
                    </div>

                    {/* Card 3: Impact - Network */}
                    <div className="group relative h-[400px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                        <Image
                            src="/assets/landing/feature-impact.png"
                            alt="Escalabilidad"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                            <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 text-white border border-white/10">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">200+</h3>
                            <p className="text-white/90 text-lg font-medium">Programas Personalizados</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
