"use client"

import { useState, useRef, useEffect } from "react"
import { RefreshCcw, User, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReturnToEvaluations } from "@/components/dashboard/evaluaciones/return-to-evaluations"

interface Message {
    id: string
    sender: 'employee' | 'manager'
    text: string
}

interface ScenarioNode {
    id: number
    employeePrompt: string
    managerOptions: {
        text: string
        score: number
        nextNodeId: number | null
    }[]
}

const scenarioData: ScenarioNode[] = [
    {
        id: 1,
        employeePrompt: "Sinceramente, no entiendo por qué mi calificación fue 'Regular' este trimestre. Yo entregué todos mis reportes a tiempo.",
        managerOptions: [
            { text: "Entregar a tiempo es tu obligación básica, pero la calidad de los reportes fue deficiente y tuvo muchos errores.", score: -5, nextNodeId: 2 },
            { text: "Tus entregas fueron puntuales y eso es muy valioso. Sin embargo, la evaluación también mide el impacto y análisis de esos reportes. ¿Notaste algún reto ahí?", score: 10, nextNodeId: 2 },
            { text: "Tienes razón en que fuiste puntual. Quizás el sistema de evaluación es muy estricto, pero vamos a intentar mejorarlo el siguiente.", score: -2, nextNodeId: 2 }
        ]
    },
    {
        id: 2,
        employeePrompt: "La verdad es que no recibí suficiente apoyo estratégico de tu parte. Siempre estabas en reuniones cuando necesitaba revisar los datos.",
        managerOptions: [
            { text: "Entiendo que te hayas sentido sin apoyo. Como líder debo asegurar canales de comunicación claros. ¿Qué frecuencia de revisión te ayudaría más?", score: 10, nextNodeId: 3 },
            { text: "Yo tengo muchas responsabilidades en la gerencia, se supone que tú eres lo suficientemente autónomo para resolver esos detalles.", score: -8, nextNodeId: 3 },
            { text: "Trataré de hacer más espacio en mi agenda, pero la próxima vez por favor búscame con más insistencia.", score: 2, nextNodeId: 3 }
        ]
    },
    {
        id: 3,
        employeePrompt: "Está bien... Me gustaría poder liderar el Proyecto X el próximo mes para demostrar lo que puedo hacer. ¿Crees que me lo asignes?",
        managerOptions: [
            { text: "Primero debes corregir tus métricas actuales antes de pedir más responsabilidades.", score: -5, nextNodeId: 4 },
            { text: "Me encanta esa proactividad. Hagamos un trato: si en estas tres semanas logramos nivelar la calidad de los reportes, el Proyecto X es tuyo.", score: 10, nextNodeId: 4 },
            { text: "Sí, claro, yo creo que eso te ayudará a motivarte.", score: -2, nextNodeId: 4 }
        ]
    },
    {
        id: 4,
        employeePrompt: "Me parece justo. Haré el esfuerzo para corregir esos detalles analíticos y ganarme ese proyecto. Gracias por la honestidad.",
        managerOptions: [
            { text: "Perfecto, agendemos una revisión corta cada viernes para asegurar que vas por buen camino. Confío en ti.", score: 10, nextNodeId: null },
            { text: "Más te vale, porque el próximo trimestre no habrá tantas oportunidades.", score: -10, nextNodeId: null },
            { text: "Ok, hablemos a fin de mes a ver qué pasa.", score: 0, nextNodeId: null }
        ]
    }
]

