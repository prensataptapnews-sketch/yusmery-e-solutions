"use client"

import { useState } from "react"
import Link from "next/link"
import { Tags, X, Save, AlertCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReturnToEvaluations } from "@/components/dashboard/evaluaciones/return-to-evaluations"

const availableSkills = [
    "React", "Node.js", "Python", "Gestión de Proyectos", "SQL", 
    "Oratoria", "Diseño UX/UI", "Negociación B2B", "Liderazgo de Equipos", "Docker", 
    "AWS Cloud", "Marketing Digital", "Ciberseguridad", "Data Analytics", "Scrum / Agile", 
    "Resolución de Conflictos", "Ventas Consultivas", "Inteligencia Emocional", "Copywriting", "Figma"
]

const MAX_SKILLS = 5

export default function MyProfileCreatorPage() {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
    const [showWarning, setShowWarning] = useState(false)

    const toggleSkill = (skill: string) => {
        if (showWarning) setShowWarning(false)

        if (selectedSkills.includes(skill)) {
            // Quitar si ya está seleccionada
            setSelectedSkills(prev => prev.filter(s => s !== skill))
        } else {
            // Agregar si hay espacio
            if (selectedSkills.length < MAX_SKILLS) {
                setSelectedSkills(prev => [...prev, skill])
            } else {
                // Alerta visual de límite alcanzado
                setShowWarning(true)
                setTimeout(() => setShowWarning(false), 3000)
            }
        }
    }

    const removeSkill = (skill: string) => {
        setSelectedSkills(prev => prev.filter(s => s !== skill))
        if (showWarning) setShowWarning(false)
    }

    const handleSaveProfile = () => {
        console.log("=== PERFIL DE PUESTO GUARDADO ===")
        console.log(JSON.stringify({
            skills: selectedSkills,
            timestamp: new Date().toISOString()
        }, null, 2))
        
        alert("Las habilidades han sido guardadas. (Ver F12 para JSON)")
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col pb-32">
            
            <ReturnToEvaluations />

            {/* Cabecera Clásica */}
            <div className="mb-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-8">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                        <Tags className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
                            Creador de Perfil
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-xl">
                            Estructura tu ADN laboral seleccionando tus competencias core.
                        </p>
                    </div>
                </div>
            </div>

            {/* Fila Dividida Principal */}
            <div className="flex flex-col gap-10">
                
                {/* Zona Superior: Selector Fijo (Las 5 Elegidas) */}
                <div className="relative">
                    {/* Decoración de fondo */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20 dark:opacity-40"></div>
                    
                    <div className="relative bg-blue-50/80 dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-blue-900 dark:text-blue-400 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" /> Tus {MAX_SKILLS} Habilidades Clave
                            </h2>
                            <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${selectedSkills.length === MAX_SKILLS ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'}`}>
                                {selectedSkills.length} / {MAX_SKILLS}
                            </span>
                        </div>

                        {/* Contenedor de Badges Activos */}
                        <div className="min-h-[80px] flex flex-wrap gap-3 items-center">
                            {selectedSkills.length === 0 ? (
                                <p className="text-slate-400 dark:text-slate-500 font-medium w-full text-center italic py-2">
                                    Aún no has seleccionado ninguna habilidad. Haz clic en el listado inferior.
                                </p>
                            ) : (
                                selectedSkills.map((skill) => (
                                    <div 
                                        key={`sel-${skill}`}
                                        className="bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-full px-5 py-2 flex items-center gap-3 shadow-md animate-in zoom-in-50 duration-200"
                                    >
                                        <span>{skill}</span>
                                        <button 
                                            onClick={() => removeSkill(skill)}
                                            className="w-5 h-5 rounded-full bg-blue-800/20 hover:bg-blue-800/40 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Toast de Warning Limit */}
                <div className={`flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 p-4 rounded-2xl transition-all duration-300 font-bold ${showWarning ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none hidden'}`}>
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    Has alcanzado el límite de {MAX_SKILLS} habilidades. Elimina una de arriba para cambiarla.
                </div>

                {/* Zona Inferior: Nube de Etiquetas Disponibles */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                        Explorar Habilidades Disponibles
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        {availableSkills.map((skill) => {
                            const isSelected = selectedSkills.includes(skill)
                            
                            return (
                                <button
                                    key={`avail-${skill}`}
                                    onClick={() => toggleSkill(skill)}
                                    // Deshabilitar lógica visual si ya está seleccionada o si alcanzamos límite y NO está seleccionada
                                    disabled={isSelected}
                                    className={`
                                        px-5 py-2.5 rounded-full font-bold text-sm border transition-all duration-300
                                        ${isSelected 
                                            ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-50 cursor-not-allowed shadow-inner' 
                                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 hover:-translate-y-0.5 shadow-sm hover:shadow active:scale-95 cursor-pointer'
                                        }
                                    `}
                                >
                                    {skill}
                                </button>
                            )
                        })}
                    </div>
                </div>

            </div>

            {/* Bottom Sticky Action Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 md:p-6 z-50 flex justify-center shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
                <Button 
                    onClick={handleSaveProfile}
                    disabled={selectedSkills.length === 0}
                    className="h-14 w-full max-w-sm rounded-[1rem] font-black text-[17px] bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 transition-all hover:scale-[1.02]"
                >
                    <Save className="w-5 h-5 mr-3" />
                    Guardar Perfil de Puesto
                </Button>
            </div>
            
        </div>
    )
}
