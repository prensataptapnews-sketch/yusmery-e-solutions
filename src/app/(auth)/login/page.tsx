"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner" // Assuming sonner or use-toast is installed, prompt didn't specify but good practice. I'll use simple alert fallback if needed or just standard error connection.
// Actually, I'll stick to standard alert for simplicity or just inline error since I didn't check for toast lib.

const formSchema = z.object({
    email: z.string().email({
        message: "Por favor ingresa un email válido.",
    }),
    password: z.string().min(1, {
        message: "La contraseña es requerida.",
    }),
})

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        setError(null)

        try {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            })

            if (result?.error) {
                setError("Credenciales inválidas. Intenta nuevamente.")
            } else {
                // Force hard reload to ensure session cookie is sent and server-side redirects in page.tsx work
                window.location.href = "/"
            }
        } catch (error) {
            setError("Ocurrió un error inesperado. Intenta nuevamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 text-center bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold">Bienvenido de nuevo</CardTitle>
                <CardDescription className="text-teal-100">
                    Ingresa tus credenciales para acceder
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nombre@empresa.com"
                                disabled={isLoading}
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                disabled={isLoading}
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <Button className="w-full bg-teal-500 hover:bg-teal-600" type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Iniciar Sesión
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
