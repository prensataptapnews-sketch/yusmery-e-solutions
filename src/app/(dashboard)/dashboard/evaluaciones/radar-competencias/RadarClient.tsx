"use client"

import { Activity, Download, ArrowDown, ArrowUp, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
    Radar, 
    RadarChart, 
    PolarGrid, 
    PolarAngleAxis, 
    PolarRadiusAxis, 
    ResponsiveContainer,
    Tooltip,
    Legend
} from "recharts"
import { ReturnToEvaluations } from "@/components/dashboard/evaluaciones/return-to-evaluations"

interface RadarClientProps {
    initialData: any[]
}

export function RadarClient({ initialData }: RadarClientProps) {
    
    // Custom Tooltip para el Radar
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-lg">
                    <p className="font-black text-slate-900 dark:text-white mb-2">{payload[0].payload.subject}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm font-medium mb-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <span className="text-slate-600 dark:text-slate-400 capitalize">{entry.name}:</span>
                            <span className="font-bold text-slate-900 dark:text-white ml-auto">{entry.value}/100</span>
                        </div>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col pb-20">
            
            <ReturnToEvaluations />

            {/* Cabecera */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 rounded-2xl flex items-center justify-center shadow-sm">
                            <Activity className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Radar de Competencias
                        </h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl">
                        Compara tu percepción personal frente a la evaluación oficial de tu Equipo para descubrir puntos ciegos.
                    </p>
                </div>
                
                <Button className="h-12 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold shadow-lg transition-transform hover:-translate-y-1">
                    <Download className="w-5 h-5 mr-2" /> Exportar Reporte
                </Button>
            </div>

            {initialData.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-20 text-center">
                    <p className="text-slate-400 font-medium text-xl italic">
                        Aún no tienes evaluaciones registradas para generar el Radar.
                    </p>
                    <p className="text-slate-500 mt-2">
                        Completa tu autoevaluación o espera a que tus pares te evalúen.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Columna Izquierda: Data Visualization */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center min-h-[500px]">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-8 self-start w-full text-center">
                            Mapeo Multidimensional
                        </h2>
                        
                        <div className="w-full h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={initialData}>
                                    <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                    <PolarAngleAxis 
                                        dataKey="subject" 
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
                                    />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    
                                    {/* Realidad (Otros) Radar Azul */}
                                    <Radar 
                                        name="Evaluación Terceros" 
                                        dataKey="A" 
                                        stroke="#3b82f6" 
                                        fill="#3b82f6" 
                                        fillOpacity={0.3} 
                                        strokeWidth={3}
                                    />
                                    {/* Mi Percepción Radar Verde */}
                                    <Radar 
                                        name="Mi Percepción" 
                                        dataKey="B" 
                                        stroke="#10b981" 
                                        fill="#10b981" 
                                        fillOpacity={0.4} 
                                        strokeWidth={3}
                                    />
                                    
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', fontSize: '14px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Columna Derecha: Analysis Table */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
                        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                Análisis Analítico de Brechas
                            </h2>
                            <p className="text-sm font-medium text-slate-500 mt-1">
                                Brecha negativa = Otros perciben menor desempeño que tu autopercepción.
                            </p>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider font-bold">
                                        <th className="p-4 pl-6">Competencia</th>
                                        <th className="p-4 text-center">Mi Nota</th>
                                        <th className="p-4 text-center">Otros</th>
                                        <th className="p-4 pr-6 text-center">Brecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {initialData.map((data, idx) => {
                                        const gap = Math.round(data.A - data.B)
                                        const isNegative = gap < 0
                                        const isPositive = gap > 0
                                        const isNeutral = gap === 0

                                        return (
                                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="p-4 pl-6 font-bold text-slate-800 dark:text-slate-200">
                                                    {data.subject}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="inline-flex w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 items-center justify-center font-bold border border-emerald-100 dark:border-emerald-900/50">
                                                        {Math.round(data.B)}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="inline-flex w-8 h-8 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 items-center justify-center font-bold border border-blue-100 dark:border-blue-900/50">
                                                        {Math.round(data.A)}
                                                    </span>
                                                </td>
                                                <td className="p-4 pr-6">
                                                    <div className={`flex items-center justify-center gap-1 font-black px-3 py-1.5 rounded-lg border ${
                                                        isNegative 
                                                            ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-900/50' 
                                                        : isPositive 
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-900/50'
                                                        : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                                    }`}>
                                                        {isNegative ? <ArrowDown className="w-4 h-4" /> : isPositive ? <ArrowUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                                        {gap > 0 ? `+${gap}` : gap}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
