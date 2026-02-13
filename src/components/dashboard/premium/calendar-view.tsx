"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Event {
    id: string
    title: string
    date: Date
    type: string
    color: string
}

export function CalendarView({ events }: { events: Event[] }) {
    const [currentDate, setCurrentDate] = useState(new Date())

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

    const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
    const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))

    const monthName = currentDate.toLocaleString('es-ES', { month: 'long' })
    const year = currentDate.getFullYear()

    const getEventsForDay = (day: number) => {
        return events.filter(e => {
            const d = new Date(e.date)
            return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()
        })
    }

    return (
        <Card className="border-none shadow-2xl bg-white dark:bg-slate-950 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-500 p-2 rounded-xl text-white">
                        <CalendarIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold capitalize">{monthName} {year}</CardTitle>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth} className="rounded-xl">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-xl">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800">
                    {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map(day => (
                        <div key={day} className="py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-[120px]">
                    {prevMonthDays.map(i => (
                        <div key={`prev-${i}`} className="border-r border-b border-slate-50 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-900/10" />
                    ))}

                    {days.map(day => {
                        const dayEvents = getEventsForDay(day)
                        const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear()

                        return (
                            <div key={day} className="border-r border-b border-slate-100 dark:border-slate-800 p-2 relative hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                                <span className={`text-sm font-bold ${isToday ? 'bg-indigo-500 text-white h-7 w-7 rounded-full flex items-center justify-center' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {day}
                                </span>

                                <div className="mt-2 space-y-1 overflow-hidden">
                                    {dayEvents.map(event => (
                                        <div
                                            key={event.id}
                                            className={`text-[9px] font-bold p-1 rounded-md truncate border ${event.color === 'rose'
                                                    ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30'
                                                    : 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/30'
                                                }`}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
