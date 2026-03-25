"use client"

import { useState } from "react"
import { Brain, CheckCircle2, AlertTriangle, XCircle, RotateCcw, ChevronRight, Sparkles, Trophy, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── Types ─────────────────────────────────────────────────────────────────

type StyleType = "empatico" | "directivo" | "evasivo"

interface Option {
    label: string
    text: string
    style: StyleType
    feedback: string
    icon: React.ElementType
    points: number
}

interface Scenario {
    id: number
    situation: string
    context: string
    options: [Option, Option, Option]
}

// ─── Data ──────────────────────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
    {
        id: 1,
        situation: "El informe mensual",
        context: "Tu colaborador no entregó el informe mensual a tiempo y está a la defensiva. ¿Cómo abordas la reunión?",
        options: [
            {
                label: "Opción A",
                text: "Exigir el reporte inmediatamente",
                style: "directivo",
                feedback: "Resultado DIRECTIVO: Obtienes el reporte, pero dañas la confianza. Tu colaborador trabajará por presión, no por motivación. A largo plazo esto genera rotación.",
                icon: AlertTriangle,
                points: 30,
            },
            {
                label: "Opción B",
                text: "Preguntar si tuvo algún problema personal o bloqueo",
                style: "empatico",
                feedback: "¡Excelente elección! Has demostrado EMPATÍA. Al entender el contexto, construyes una relación de confianza que mejora el rendimiento sostenido del equipo.",
                icon: CheckCircle2,
                points: 100,
            },
            {
                label: "Opción C",
                text: "Asignar la tarea a otra persona sin hablar con él",
                style: "evasivo",
                feedback: "Resultado EVASIVO: Evitas el conflicto hoy, pero el problema persiste. Tu colaborador no recibirá el feedback que necesita para crecer y el equipo perderá confianza en el liderazgo.",
                icon: XCircle,
                points: 10,
            },
        ],
    },
    {
        id: 2,
        situation: "El conflicto entre compañeros",
        context: "Dos miembros de tu equipo tienen un desacuerdo que está afectando el ambiente. Ambos vienen a ti por separado a quejarse del otro. ¿Qué haces?",
        options: [
            {
                label: "Opción A",
                text: "Reunirlos a los dos y facilitar una conversación mediada",
                style: "empatico",
                feedback: "¡Excelente! Estilo MEDIADOR. Crear un espacio seguro de diálogo es la forma más sostenible de resolver conflictos. Aumentas la cohesión y el respeto mutuo del equipo.",
                icon: CheckCircle2,
                points: 100,
            },
            {
                label: "Opción B",
                text: "Avisar que quien no se lleve bien con el otro será reubicado",
                style: "directivo",
                feedback: "Resultado DIRECTIVO: La amenaza puede detener el conflicto superficialmente, pero no resuelve la causa raíz. El resentimiento podría escalar en otros contextos.",
                icon: AlertTriangle,
                points: 25,
            },
            {
                label: "Opción C",
                text: "Ignorarlo y esperar que se resuelva solo con el tiempo",
                style: "evasivo",
                feedback: "Resultado EVASIVO: Los conflictos no resueltos escalan. Con el tiempo esto puede generar un ambiente tóxico y perder a talentos valiosos por un problema que se pudo resolver.",
                icon: XCircle,
                points: 5,
            },
        ],
    },
    {
        id: 3,
        situation: "El error de alto impacto",
        context: "Un miembro clave de tu equipo cometió un error que retrasa el proyecto 2 semanas y el cliente ya lo sabe. ¿Cómo respondes?",
        options: [
            {
                label: "Opción A",
                text: "Asumir la responsabilidad ante el cliente y trabajar un plan de recuperación con el equipo",
                style: "empatico",
                feedback: "¡Liderazgo ejemplar! Asumir la responsabilidad como equipo genera confianza en el cliente y demuestra madurez organizacional. El error se convierte en oportunidad de aprendizaje.",
                icon: CheckCircle2,
                points: 100,
            },
            {
                label: "Opción B",
                text: "Señalar públicamente quién cometió el error para que quede claro",
                style: "directivo",
                feedback: "Resultado DIRECTIVO: Señalar al culpable destruye la cultura psicológica de seguridad. Tu equipo dejará de tomar iniciativas por miedo a equivocarse. El cliente tampoco lo valora.",
                icon: AlertTriangle,
                points: 10,
            },
            {
                label: "Opción C",
                text: "Culpar a los plazos del proyecto o factores externos",
                style: "evasivo",
                feedback: "Resultado EVASIVO: Las excusas erosionan la credibilidad ante el cliente. El equipo también pierde respeto por un líder que no asume consecuencias ni busca soluciones.",
                icon: XCircle,
                points: 0,
            },
        ],
    },
]

