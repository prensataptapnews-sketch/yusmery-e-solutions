"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { useEffect, useState } from 'react'

export interface StackedChartData {
    name: string;
    ahead: number;
    onTrack: number;
    behind: number;
}

export function TeacherProgressChart({ data }: { data: StackedChartData[] }) {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        // Read initial state
        const root = document.documentElement;
        setIsDark(root.classList.contains('dark'))

        // Observer to immediately switch Recharts SVG Colors based on HTML root class
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDark(document.documentElement.classList.contains('dark'))
                }
            })
        })
        observer.observe(root, { attributes: true })
        return () => observer.disconnect()
    }, [])
    
    // Exact hex codes for maximum contrast.
    const axisColor = isDark ? '#e2e8f0' : '#475569' 
    const gridColor = isDark ? '#334155' : '#cbd5e1'

    return (
        <div className="h-[380px] w-full">
            {data.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-3">
                    <p className="font-bold">No hay alumnos inscritos suficientes para graficar</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }} barSize={32}>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={gridColor} strokeOpacity={0.6} />
                        
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: axisColor, fontSize: 13, fontWeight: 700}} 
                            dy={12} 
                        />
                        
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: axisColor, fontSize: 12, fontWeight: 700}} 
                            dx={-10}
                        />
                        
                        <Tooltip 
                            cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                            contentStyle={{ 
                                borderRadius: '16px', 
                                border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', 
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
                                background: isDark ? '#020617' : '#ffffff', 
                                color: isDark ? '#f8fafc' : '#0f172a',
                                padding: '16px'
                            }}
                            itemStyle={{ fontWeight: 700, fontSize: '14px', paddingTop: '4px' }}
                            labelStyle={{ fontWeight: 800, marginBottom: '8px', fontSize: '14px', textTransform: 'capitalize' }}
                        />
                        
                        <Legend 
                            wrapperStyle={{ paddingTop: "24px", fontSize: "14px", fontWeight: 700, color: axisColor }} 
                            iconType="circle"
                        />
                        
                        <Bar dataKey="behind" name="En Riesgo" stackId="a" fill="#f43f5e" radius={[0, 0, 6, 6]} />
                        <Bar dataKey="onTrack" name="A Tiempo" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="ahead" name="Avanzados" stackId="a" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}
