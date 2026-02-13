"use client"

import { useState, useEffect } from "react"
import { CourseFilters } from "@/components/catalog/course-filters"
import { CourseGrid } from "@/components/catalog/course-grid"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function CatalogPage() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Filter State
    const [filters, setFilters] = useState<{ area: string[], modality: string[] }>({
        area: [],
        modality: []
    })

    const fetchCourses = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (searchTerm) params.append("search", searchTerm)
            // Backend in this MVP simple version might only take single value or we handle client side filtering mostly for complex arrays mock
            // For now, passing first selection to API if exists, or do robust client filtering for Mock
            if (filters.area.length > 0) params.append("area", filters.area[0])
            if (filters.modality.length > 0) params.append("modality", filters.modality[0])

            const res = await fetch(`/api/catalog?${params}`)
            const data = await res.json()
            setCourses(data.courses)
        } catch (error) {
            console.error("Failed to fetch catalog", error)
        } finally {
            setLoading(false)
        }
    }

    // Debounce/Listen
    useEffect(() => {
        fetchCourses()
    }, [filters])

    const handleFilterChange = (type: 'area' | 'modality', value: string, checked: boolean) => {
        setFilters(prev => {
            const current = prev[type]
            const updated = checked
                ? [...current, value]
                : current.filter(v => v !== value)
            return { ...prev, [type]: updated }
        })
    }

    const handleClearFilters = () => {
        setFilters({ area: [], modality: [] })
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Catálogo de Cursos</h1>
                <p className="text-muted-foreground">Explora nuestra oferta académica y continúa tu desarrollo profesional.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg border shadow-sm sticky top-24">
                        <CourseFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClear={handleClearFilters}
                        />
                    </div>
                </aside>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar cursos..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchCourses()}
                        />
                    </div>

                    {/* Results */}
                    <CourseGrid courses={courses} loading={loading} />
                </div>
            </div>
        </div>
    )
}
