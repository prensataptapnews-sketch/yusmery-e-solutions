"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Building2, ChevronDown, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { toggleCompanyModuleStatus } from "@/app/actions/super-admin/modules"
import { motion, AnimatePresence } from "framer-motion"

interface Module {
    key: string
    name: string
    description: string
    status: string // Global status
    dependencies: string | null
}

interface Company {
    id: string
    name: string
    plan: string
    moduleOverrides: { moduleKey: string, status: string }[]
}

export function CompanyModulesManager({ companies, systemModules }: { companies: Company[], systemModules: Module[] }) {
    const [search, setSearch] = useState("")
    const [processing, setProcessing] = useState<Record<string, boolean>>({})

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleToggle = async (companyId: string, moduleKey: string, currentStatus: boolean) => {
        const toastId = toast.loading("Actualizando configuración...")
        const key = `${companyId}-${moduleKey}`
        setProcessing(prev => ({ ...prev, [key]: true }))

        try {
            const res = await toggleCompanyModuleStatus(companyId, moduleKey, currentStatus)
            if (res.success) {
                toast.success(res.message, { id: toastId })
            } else {
                toast.error(res.message, { id: toastId })
            }
        } catch (e) {
            toast.error("Error al conectar con el servidor", { id: toastId })
        } finally {
            setProcessing(prev => ({ ...prev, [key]: false }))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Gestión por Empresa</h2>
                    <p className="text-sm text-muted-foreground">Configura qué módulos ve cada cliente individualmente.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar empresa..."
                        className="pl-8 bg-background"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                <AnimatePresence>
                    {filteredCompanies.map((company) => (
                        <motion.div
                            key={company.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <Card className="overflow-hidden border-l-4 border-l-blue-500">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value={company.id} className="border-0">
                                        <div className="flex items-center px-6 py-4">
                                            <div className="flex-1">
                                                <AccordionTrigger className="hover:no-underline py-0">
                                                    <div className="flex items-center gap-3 text-left">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                            {company.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-base">{company.name}</div>
                                                            <div className="text-xs text-muted-foreground flex gap-2 items-center">
                                                                <Badge variant="secondary" className="text-[10px] h-5">{company.plan}</Badge>
                                                                <span>{company.moduleOverrides.length} personalizaciones</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                            </div>
                                        </div>

                                        <AccordionContent className="bg-slate-50/50 dark:bg-slate-900/20 px-6 pb-6 pt-2 border-t">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                                {systemModules.map((mod) => {
                                                    // Determine effective status for this company
                                                    const override = company.moduleOverrides.find(o => o.moduleKey === mod.key)
                                                    const isGloballyActive = mod.status === 'ACTIVE'

                                                    // Backend logic usually is: If override exists, use it. If not, use global? 
                                                    // OR Global is Master.
                                                    // For this "Enable Modules" feature, user usually implies "Allow this company to use X".
                                                    // Let's assume Global Status is the DEFAULT if no override.

                                                    const isCompanyActive = override
                                                        ? override.status === 'ACTIVE'
                                                        : isGloballyActive

                                                    return (
                                                        <div key={mod.key} className="flex items-center justify-between p-3 rounded-lg border bg-background hover:shadow-sm transition-all">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${isCompanyActive ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                                <div className="min-w-0">
                                                                    <div className="font-medium text-sm truncate">{mod.name}</div>
                                                                    <div className="text-[10px] text-muted-foreground truncate">{mod.status === 'BETA' ? 'Beta' : 'Estable'}</div>
                                                                </div>
                                                            </div>
                                                            <Switch
                                                                checked={isCompanyActive}
                                                                onCheckedChange={() => handleToggle(company.id, mod.key, isCompanyActive)}
                                                                disabled={processing[`${company.id}-${mod.key}`]}
                                                                className={isCompanyActive ? "data-[state=checked]:bg-green-500" : ""}
                                                            />
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredCompanies.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Building2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No se encontraron empresas.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
