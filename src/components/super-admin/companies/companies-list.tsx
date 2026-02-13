"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Building2,
    Users,
    Plus,
    Pencil,
    Trash2,
    MoreVertical,
    Mail,
    Calendar,
    ShieldCheck,
    Search,
    Filter,
    Download,
    LogIn,
    FileBarChart,
    BookOpen,
    LayoutDashboard
} from "lucide-react"
import { toast } from "sonner"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface CompanyWithStats {
    id: string
    name: string
    slug: string
    plan: string | null
    status: string | null
    adminEmail: string | null
    createdAt: Date
    _count: {
        users: number
        courses: number
    }
}

export function CompaniesList({ initialCompanies }: { initialCompanies: CompanyWithStats[] }) {
    const router = useRouter()
    const [companies, setCompanies] = useState(initialCompanies)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const filteredCompanies = companies.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.adminEmail?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || c.status?.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesStatus
    })

    const handleExport = () => {
        const doc = new jsPDF()
        doc.text("Listado de Empresas - E-Solutions", 14, 20)

        const tableData = filteredCompanies.map(c => [
            c.id, c.name, c.slug, c.plan || "N/A", c.status || "N/A", c._count.users.toString(), c.adminEmail || ""
        ])

        autoTable(doc, {
            head: [["ID", "Nombre", "Slug", "Plan", "Estado", "Usuarios", "Admin Email"]],
            body: tableData,
            startY: 30,
        })

        doc.save("empresas_esolutions.pdf")
        toast.success("Listado exportado")
    }

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestión de Empresas</h1>
                    <p className="text-muted-foreground">Administración centralizada de {initialCompanies.length} tenants registrados.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" /> Exportar
                    </Button>
                    <Button onClick={() => router.push("/super-admin/companies/new")} className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="mr-2 h-4 w-4" /> Crear Empresa
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap gap-4 p-4 bg-white rounded-xl border shadow-sm items-center">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <Search className="h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar por nombre, slug o email..."
                        className="border-none shadow-none focus-visible:ring-0 pl-0 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-6 w-px bg-slate-200 hidden md:block" />
                    <Filter className="h-4 w-4 text-slate-400" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[160px] border-none shadow-none focus:ring-0 text-sm h-8">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="active">Activos</SelectItem>
                            <SelectItem value="trial">En Prueba</SelectItem>
                            <SelectItem value="suspended">Suspendidos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCompanies.map((company) => (
                    <Card key={company.id} className="group relative overflow-hidden transition-all hover:shadow-lg border-slate-200 bg-white">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Building2 className="h-24 w-24" />
                        </div>

                        <CardHeader className="pb-3 px-6 pt-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-bold text-slate-900 line-clamp-1">
                                        {company.name}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono text-[10px] bg-slate-50 text-slate-500 border-slate-200">
                                            {company.slug}
                                        </Badge>
                                        <Badge variant={company.status === 'active' ? 'default' : 'secondary'} className={`text-[10px] h-5 ${company.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}>
                                            {company.status === 'active' ? 'ACTIVO' : company.status?.toUpperCase() || 'PUEBA'}
                                        </Badge>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel>Gestión</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => router.push(`/super-admin/companies/${company.id}`)}>
                                            <Pencil className="mr-2 h-4 w-4" /> Editar Empresa
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => router.push(`/super-admin/companies/${company.id}/metrics`)}>
                                            <FileBarChart className="mr-2 h-4 w-4" /> Analíticas
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" /> Suspender
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>

                        <CardContent className="px-6 py-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                        <Users className="h-3 w-3" /> Usuarios
                                    </div>
                                    <p className="font-bold text-slate-900">{company._count.users}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <div className="flex items-center justify-end gap-1.5 text-slate-500 text-xs font-medium">
                                        <BookOpen className="h-3 w-3" /> Cursos
                                    </div>
                                    <p className="font-bold text-slate-900">{company._count.courses}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 italic">
                                <div className="flex items-center text-xs text-slate-500 truncate">
                                    <Mail className="mr-2 h-3 w-3 shrink-0" />
                                    {company.adminEmail || "Sin email asignado"}
                                </div>
                                <div className="flex items-center text-xs text-slate-500">
                                    <Calendar className="mr-2 h-3 w-3 shrink-0" />
                                    Desde {new Date(company.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="px-6 pb-6 pt-0">
                            <Button
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs gap-2"
                                onClick={() => router.push(`/super-admin/companies/${company.id}`)}
                            >
                                <LayoutDashboard className="h-3 w-3" />
                                Administrar Panel
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {filteredCompanies.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No se encontraron empresas</h3>
                        <p className="text-slate-500">Ajusta los filtros o crea una nueva empresa.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
