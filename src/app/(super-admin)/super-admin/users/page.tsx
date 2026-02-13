"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus, FileDown, CheckCircle, XCircle, MoreVertical } from "lucide-react"
import { UserActions } from "@/components/super-admin/users/user-actions"

// Mock Data for now, replacing the Prisma call for the Client Component structure
// In a real app, I would pass this data from the server page as props
const INITIAL_USERS = [
    { id: "u1", name: "Ana García", email: "ana@techcorp.com", role: "STUDENT", company: "TechCorp", isActive: true, area: "Operaciones" },
    { id: "u2", name: "Carlos Ruiz", email: "carlos@techcorp.com", role: "TEACHER", company: "TechCorp", isActive: true, area: "Ventas" },
    { id: "u3", name: "Maria López", email: "maria@globalsol.com", role: "ADMIN", company: "Global Solutions", isActive: false, area: "RRHH" },
    { id: "u4", name: "Juan Perez", email: "juan@globalsol.com", role: "STUDENT", company: "Global Solutions", isActive: true, area: "IT" },
    { id: "u5", name: "Sofia Diaz", email: "sofia@startup.com", role: "SUPER_ADMIN", company: "E-Solutions", isActive: true, area: "Dirección" },
    { id: "u6", name: "Pedro Pascal", email: "pedro@disney.com", role: "STUDENT", company: "Disney", isActive: false, area: "Acting" },
]

export default function UsersClientPage() {
    const [users, setUsers] = useState(INITIAL_USERS)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("ALL")
    const [statusFilter, setStatusFilter] = useState("ALL")

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.company.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesRole = roleFilter === "ALL" || user.role === roleFilter

        // Status Filter: "ALL", "ACTIVE", "INACTIVE"
        const matchesStatus = statusFilter === "ALL" ||
            (statusFilter === "ACTIVE" && user.isActive) ||
            (statusFilter === "INACTIVE" && !user.isActive)

        return matchesSearch && matchesRole && matchesStatus
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                    <p className="text-muted-foreground">Administra el acceso, roles y estados de los usuarios globales.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <FileDown className="mr-2 h-4 w-4" /> Exportar
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre, email o empresa..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todos los Roles</SelectItem>
                                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                    <SelectItem value="ADMIN">Admin Empresa</SelectItem>
                                    <SelectItem value="TEACHER">Profesor</SelectItem>
                                    <SelectItem value="STUDENT">Estudiante</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todos los Estados</SelectItem>
                                    <SelectItem value="ACTIVE">Activos</SelectItem>
                                    <SelectItem value="INACTIVE">Inactivos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b bg-slate-50">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Usuario</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Rol</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Empresa</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Estado</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No se encontraron usuarios.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 group">
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={
                                                    user.role === 'SUPER_ADMIN' ? 'default' :
                                                        user.role === 'ADMIN' ? 'secondary' :
                                                            user.role === 'TEACHER' ? 'outline' : 'outline'
                                                }>
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {user.company}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {user.isActive ? (
                                                    <Badge variant={"success" as any} className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Activo
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                                                        <XCircle className="w-3 h-3 mr-1" /> Inactivo
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <UserActions user={user} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