export default function ResultDeliverySimulator() {
    const [currentNodeId, setCurrentNodeId] = useState<number | null>(1)
    const [chatHistory, setChatHistory] = useState<Message[]>([
        { id: `msg-${Date.now()}-1`, sender: 'employee', text: scenarioData[0].employeePrompt }
    ])
    const [totalScore, setTotalScore] = useState(0)
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatHistory, isTyping])

    const currentNode = currentNodeId ? scenarioData.find(n => n.id === currentNodeId) : null

    const handleOptionClick = (option: { text: string; score: number; nextNodeId: number | null }) => {
        if (!currentNode) return

        setChatHistory(prev => [
            ...prev,
            { id: `msg-${Date.now()}-mgr`, sender: 'manager', text: option.text }
        ])

        setTotalScore(prev => prev + option.score)
        setCurrentNodeId(option.nextNodeId)

        if (option.nextNodeId !== null) {
            setIsTyping(true)
            setTimeout(() => {
                const nextNode = scenarioData.find(n => n.id === option.nextNodeId)
                if (nextNode) {
                    setChatHistory(curr => [
                        ...curr,
                        { id: `msg-${Date.now()}-emp`, sender: 'employee', text: nextNode.employeePrompt }
                    ])
                }
                setIsTyping(false)
            }, 1500)
        }
    }

    const resetSimulation = () => {
        setCurrentNodeId(1)
        setTotalScore(0)
        setChatHistory([{ id: `msg-${Date.now()}-reset`, sender: 'employee', text: scenarioData[0].employeePrompt }])
        setIsTyping(false)
    }

    const maxPossibleScore = 40
    const scorePercentage = (totalScore / maxPossibleScore) * 100

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 pb-20">
            <ReturnToEvaluations />

            {/* Chat Card — all sections properly nested inside */}
            <div className="w-full max-w-3xl mx-auto flex flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden rounded-3xl">
                
                {/* ── Chat Header ── */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4 shrink-0 shadow-sm">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center relative shadow-inner">
                        <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full block"></span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                            Simulador: Dar Feedback Crítico
                        </h2>
                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            Colaborador esperando tu respuesta...
                        </p>
                    </div>
                    <div className="ml-auto text-right">
                        <div className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">
                            Score Asertividad
                        </div>
                        <div className={`text-xl font-bold ${totalScore > 0 ? 'text-emerald-600 dark:text-emerald-400' : totalScore < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
                            {totalScore > 0 ? '+' : ''}{totalScore} pts
                        </div>
                    </div>
                </div>

                {/* ── Messages Area ── */}
                <div ref={scrollContainerRef} className="min-h-[280px] max-h-[360px] overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 custom-scrollbar">
                    {chatHistory.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.sender === 'manager' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-[15px] font-medium leading-relaxed shadow-sm ${
                                    msg.sender === 'manager'
                                        ? 'bg-indigo-600 text-white rounded-br-sm'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/50 rounded-bl-sm'
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex w-full justify-start animate-in fade-in duration-300">
                            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 p-4 rounded-2xl rounded-bl-sm flex items-center gap-1 shadow-sm">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-1" />
                </div>

                {/* ── Options Area ── */}
                <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                    {!isTyping && currentNode && currentNodeId !== null ? (
                        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center mb-1">
                                Elige tu respuesta estratégica:
                            </p>
                            {currentNode.managerOptions.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleOptionClick(opt)}
                                    className="w-full text-left p-4 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-2xl text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-[15px] transition-all duration-300 transform hover:scale-[1.01] shadow-sm flex items-center gap-3 active:scale-[0.99]"
                                >
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-sm">
                                        {i + 1}
                                    </div>
                                    <span className="leading-snug">{opt.text}</span>
                                </button>
                            ))}
                        </div>
                    ) : isTyping ? (
                        <div className="h-[120px] flex items-center justify-center flex-col gap-3 text-slate-400">
                            <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
                            <span className="text-sm font-bold animate-pulse">Esperando reacción del colaborador...</span>
                        </div>
                    ) : currentNodeId === null ? (
                        <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center text-center py-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${scorePercentage > 75 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : scorePercentage > 40 ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Simulación Finalizada</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                                Puntaje Final: <strong className="text-slate-900 dark:text-white">{totalScore} de {maxPossibleScore}</strong>
                                <br />
                                {scorePercentage >= 75
                                    ? "¡Excelente manejo emocional! Lograste corregir sin desmotivar."
                                    : scorePercentage >= 40
                                    ? "Buen intento. Sin embargo, algunas respuestas pudieron ser más empáticas y constructivas."
                                    : "Tu estilo fue demasiado confrontativo. Recuerda que el feedback debe construir, no destruir."}
                            </p>
                            <Button onClick={resetSimulation} variant="outline" className="rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border-slate-300 dark:border-slate-700 dark:text-slate-300">
                                <RefreshCcw className="w-4 h-4 mr-2" /> Reiniciar Caso de Estudio
                            </Button>
                        </div>
                    ) : null}
                </div>

            </div>
        </div>
    )
}
