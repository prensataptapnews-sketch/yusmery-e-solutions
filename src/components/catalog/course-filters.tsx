"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface FilterGroupProps {
    title: string
    options: string[]
    selected: string[]
    onChange: (value: string, checked: boolean) => void
}

function FilterGroup({ title, options, selected, onChange }: FilterGroupProps) {
    return (
        <div className="mb-6">
            <h4 className="mb-3 text-sm font-medium leading-none">{title}</h4>
            <div className="space-y-2">
                {options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                            id={`${title}-${option}`}
                            checked={selected.includes(option)}
                            onCheckedChange={(checked) => onChange(option, !!checked)}
                        />
                        <Label
                            htmlFor={`${title}-${option}`}
                            className="text-sm font-normal text-muted-foreground cursor-pointer"
                        >
                            {option}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    )
}

interface CourseFiltersProps {
    filters: {
        area: string[]
        modality: string[]
    }
    onFilterChange: (type: 'area' | 'modality', value: string, checked: boolean) => void
    onClear: () => void
}

export function CourseFilters({ filters, onFilterChange, onClear }: CourseFiltersProps) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filtros</h3>
                <Button variant="ghost" size="sm" onClick={onClear} className="text-xs h-8">
                    Limpiar
                </Button>
            </div>

            <FilterGroup
                title="Área"
                options={["RRHH", "Tecnología", "Operaciones", "Ventas", "Liderazgo"]}
                selected={filters.area}
                onChange={(val, checked) => onFilterChange('area', val, checked)}
            />

            <FilterGroup
                title="Modalidad"
                options={["Online", "Presencial", "Híbrido"]}
                selected={filters.modality}
                onChange={(val, checked) => onFilterChange('modality', val, checked)}
            />
        </div>
    )
}
