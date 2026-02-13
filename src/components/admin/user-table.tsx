"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, ArrowLeft, ArrowRight } from "lucide-react"

interface User {
    id: string
    name: string
    email: string
    department: string
    role: string
    courseCount: number
    progress: number
    avatar?: string | null
}

interface UserTableProps {
    users: User[]
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
    selectedUsers: string[]
    onSelectUser: (userId: string, isSelected: boolean) => void
    onSelectAll: (isSelected: boolean) => void
    onPageChange: (page: number) => void
    onEdit: (user: User) => void
    onDelete: (userId: string) => void
}

export function UserTable({
    users,
    pagination,
    selectedUsers,
    onSelectUser,
    onSelectAll,
    onPageChange,
    onEdit,
    onDelete
}: UserTableProps) {
    const isAllSelected = users.length > 0 && selectedUsers.length === users.length

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={isAllSelected}
                                    onCheckedChange={(checked) => onSelectAll(!!checked)}
                                />
                            </TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Departamento</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead className="text-center">Cursos</TableHead>
                            <TableHead className="text-center">% Progreso</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedUsers.includes(user.id)}
                                        onCheckedChange={(checked) => onSelectUser(user.id, !!checked)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.avatar || undefined} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.department}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={
                                        user.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700 border-purple-200" :
                                            user.role === "COMPANY_ADMIN" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                                "bg-gray-100 text-gray-700 border-gray-200"
                                    }>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">{user.courseCount}</TableCell>
                                <TableCell className="text-center">
                                    <span className={
                                        user.progress >= 80 ? "text-green-600 font-medium" :
                                            user.progress >= 50 ? "text-yellow-600" : "text-gray-500"
                                    }>
                                        {user.progress}%
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => onEdit(user)}>
                                                <Edit className="mr-2 h-4 w-4" /> Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} usuarios
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                        Página {pagination.page} de {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                    >
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
