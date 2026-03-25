"use client"

import { useEffect, useState } from "react"
import { Users, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReturnToEvaluations } from "@/components/dashboard/evaluaciones/return-to-evaluations"

import { update9BoxResult, getTeamMembers } from "@/app/actions/talent-actions"
import { getTeamMatrixData } from "@/app/actions/bi-actions"

interface Employee {
    id: string
    name: string
    role: string
    boxId: string | null
}

interface MatrixBox {
    id: string
    title: string
    x: number
    y: number
    color: string
}

const initialEmployees: Employee[] = [
    { id: 'emp-1', name: 'Laura Gómez', role: 'UX Designer', boxId: null },
    { id: 'emp-2', name: 'Carlos Díaz', role: 'Backend Dev', boxId: null },
    { id: 'emp-3', name: 'Ana Silva', role: 'Project Manager', boxId: null },
    { id: 'emp-4', name: 'Luis Pérez', role: 'Data Analyst', boxId: null },
    { id: 'emp-5', name: 'Sofía Reyes', role: 'Marketing Lead', boxId: null }
]

const matrixBoxes: MatrixBox[] = [
    // Top Row (Alto Potencial)
    { id: 'box-1', title: 'Alto Potencial / Bajo Desempeño', x: 0, y: 2, color: 'bg-amber-100/50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
    { id: 'box-2', title: 'Futuro Líder', x: 1, y: 2, color: 'bg-emerald-100/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
    { id: 'box-3', title: 'Estrella', x: 2, y: 2, color: 'bg-emerald-200/50 dark:bg-emerald-800/20 border-emerald-300 dark:border-emerald-700' },
    
    // Middle Row (Potencial Medio)
    { id: 'box-4', title: 'Enigma', x: 0, y: 1, color: 'bg-rose-100/50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800' },
    { id: 'box-5', title: 'Colaborador Clave', x: 1, y: 1, color: 'bg-blue-100/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
    { id: 'box-6', title: 'Alto Impacto', x: 2, y: 1, color: 'bg-emerald-100/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
    
    // Bottom Row (Bajo Potencial)
    { id: 'box-7', title: 'Riesgo / Desajuste', x: 0, y: 0, color: 'bg-red-200/50 dark:bg-red-900/30 border-red-300 dark:border-red-700' },
    { id: 'box-8', title: 'Eficaz', x: 1, y: 0, color: 'bg-amber-100/50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
    { id: 'box-9', title: 'Profesional de Confianza', x: 2, y: 0, color: 'bg-blue-100/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' }
]

export default function TalentMatrixPage() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        async function loadData() {
            const team = await getTeamMembers()
            const matrixResults = await getTeamMatrixData()
            
            // Transform user data to Employee interface
            const mapped: Employee[] = team.map((u: any) => {
                const existingResult = matrixResults.find(r => r.id === u.id || r.name === u.name)
                let boxId: string | null = null
                
                if (existingResult) {
                    // Find box based on coordinates
                    const box = matrixBoxes.find(b => b.x === existingResult.performance - 1 && b.y === existingResult.potential - 1)
                    if (box) boxId = box.id
                }

                return {
                    id: u.id,
                    name: u.name || "Sin nombre",
                    role: u.role || "Colaborador",
                    boxId
                }
            })
            setEmployees(mapped)
            setIsLoadingData(false)
        }
        loadData()
    }, [])

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, employeeId: string) => {
        e.dataTransfer.setData("employeeId", employeeId)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault() // Necesario para permitir el drop
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, boxId: string | null) => {
        e.preventDefault()
        const employeeId = e.dataTransfer.getData("employeeId")
        
        if (employeeId) {
            setEmployees(prev => 
                prev.map(emp => emp.id === employeeId ? { ...emp, boxId } : emp)
            )
        }
    }

    const saveMatrix = async () => {
        setIsLoading(true)
        try {
            const assignedEmployees = employees.filter(e => e.boxId !== null)
            
            for (const emp of assignedEmployees) {
                const box = matrixBoxes.find(b => b.id === emp.boxId)
                if (box) {
                    // Mapping x/y (0,1,2) to scores (1,2,3)
                    await update9BoxResult({
                        userId: emp.id,
                        period: "2024-Q1", // Hardcoded for now, ideal to have a selector
                        performance: box.x + 1,
                        potential: box.y + 1,
                        comment: `Calibrado como ${box.title}`
                    })
                }
            }
            setIsSuccess(true)
            setTimeout(() => setIsSuccess(false), 3000)
        } catch (error) {
            console.error("Error guardando matriz:", error)
            alert("Error al guardar algunos resultados")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-[1400px] mx-auto py-8 px-4 flex flex-col min-h-screen">
            <ReturnToEvaluations />

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        Matriz de Talento 9-Box
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
                        Sitúa a tu equipo basándote en su desempeño histórico y potencial futuro.
                    </p>
                </div>
                <Button 
                    onClick={saveMatrix}
                    disabled={isLoading}
                    className={`h-12 px-6 rounded-xl font-bold shadow-lg transition-all ${
                        isSuccess 
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-1'
                    }`}
                >
                    {isLoading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                            Guardando...
                        </>
                    ) : isSuccess ? (
                        <>
                            <Save className="w-5 h-5 mr-2" /> ¡Guardado!
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5 mr-2" /> Guardar Matriz
                        </>
                    )}
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-1">
                {/* Izquierda: Sin Asignar */}
                <div 
                    className="w-full lg:w-1/4 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col h-[700px] overflow-y-auto"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, null)}
                >
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Sin Asignar
                    </h3>
                    
                    {isLoadingData ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <p className="text-xs font-bold uppercase tracking-tighter">Cargando Equipo...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                        {employees.filter(e => e.boxId === null).map(emp => (
                            <div
                                key={emp.id}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, emp.id)}
                                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-400 transition-colors group"
                            >
                                <p className="font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {emp.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                                    {emp.role}
                                </p>
                            </div>
                        ))}
                        {employees.filter(e => e.boxId === null).length === 0 && (
                            <div className="text-center py-10 text-slate-400 dark:text-slate-600 text-sm font-bold border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                Todos asignados
                            </div>
                        )}
                        </div>
                    )}
                </div>

                {/* Derecha: Matriz 3x3 */}
                <div className="w-full lg:w-3/4 flex flex-col">
                    <div className="relative w-full h-[700px]">
                        {/* Ejes XY Tags */}
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-black text-slate-400 uppercase tracking-widest hidden sm:block">
                            Potencial
                        </div>
                        <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 text-sm font-black text-slate-400 uppercase tracking-widest">
                            Desempeño
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-3 grid-rows-3 gap-2 h-full w-full">
                            {matrixBoxes.map((box) => (
                                <div
                                    key={box.id}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, box.id)}
                                    className={`relative p-4 rounded-3xl border-2 transition-all duration-300 flex flex-col ${box.color}`}
                                >
                                    <h4 className="absolute bottom-4 right-5 text-lg font-black opacity-30 text-slate-900 dark:text-white pointer-events-none text-right max-w-[80%] leading-tight">
                                        {box.title}
                                    </h4>
                                    
                                    <div className="flex flex-wrap gap-2 z-10 content-start flex-1 overflow-y-auto w-full">
                                        {employees.filter(e => e.boxId === box.id).map(emp => (
                                            <div
                                                key={emp.id}
                                                draggable={true}
                                                onDragStart={(e) => handleDragStart(e, emp.id)}
                                                className="bg-white dark:bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 shadow border-b-2 cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform"
                                            >
                                                <p className="font-bold text-xs text-slate-800 dark:text-slate-100">{emp.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
