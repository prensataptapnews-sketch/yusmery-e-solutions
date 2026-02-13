
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Check,
    ChevronsUpDown,
    Search,
    Filter,
    ArrowRight,
    ArrowLeft,
    Save
} from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Mock Data
const COURSES = [
    { value: "course-1", label: "Liderazgo Efectivo 2024", modules: ["Módulo 1: Fundamentos", "Módulo 2: Comunicación", "Módulo 3: Equipos"] },
    { value: "course-2", label: "Seguridad Industrial Básica", modules: ["Intro a la Seguridad", "EPP", "Normativa Legal"] },
    { value: "course-3", label: "Excel Avanzado para Finanzas", modules: ["Tablas Dinámicas", "Macros", "Power Query", "Dashboards"] },
]

const USERS = [
    { id: "u1", name: "Ana García", email: "ana@empresa1.com", company: "Tech Solutions", area: "Operaciones" },
    { id: "u2", name: "Carlos Ruiz", email: "carlos@empresa1.com", company: "Tech Solutions", area: "Ventas" },
    { id: "u3", name: "Maria López", email: "maria@empresa2.com", company: "Logística Global", area: "RRHH" },
    { id: "u4", name: "Juan Perez", email: "juan@empresa2.com", company: "Logística Global", area: "Operaciones" },
    { id: "u5", name: "Sofia Diaz", email: "sofia@empresa3.com", company: "Retail S.A.", area: "Marketing" },
]

export default function BulkEnrollPage() {
    const [step, setStep] = useState(1)
    const [selectedCourse, setSelectedCourse] = useState<string>("")
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [selectedModules, setSelectedModules] = useState<string[]>([])
    const [openCombobox, setOpenCombobox] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const courseData = COURSES.find(c => c.value === selectedCourse)

    const handleUserToggle = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        )
    }

    const handleSelectAllUsers = () => {
        if (selectedUsers.length === USERS.length) {
            setSelectedUsers([])
        } else {
            setSelectedUsers(USERS.map(u => u.id))
        }
    }

    const handleModuleToggle = (moduleName: string) => {
        setSelectedModules(prev =>
            prev.includes(moduleName) ? prev.filter(m => m !== moduleName) : [...prev, moduleName]
        )
    }

    const handleSubmit = async () => {
        const payload = {
            courseId: selectedCourse,
            userIds: selectedUsers,
            modules: selectedModules
        }

        console.log("Submitting:", payload)

        try {
            const res = await fetch('/api/super-admin/enroll-bulk', {
                method: 'POST',
                body: JSON.stringify(payload)
            })
            if (res.ok) {
                alert("Matriculación exitosa")
                // Reset
                setStep(1)
                setSelectedCourse("")
                setSelectedUsers([])
                setSelectedModules([])
            } else {
                alert("Error al matricular")
            }
        } catch (e) {
            alert("Error de conexión")
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Matriculación Masiva</h1>
                <p className="text-slate-500">Gestiona inscripciones de cursos para múltiples empresas y usuarios.</p>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-center space-x-4">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold border-2",
                            step === s ? "bg-blue-600 border-blue-600 text-white" :
                                step > s ? "bg-green-500 border-green-500 text-white" : "border-slate-300 text-slate-400"
                        )}>
                            {step > s ? <Check className="h-5 w-5" /> : s}
                        </div>
                        {s < 3 && <div className={cn("w-16 h-1 bg-slate-200 mx-2", step > s && "bg-green-500")} />}
                    </div>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Paso 1: Seleccionar Curso"}
                        {step === 2 && "Paso 2: Seleccionar Usuarios"}
                        {step === 3 && "Paso 3: Habilitar Módulos"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Busca y selecciona el curso al que deseas inscribir usuarios."}
                        {step === 2 && "Elige los usuarios que serán matriculados en este curso."}
                        {step === 3 && "Define qué módulos estarán accesibles inicialmente para estos usuarios."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div className="flex flex-col space-y-4">
                            <label className="text-sm font-medium">Curso</label>
                            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" aria-expanded={openCombobox} className="w-full justify-between">
                                        {selectedCourse ? COURSES.find((c) => c.value === selectedCourse)?.label : "Seleccionar curso..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Buscar curso..." />
                                        <CommandList>
                                            <CommandEmpty>No se encontró el curso.</CommandEmpty>
                                            <CommandGroup>
                                                {COURSES.map((course) => (
                                                    <CommandItem key={course.value} value={course.value} onSelect={(currentValue) => {
                                                        setSelectedCourse(currentValue === selectedCourse ? "" : currentValue)
                                                        setOpenCombobox(false)
                                                    }}>
                                                        <Check className={cn("mr-2 h-4 w-4", selectedCourse === course.value ? "opacity-100" : "opacity-0")} />
                                                        {course.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Filtrar por nombre o empresa..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filtros</Button>
                            </div>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                <Checkbox checked={selectedUsers.length === USERS.length && USERS.length > 0} onCheckedChange={handleSelectAllUsers} />
                                            </TableHead>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Empresa</TableHead>
                                            <TableHead>Área</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {USERS.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.company.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedUsers.includes(user.id)}
                                                        onCheckedChange={() => handleUserToggle(user.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </TableCell>
                                                <TableCell>{user.company}</TableCell>
                                                <TableCell>{user.area}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <p className="text-sm text-muted-foreground">{selectedUsers.length} usuario(s) seleccionado(s)</p>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-lg border">
                                <h3 className="font-semibold text-slate-800 mb-2">{courseData?.label}</h3>
                                <p className="text-sm text-slate-500">Selecciona los módulos que estarán desbloqueados por defecto para los {selectedUsers.length} usuarios seleccionados.</p>
                            </div>
                            <div className="grid gap-4">
                                {courseData?.modules.map((mod, idx) => (
                                    <div key={idx} className="flex items-center space-x-4 p-3 border rounded-md hover:bg-slate-50">
                                        <Checkbox
                                            id={`mod-${idx}`}
                                            checked={selectedModules.includes(mod)}
                                            onCheckedChange={() => handleModuleToggle(mod)}
                                        />
                                        <label htmlFor={`mod-${idx}`} className="text-sm font-medium cursor-pointer flex-1">
                                            {mod}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
                </Button>

                {step < 3 ? (
                    <Button onClick={() => setStep(s => Math.min(3, s + 1))} disabled={step === 1 && !selectedCourse}>
                        Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
                        <Save className="mr-2 h-4 w-4" /> Matricular {selectedUsers.length} Usuarios
                    </Button>
                )}
            </div>
        </div>
    )
}
