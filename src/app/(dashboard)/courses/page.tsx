'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Clock, Search, Sparkles, BookOpen, Trophy } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { cn } from "@/lib/utils"

const myCourses = [
    {
        id: "1",
        title: "Liderazgo de Equipos Ágiles",
        category: "Negocios",
        progress: 45,
        totalModules: 8,
        completedModules: 3,
        lastAccessed: "Hace 2 días",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
        slug: "liderazgo-agil",
        featured: true
    },
    {
        id: "2",
        title: "Seguridad Industrial Básica",
        category: "Seguridad",
        progress: 10,
        totalModules: 5,
        completedModules: 0,
        lastAccessed: "Hace 1 semana",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60",
        slug: "seguridad-basica",
        featured: false
    },
    {
        id: "3",
        title: "Excel Avanzado para Finanzas",
        category: "Productividad",
        progress: 90,
        totalModules: 12,
        completedModules: 10,
        lastAccessed: "Ayer",
        image: "https://images.unsplash.com/photo-1543286386-713df548e9cc?w=800&auto=format&fit=crop&q=60",
        slug: "excel-avanzado",
        featured: false
    },
    {
        id: "4",
        title: "Inteligencia Artificial para Negocios",
        category: "Tecnología",
        progress: 0,
        totalModules: 6,
        completedModules: 0,
        lastAccessed: "Nuevo",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
        slug: "ia-negocios",
        featured: false
    }
]

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState('all')

    const filteredCourses = myCourses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filter === 'all' || (filter === 'completed' ? course.progress === 100 : course.progress < 100))
    )

    return (
        <div className="min-h-screen pb-20 space-y-12">
            
            {/* Header Flotante & Hero */}
            <div className="relative pt-6">
                <div className="absolute inset-0 -top-24 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent h-[400px] blur-3xl -z-10 pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-indigo-500 font-bold tracking-wider uppercase text-xs"
                        >
                            <Sparkles className="h-4 w-4" /> Academia Corporativa
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white"
                        >
                            Mis Cursos
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-500 dark:text-slate-400 text-lg max-w-xl"
                        >
                            Continúa dominando nuevas habilidades e incrementando tu potencial profesional.
                        </motion.p>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center p-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl"
                    >
                        <Button 
                            variant={filter === 'all' ? 'default' : 'ghost'} 
                            onClick={() => setFilter('all')}
                            className={cn(
                                "rounded-xl font-bold transition-all px-6",
                                filter === 'all' 
                                    ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                                    : "text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
                            )}
                        >
                            Todos
                        </Button>
                        <Button 
                            variant={filter === 'active' ? 'default' : 'ghost'} 
                            onClick={() => setFilter('active')}
                            className={cn(
                                "rounded-xl font-bold transition-all px-6",
                                filter === 'active' 
                                    ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                                    : "text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
                            )}
                        >
                            En curso
                        </Button>
                        <Button 
                            variant={filter === 'completed' ? 'default' : 'ghost'} 
                            onClick={() => setFilter('completed')}
                            className={cn(
                                "rounded-xl font-bold transition-all px-6",
                                filter === 'completed' 
                                    ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                                    : "text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
                            )}
                        >
                            Completados
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Barra de Búsqueda Flotante (Sticky) */}
            <div className="sticky top-4 z-40">
                <motion.div 
                    layout
                    className="max-w-2xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-2 shadow-2xl shadow-indigo-500/10 flex items-center gap-2"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar en mis cursos..." 
                            className="h-12 border-none bg-transparent focus-visible:ring-0 text-lg pl-12 font-medium text-slate-900 dark:text-white" 
                        />
                    </div>
                </motion.div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <AnimatePresence mode='popLayout'>
                    {filteredCourses.map((course, index) => (
                        <CourseCard key={course.id} course={course} index={index} />
                    ))}
                </AnimatePresence>
            </div>

            {filteredCourses.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <BookOpen className="h-16 w-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-400 dark:text-slate-500">No se encontraron cursos con este filtro.</h2>
                </motion.div>
            )}
        </div>
    )
}

function CourseCard({ course, index }: { course: any, index: number }) {
    const isFeatured = course.featured;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.05, type: 'spring', damping: 20 }}
            whileHover={{ y: -8 }}
            className={`group relative flex flex-col bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 ${isFeatured ? 'md:col-span-2' : ''}`}
        >
            {/* Thumbnail con Glass Overlay */}
            <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[21/9]' : 'aspect-[16/10]'}`}>
                <motion.img
                    src={course.image}
                    alt={course.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-white/20 backdrop-blur-md border-white/30 text-white font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-widest">
                        {course.category}
                    </Badge>
                </div>

                {isFeatured && (
                    <div className="absolute top-4 right-4 animate-bounce">
                        <Badge className="bg-amber-400 text-amber-950 font-black border-none px-4 py-1.5 rounded-full text-xs shadow-lg">
                            <Sparkles className="h-3 w-3 mr-1" /> DESTACADO
                        </Badge>
                    </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div 
                        initial={{ scale: 0.5 }}
                        whileHover={{ scale: 1.1 }}
                        className="h-16 w-16 bg-white/90 dark:bg-indigo-500/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl"
                    >
                        <PlayCircle className="h-8 w-8 text-indigo-600 dark:text-white ml-1" />
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <h3 className={`font-black text-slate-900 dark:text-white leading-tight transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ${isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
                            {course.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-300 text-sm flex items-center gap-2 font-medium">
                            <Clock className="h-4 w-4" /> {course.lastAccessed}
                        </p>
                    </div>
                    
                    {/* Ring Progress (Modern SVG) */}
                    <div className="relative h-14 w-14 shrink-0">
                        <svg className="h-full w-full transform -rotate-90">
                            <circle
                                cx="28"
                                cy="28"
                                r="24"
                                className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                                strokeWidth="4"
                            />
                            <motion.circle
                                cx="28"
                                cy="28"
                                r="24"
                                className="stroke-indigo-500 dark:stroke-indigo-400 fill-none"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray="150"
                                initial={{ strokeDashoffset: 150 }}
                                animate={{ strokeDashoffset: 150 - (150 * course.progress) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-900 dark:text-white">
                            {course.progress}%
                        </div>
                        {/* Glow Effect */}
                        <div className="absolute inset-0 blur-md bg-indigo-500/20 rounded-full -z-10 animate-pulse" />
                    </div>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between gap-4">
                    <div className="flex -space-x-3">
                        <div className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-500/10 flex items-center justify-center text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                           <Trophy className="h-3 w-3" />
                        </div>
                        <div className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500/10 flex items-center justify-center text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                           {course.completedModules}/{course.totalModules}
                        </div>
                    </div>
                    
                    <Button 
                        asChild
                        className="rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black h-12 px-8 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl shadow-slate-950/10 hover:-translate-y-1 active:scale-95"
                    >
                        <Link href={`/courses/${course.slug}`}>Continuar</Link>
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
