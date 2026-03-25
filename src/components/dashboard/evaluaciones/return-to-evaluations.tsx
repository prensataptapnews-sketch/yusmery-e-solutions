"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

interface ReturnToEvaluationsProps {
    href?: string
    label?: string
}

export function ReturnToEvaluations({ 
    href = "/dashboard/evaluaciones", 
    label = "Volver al Centro de Evaluaciones" 
}: ReturnToEvaluationsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 pt-2"
        >
            <Link 
                href={href}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
                <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </div>
                <span>{label}</span>
            </Link>
        </motion.div>
    )
}
