"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { updateUser } from "@/app/actions/super-admin/users"
import { Loader2 } from "lucide-react"

const userSchema = z.object({
    name: z.string().min(2, "El nombre es requerido"),
    email: z.string().email("Email inválido"),
    role: z.string(),
    company: z.string(),
    isActive: z.boolean()
})

type UserFormValues = z.infer<typeof userSchema>

interface EditUserSheetProps {
    user: any
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditUserSheet({ user, open, onOpenChange }: EditUserSheetProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company || "",
            isActive: user.isActive ?? true
        }
    })

    const onSubmit = async (data: UserFormValues) => {
        setIsLoading(true)
        try {
            const res = await updateUser(user.id, data)
            if (res.success) {
                toast.success("Usuario actualizado correctamente")
                onOpenChange(false)
            } else {
                toast.error("Error al actualizar usuario")
            }
        } catch (error) {
            toast.error("Error de conexión")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Editar Usuario</SheetTitle>
                    <SheetDescription>
                        Modifica los datos del usuario. Haz clic en guardar cuando termines.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-6 px-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" {...form.register("name")} />
                        {form.formState.errors.name && (
                            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input id="email" {...form.register("email")} />
                        {form.formState.errors.email && (
                            <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Rol</Label>
                            <Select
                                onValueChange={(val) => form.setValue("role", val)}
                                defaultValue={user.role}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                    <SelectItem value="ADMIN">Admin Empresa</SelectItem>
                                    <SelectItem value="TEACHER">Profesor</SelectItem>
                                    <SelectItem value="STUDENT">Estudiante</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Empresa</Label>
                            <Input {...form.register("company")} placeholder="Nombre de empresa" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                            <Label className="text-base text-slate-900">Estado Activo</Label>
                            <p className="text-sm text-muted-foreground">
                                Desactiva para bloquear acceso.
                            </p>
                        </div>
                        <Switch
                            checked={form.watch("isActive")}
                            onCheckedChange={(checked) => form.setValue("isActive", checked)}
                        />
                    </div>

                    <SheetFooter className="gap-2 sm:flex-row sm:justify-end sm:gap-2">
                        <SheetClose asChild>
                            <Button variant="outline" type="button" className="w-full sm:w-auto">Cancelar</Button>
                        </SheetClose>
                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto text-white">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
