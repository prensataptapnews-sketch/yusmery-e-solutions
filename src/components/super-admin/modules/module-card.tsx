"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MoreVertical, ShieldCheck, Activity, AlertTriangle, Info } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { toggleModuleStatus, setMaintenanceMode } from "@/app/actions/super-admin/modules"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function ModuleCard({ module, auditLogs }: { module: any, auditLogs: any[] }) {
    const [status, setStatus] = useState(module.status)
    const [isLoading, setIsLoading] = useState(false)

    // Parse dependencies safely
    const dependencies = module.dependencies ? JSON.parse(module.dependencies) : []
    const hasDependencies = dependencies.length > 0

    const handleToggle = async () => {
        setIsLoading(true)
        try {
            const res = await toggleModuleStatus(module.key, status)
            if (res.success && res.newStatus) {
                setStatus(res.newStatus)
                toast.success(res.message)
            } else {
                toast.error(res.message || "Error desconocido")
            }
        } catch (e) {
            toast.error("Error de conexión")
        } finally {
            setIsLoading(false)
        }
    }

    const handleMaintenance = async () => {
        const promise = setMaintenanceMode(module.key)
        toast.promise(promise, {
            loading: 'Entrando en mantenimiento...',
            success: 'Módulo en mantenimiento',
            error: 'Error al cambiar estado'
        })
    }

    const isActive = status === 'ACTIVE'
    const isBeta = status === 'BETA'

    return (
        <TooltipProvider>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
                <Card className={`relative overflow-hidden transition-all duration-200 border-l-4 ${isActive ? 'border-l-green-500 shadow-md ring-1 ring-green-500/10' : 'border-l-muted opacity-85 hover:opacity-100'}`}>

                    {isActive && (
                        <span className="absolute top-3 right-3 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    )}

                    <CardHeader className="pb-3 pt-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1.5">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    {module.name}
                                    {isBeta && <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 hover:bg-blue-100 px-1.5 py-0 h-5">BETA</Badge>}
                                    {module.key === 'reports' && <Badge variant="outline" className="text-[10px] border-purple-200 text-purple-600 bg-purple-50 px-1.5 py-0 h-5">PREMIUM</Badge>}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 text-xs min-h-[20px]">
                                    {module.description || "Sin descripción disponible"}
                                </CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-muted-foreground hover:text-foreground">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleMaintenance}>
                                        <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                                        Modo Mantenimiento
                                    </DropdownMenuItem>
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                Ver Logs de Auditoría
                                            </DropdownMenuItem>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <SheetHeader>
                                                <SheetTitle>Historial de cambios</SheetTitle>
                                            </SheetHeader>
                                            <div className="mt-6 space-y-4">
                                                {auditLogs.map((log: any, i: number) => (
                                                    <div key={i} className="border-b pb-2">
                                                        <p className="text-sm font-medium">{log.action}</p>
                                                        <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>

                    <CardContent className="pb-3">
                        <div className="flex items-center justify-between bg-muted/40 p-3 rounded-md border border-border/50">
                            <div className="flex items-center gap-2">
                                <Activity className={`h-4 w-4 ${isActive ? 'text-green-500' : 'text-muted-foreground'}`} />
                                <span className="text-sm font-medium text-foreground/80">Estado</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Label htmlFor={`switch-${module.key}`} className={`text-xs font-semibold ${isActive ? 'text-green-600' : 'text-muted-foreground'} cursor-pointer`}>
                                    {isActive ? 'ACTIVO' : 'INACTIVO'}
                                </Label>
                                <Switch
                                    id={`switch-${module.key}`}
                                    checked={isActive}
                                    onCheckedChange={handleToggle}
                                    disabled={isLoading}
                                    className="data-[state=checked]:bg-green-500"
                                />
                            </div>
                        </div>

                        {hasDependencies && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                <Info className="h-3.5 w-3.5" />
                                <span>Requiere:</span>
                                <div className="flex flex-wrap gap-1">
                                    {dependencies.map((dep: string) => (
                                        <Tooltip key={dep}>
                                            <TooltipTrigger asChild>
                                                <Badge variant="outline" className="text-[10px] px-1.5 h-5 cursor-help bg-background hover:bg-accent">
                                                    {dep}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Este módulo depende de {dep}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="pt-0 pb-3 px-6 justify-between items-center text-[10px] text-muted-foreground/60">
                        <span className="font-mono">v{module.version || '1.0.0'}</span>
                        <span>Actualizado: {new Date(module.updatedAt).toLocaleDateString()}</span>
                    </CardFooter>
                </Card>
            </motion.div>
        </TooltipProvider>
    )
}