// ─── Style Config ─────────────────────────────────────────────────────────

const STYLE_CONFIG: Record<StyleType, { bg: string; border: string; text: string; badge: string; badgeBg: string }> = {
    empatico: {
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
        border: "border-emerald-200 dark:border-emerald-500/30",
        text: "text-emerald-700 dark:text-emerald-300",
        badge: "Estilo Empático",
        badgeBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    },
    directivo: {
        bg: "bg-amber-50 dark:bg-amber-500/10",
        border: "border-amber-200 dark:border-amber-500/30",
        text: "text-amber-700 dark:text-amber-300",
        badge: "Estilo Directivo",
        badgeBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    },
    evasivo: {
        bg: "bg-rose-50 dark:bg-rose-500/10",
        border: "border-rose-200 dark:border-rose-500/30",
        text: "text-rose-700 dark:text-rose-300",
        badge: "Estilo Evasivo",
        badgeBg: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
    },
}

// ─── Component ─────────────────────────────────────────────────────────────

export function CouMentSimulator() {
    const [scenarioIndex, setScenarioIndex] = useState(0)
    const [selected, setSelected] = useState<number | null>(null)
    const [totalPoints, setTotalPoints] = useState(0)
    const [completed, setCompleted] = useState<number[]>([])
    const [showSummary, setShowSummary] = useState(false)

    const scenario = SCENARIOS[scenarioIndex]
    const isAnswered = selected !== null
    const allDone = completed.length === SCENARIOS.length

    function handleSelect(index: number) {
        if (isAnswered) return
        const points = scenario.options[index].points
        setSelected(index)
        setTotalPoints((prev) => prev + points)
        setCompleted((prev) => [...prev, scenario.id])
    }

    function handleNext() {
        if (scenarioIndex < SCENARIOS.length - 1) {
            setScenarioIndex((i) => i + 1)
            setSelected(null)
        } else {
            setShowSummary(true)
        }
    }

    function handleRestart() {
        setScenarioIndex(0)
        setSelected(null)
        setTotalPoints(0)
        setCompleted([])
        setShowSummary(false)
    }

    const maxPoints = SCENARIOS.length * 100
    const percentage = Math.round((totalPoints / maxPoints) * 100)

    const leaderProfile =
        percentage >= 80
            ? { label: "Líder Empático de Alto Impacto", color: "text-emerald-500", icon: Trophy }
            : percentage >= 50
            ? { label: "Líder en Desarrollo", color: "text-amber-500", icon: Target }
            : { label: "Líder Reactivo", color: "text-rose-500", icon: Brain }

    // ── Summary Screen ──────────────────────────────────────────────────────
    if (showSummary) {
        const ProfileIcon = leaderProfile.icon
        return (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-2xl mx-auto animate-in fade-in duration-500">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/30">
                    <ProfileIcon className="w-12 h-12 text-white" />
                </div>
                <div className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-3">Simulación Completada</div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Tu Perfil de Liderazgo</h2>
                <p className={cn("text-2xl font-bold mb-8", leaderProfile.color)}>{leaderProfile.label}</p>

                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-4 mb-3 overflow-hidden">
                    <div
                        className="h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold mb-2">
                    {totalPoints} / {maxPoints} puntos — {percentage}% de decisiones óptimas
                </p>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-4 mb-10 max-w-lg">
                    {percentage >= 80
                        ? "Tus respuestas demuestran una mentalidad centrada en las personas y el crecimiento colectivo. Sigue cultivando esta inteligencia emocional aplicada al liderazgo."
                        : percentage >= 50
                        ? "Tienes bases sólidas de liderazgo. Trabaja en tu capacidad de escucha activa y manejo emocional para dar el siguiente salto."
                        : "Hay una gran oportunidad de desarrollo. El liderazgo efectivo se construye con práctica y reflexión. ¡Este simulador es tu punto de partida!"}
                </p>

                <Button
                    onClick={handleRestart}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl px-8 py-6 text-base shadow-xl shadow-indigo-500/20"
                >
                    <RotateCcw className="w-5 h-5" />
                    Repetir Simulación
                </Button>
            </div>
        )
    }

    // ── Simulation Screen ───────────────────────────────────────────────────
    return (
        <div className="max-w-3xl mx-auto py-4 px-4 space-y-8 animate-in fade-in duration-300">
            {/* Progress */}
            <div className="flex items-center justify-between text-sm font-bold text-slate-500 dark:text-slate-400">
                <span>Caso {scenarioIndex + 1} de {SCENARIOS.length}</span>
                <div className="flex gap-2">
                    {SCENARIOS.map((s, i) => (
                        <div
                            key={s.id}
                            className={cn(
                                "w-8 h-2 rounded-full transition-all duration-500",
                                i < scenarioIndex
                                    ? "bg-indigo-500"
                                    : i === scenarioIndex
                                    ? "bg-indigo-300"
                                    : "bg-slate-200 dark:bg-slate-800"
                            )}
                        />
                    ))}
                </div>
                <span className="text-indigo-500 font-black">{totalPoints} pts</span>
            </div>

            {/* Scenario Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-900/50 rounded-3xl p-8 shadow-2xl shadow-indigo-500/10">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <div className="text-xs font-black uppercase tracking-widest text-indigo-400">Caso Práctico</div>
                        <div className="text-sm font-bold text-white">{scenario.situation}</div>
                    </div>
                </div>
                <p className="text-slate-200 text-lg leading-relaxed font-medium">
                    {scenario.context}
                </p>
            </div>

            {/* Options */}
            <div className="space-y-4">
                {scenario.options.map((option, i) => {
                    const styleConf = STYLE_CONFIG[option.style]
                    const isSelected = selected === i
                    const isNotSelected = selected !== null && selected !== i

                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            disabled={isAnswered}
                            className={cn(
                                "w-full text-left rounded-2xl border-2 p-5 transition-all duration-300 group",
                                isAnswered ? "cursor-default" : "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg",
                                isSelected
                                    ? cn("border-2 shadow-lg", styleConf.border, styleConf.bg)
                                    : isNotSelected
                                    ? "border-slate-200 dark:border-slate-800 opacity-40 bg-white dark:bg-slate-900"
                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700"
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <span className={cn(
                                    "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-colors",
                                    isSelected
                                        ? cn(styleConf.badgeBg, styleConf.border)
                                        : "border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                                )}>
                                    {option.label.split(" ")[1]}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "font-bold text-base mb-1",
                                        isSelected ? styleConf.text : "text-slate-800 dark:text-slate-200"
                                    )}>
                                        {option.text}
                                    </p>
                                    {isSelected && (
                                        <span className={cn("text-xs font-black px-2 py-0.5 rounded-full", styleConf.badgeBg)}>
                                            {styleConf.badge}
                                        </span>
                                    )}
                                </div>
                                {isSelected && (
                                    <option.icon className={cn("flex-shrink-0 w-6 h-6", styleConf.text)} />
                                )}
                            </div>

                            {/* Feedback */}
                            {isSelected && (
                                <div className={cn("mt-4 pt-4 border-t-2 text-sm leading-relaxed font-medium", styleConf.border, styleConf.text)}>
                                    {option.feedback}
                                    <div className="mt-2 font-black text-xs">
                                        +{option.points} puntos
                                    </div>
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Next Button */}
            {isAnswered && (
                <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Button
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl px-6 py-5 shadow-lg shadow-indigo-500/20"
                    >
                        {scenarioIndex < SCENARIOS.length - 1 ? (
                            <>Siguiente caso <ChevronRight className="w-5 h-5" /></>
                        ) : (
                            <>Ver mi perfil <Sparkles className="w-5 h-5" /></>
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}
