"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowRight } from "lucide-react"
import { useState } from "react"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">
                        E
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">E-SOLUTIONS</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href="#soluciones" className="hover:text-slate-900 transition-colors">Soluciones</Link>
                    <Link href="#programas" className="hover:text-slate-900 transition-colors">Programas</Link>
                    <Link href="#empresas" className="hover:text-slate-900 transition-colors">Empresas</Link>
                    <Link href="#blog" className="hover:text-slate-900 transition-colors">Blog</Link>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Button variant="ghost" asChild className="text-slate-600 hover:text-slate-900">
                        <Link href="/login">Acceder</Link>
                    </Button>
                    <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6">
                        <Link href="/demo">
                            Solicitar Demo
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-5">
                    <Link href="#soluciones" className="p-2 hover:bg-slate-50 rounded-md">Soluciones</Link>
                    <Link href="#programas" className="p-2 hover:bg-slate-50 rounded-md">Programas</Link>
                    <Link href="#empresas" className="p-2 hover:bg-slate-50 rounded-md">Empresas</Link>
                    <Link href="#blog" className="p-2 hover:bg-slate-50 rounded-md">Blog</Link>
                    <div className="h-px bg-slate-100 my-2"></div>
                    <Button variant="outline" asChild className="w-full justify-start">
                        <Link href="/login">Acceder</Link>
                    </Button>
                    <Button asChild className="w-full bg-slate-900 text-white justify-start">
                        <Link href="/demo">Solicitar Demo</Link>
                    </Button>
                </div>
            )}
        </nav>
    )
}
