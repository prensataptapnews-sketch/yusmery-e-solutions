"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

interface EvaluationsFilterProps {
    courses: { id: string; title: string }[]
}

export function EvaluationsFilter({ courses }: EvaluationsFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value === "all") {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="w-full sm:w-[200px]">
                <Select
                    defaultValue={searchParams.get("courseId") || "all"}
                    onValueChange={(val) => handleFilterChange("courseId", val)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filtrar por Curso" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los cursos</SelectItem>
                        {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                                {course.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full sm:w-[200px]">
                <Select
                    defaultValue={searchParams.get("type") || "all"}
                    onValueChange={(val) => handleFilterChange("type", val)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Tipo de Evaluación" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="QUIZ">Quiz / Práctica</SelectItem>
                        <SelectItem value="FINAL_EXAM">Examen Final</SelectItem>
                        <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full sm:w-[200px]">
                <Select
                    defaultValue={searchParams.get("status") || "all"}
                    onValueChange={(val) => handleFilterChange("status", val)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="pending">Pendiente revisión</SelectItem>
                        <SelectItem value="reviewed">Revisado</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
