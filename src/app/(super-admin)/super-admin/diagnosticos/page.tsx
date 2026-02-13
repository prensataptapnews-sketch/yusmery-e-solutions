"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
    Search, Plus, MoreHorizontal, Copy, Eye, Trash, BarChart2, Filter, MoreVertical
} from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { PreviewDiagnosticModal } from "@/components/super-admin/diagnostics/preview-modal"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Mock Data (simulating DB)
const INITIAL_DIAGNOSTICS = [
    {
        id: "d1", title: "Evaluación de Liderazgo 2024", category: "Liderazgo", published: true,
        questions: [{ text: "Pregunta 1", options: [{ text: "Opción A" }, { text: "Opción B" }] }],
        stats: { participants: 124, avgScore: 85 }
    },
    {
        id: "d2", title: "Seguridad Industrial Básica", category: "Seguridad", published: true,
        questions: [{ text: "Pregunta 1", options: [] }],
        stats: { participants: 450, avgScore: 92 }
    },
    {
        id: "d3", title: "Clima Laboral Q1", category: "RRHH", published: false,
        questions: [],
        stats: { participants: 0, avgScore: 0 }
    },
    {
        id: "d4", title: "Competencias Digitales", category: "Tecnología", published: false,
        questions: [{ text: "P1", options: [] }],
        stats: { participants: 0, avgScore: 0 }
    },
]

export default function DiagnosticsPage() {
    const [diagnostics, setDiagnostics] = useState(INITIAL_DIAGNOSTICS)
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("ALL")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Preview State
    const [previewOpen, setPreviewOpen] = useState(false)
    const [selectedDiagnostic, setSelectedDiagnostic] = useState<any>(null)

    // Filter Logic
    const filtered = diagnostics.filter(d => {
        const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "ALL" || d.category === categoryFilter
        const matchesStatus = statusFilter === "ALL" ||
            (statusFilter === "PUBLISHED" && d.published) ||
            (statusFilter === "DRAFT" && !d.published)
        return matchesSearch && matchesCategory && matchesStatus
    })

    // Actions
    const handleToggleStatus = (id: string, current: boolean) => {
        setDiagnostics(prev => prev.map(d => d.id === id ? { ...d, published: !current } : d))
        toast.success(current ? "Diagnóstico ocultado (Borrador)" : "Diagnóstico publicado exitosamente")
    }

    const handleDuplicate = (diag: any) => {
        const newDiag = {
            ...diag,
            id: `d${Date.now()}`,
            title: `${diag.title} (Copia)`,
            published: false,
            stats: { participants: 0, avgScore: 0 }
        }
        setDiagnostics([newDiag, ...diagnostics])
        toast.success("Diagnóstico duplicado correctamente")
    }

    const handleDelete = (id: string) => {
        setDiagnostics(prev => prev.filter(d => d.id !== id))
        toast.success("Diagnóstico eliminado")
    }

    const handleBulkDelete = () => {
        setDiagnostics(prev => prev.filter(d => !selectedIds.includes(d.id)))
        setSelectedIds([])
        toast.success(`${selectedIds.length} diagnósticos eliminados`)
    }

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const handlePreview = (diag: any) => {
        setSelectedDiagnostic(diag)
        setPreviewOpen(true)
    }

    return (
        <div className="space-y-6 p-8">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Diagnósticos</h1>
                    <p className="text-muted-foreground">Administra, clona y analiza las evaluaciones de la plataforma.</p>
                </div>
                <div className="flex gap-2">
                    {selectedIds.length > 0 && (
                        <Button variant="destructive" onClick={handleBulkDelete}>
                            <Trash className="mr-2 h-4 w-4" /> Eliminar ({selectedIds.length})
                        </Button>
                    )}
                    <Link href="/super-admin/diagnosticos/crear">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Diagnóstico
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por título..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todas las Categorías</SelectItem>
                                    <SelectItem value="Liderazgo">Liderazgo</SelectItem>
                                    <SelectItem value="Seguridad">Seguridad</SelectItem>
                                    <SelectItem value="RRHH">RRHH</SelectItem>
                                    <SelectItem value="Tecnología">Tecnología</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todos</SelectItem>
                                    <SelectItem value="PUBLISHED">Publicados</SelectItem>
                                    <SelectItem value="DRAFT">Borradores</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectedIds.length === filtered.length && filtered.length > 0}
                                        onCheckedChange={() => {
                                            if (selectedIds.length === filtered.length) setSelectedIds([])
                                            else setSelectedIds(filtered.map(d => d.id))
                                        }}
                                    />
                                </TableHead>
                                <TableHead>Título</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Preguntas</TableHead>
                                <TableHead>Participantes</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                        No se encontraron diagnósticos.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((d) => (
                                    <TableRow key={d.id} className="group">
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.includes(d.id)}
                                                onCheckedChange={() => toggleSelection(d.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {d.title}
                                            {/* Quick Preview Icon appearing on hover */}
                                            <button
                                                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-600"
                                                onClick={() => handlePreview(d)}
                                                title="Previsualizar rápida"
                                            >
                                                <Eye className="h-3 w-3" />
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal">{d.category}</Badge>
                                        </TableCell>
                                        <TableCell>{d.questions.length}</TableCell>
                                        <TableCell>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <span className="cursor-help border-b border-dotted border-slate-400">{d.stats?.participants || 0}</span>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-60">
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-semibold flex items-center gap-2">
                                                            <BarChart2 className="h-4 w-4 text-blue-500" /> Rendimiento
                                                        </h4>
                                                        <div className="text-xs text-muted-foreground space-y-1">
                                                            <p>Total Participantes: <span className="text-slate-900 font-medium">{d.stats?.participants}</span></p>
                                                            <p>Promedio General: <span className="text-slate-900 font-medium">{d.stats?.avgScore || 0}/100</span></p>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={d.published}
                                                    onCheckedChange={() => handleToggleStatus(d.id, d.published)}
                                                />
                                                <span className={`text-xs ${d.published ? "text-green-600 font-medium" : "text-slate-500"}`}>
                                                    {d.published ? 'Publicado' : 'Borrador'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Menú</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handlePreview(d)}>
                                                        <Eye className="mr-2 h-4 w-4" /> Previsualizar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDuplicate(d)}>
                                                        <Copy className="mr-2 h-4 w-4" /> Duplicar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(d.id)}
                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    >
                                                        <Trash className="mr-2 h-4 w-4" /> Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <PreviewDiagnosticModal
                diagnostic={selectedDiagnostic}
                open={previewOpen}
                onOpenChange={setPreviewOpen}
            />
        </div>
    )
}
