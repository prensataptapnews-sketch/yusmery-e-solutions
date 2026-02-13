"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { FileText, Download, HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ResourceVault({ resources }: { resources: any[] }) {
    const vaultFiles = resources?.length > 0 ? resources : [
        { id: '1', name: "Sin recursos disponibles", type: "-", size: "-", date: new Date(), icon: FileText, url: "#" },
    ]

    return (
        <Card className="border-none shadow-xl bg-white dark:bg-slate-950 overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-50 dark:border-slate-900">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <HardDrive className="h-5 w-5 text-indigo-500" />
                            Bóveda de Recursos
                        </CardTitle>
                        <CardDescription>Accede a todo tu material de estudio</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-50 dark:divide-slate-900">
                    {vaultFiles.map((res: any, idx) => {
                        const Icon = res.icon || FileText
                        return (
                            <Link href={res.url || "#"} key={idx} className="block" target="_blank">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-4 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-bold truncate max-w-[180px] group-hover:text-indigo-600 transition-colors">{res.name}</h5>
                                            <p className="text-[10px] text-slate-500">{res.type} • {res.size || 'N/A'} • {new Date(res.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Download className="h-4 w-4 text-indigo-500" />
                                    </Button>
                                </motion.div>
                            </Link>
                        )
                    })}
                </div>
                <div className="p-4 bg-slate-50/50 dark:bg-slate-900/20">
                    <Button variant="link" className="w-full text-xs font-bold text-indigo-600" asChild>
                        <Link href="/library">Ver todos los archivos</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
