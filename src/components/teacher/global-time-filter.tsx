"use client"

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronDown, CalendarDays } from 'lucide-react'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const timeOptions = [
    { label: "Todo el tiempo", value: "all" },
    { label: "Últimos 7 días", value: "7days" },
    { label: "Este Mes", value: "month" },
    { label: "Este Semestre", value: "semester" }
]

export function GlobalTimeFilter() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    // Read the current filter from URL safely
    const currentFilter = searchParams?.get('timeFilter') || 'all'
    const activeLabel = timeOptions.find(opt => opt.value === currentFilter)?.label || "Todo el tiempo"

    const handleSelect = (value: string) => {
        const params = new URLSearchParams(searchParams?.toString())
        if (value === 'all') {
            params.delete('timeFilter')
        } else {
            params.set('timeFilter', value)
        }
        // Navigate updating the URL Query without losing state in Next.js App Router
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                    <CalendarDays className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">{activeLabel}</span>
                    <ChevronDown className="h-4 w-4 text-slate-400 ml-1" />
                </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-xl font-medium">
                {timeOptions.map((opt) => (
                    <DropdownMenuItem 
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className={`cursor-pointer rounded-lg py-2.5 px-3 flex items-center gap-2 transition-colors ${
                            currentFilter === opt.value 
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' 
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        {currentFilter === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5" />}
                        <span className={currentFilter === opt.value ? 'font-bold' : ''}>{opt.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
