"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, PackageOpen } from "lucide-react"
import { ModuleCard } from "@/components/super-admin/modules/module-card"
import { ModulesDashboard } from "@/components/super-admin/modules/modules-dashboard"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

export function ModulesClientPage({ initialModules, auditLogsMap }: { initialModules: any[], auditLogsMap: any }) {
    const [search, setSearch] = useState("")
    const [activeTab, setActiveTab] = useState("all")

    // Filter Logic
    const filteredModules = initialModules.filter(module => {
        const matchesSearch = module.name.toLowerCase().includes(search.toLowerCase()) ||
            module.description.toLowerCase().includes(search.toLowerCase())
        const matchesTab = activeTab === 'all'
            ? true
            : activeTab === 'active'
                ? module.status === 'ACTIVE'
                : activeTab === 'inactive'
                    ? module.status === 'INACTIVE'
                    : module.status === 'BETA'

        return matchesSearch && matchesTab
    })

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Habilitar Módulos</h1>
                    <p className="text-muted-foreground">Control global de funcionalidades y servicios del sistema.</p>
                </div>
            </div>

            <ModulesDashboard modules={initialModules} />

            <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <TabsList>
                        <TabsTrigger value="all">Todos</TabsTrigger>
                        <TabsTrigger value="active">Activos</TabsTrigger>
                        <TabsTrigger value="inactive">Inactivos</TabsTrigger>
                        <TabsTrigger value="beta">Beta</TabsTrigger>
                    </TabsList>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar módulo..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {filteredModules.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Card className="border-dashed flex flex-col items-center justify-center p-8 text-center bg-muted/10">
                                    <div className="p-4 bg-muted rounded-full mb-4">
                                        <PackageOpen className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <CardHeader className="p-0">
                                        <CardTitle>Sin resultados</CardTitle>
                                        <CardDescription>
                                            No se encontraron módulos con los filtros actuales.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={activeTab + search} // Re-animate on tab/search change
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                            >
                                {filteredModules.map((module) => (
                                    <ModuleCard
                                        key={module.key}
                                        module={module}
                                        auditLogs={auditLogsMap[module.key] || []}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Tabs>
        </>
    )
}
