import { Brain } from "lucide-react"
import { CouMentSimulator } from "@/components/dashboard/evaluaciones/couMent-simulator"
import { ReturnToEvaluations } from "@/components/dashboard/evaluaciones/return-to-evaluations"

export default function CouMentPage() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
            <ReturnToEvaluations />

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                    <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                    <div className="text-xs font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-1">
                        Simulador de Liderazgo
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Cou-Ment
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-0.5">
                        Entrena tu estilo de liderazgo con casos reales de la vida corporativa.
                    </p>
                </div>
            </div>

            {/* Simulator */}
            <CouMentSimulator />
        </div>
    )
}
