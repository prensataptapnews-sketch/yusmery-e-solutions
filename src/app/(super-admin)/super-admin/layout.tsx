"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building2, UserPlus, Layers, Users, Settings, LogOut, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { SuperAdminUserNav } from "@/components/super-admin/user-nav"

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const navItems = [
        { name: "Dashboard General", href: "/super-admin", icon: LayoutDashboard },
        { name: "Gestión de Empresas", href: "/super-admin/companies", icon: Building2 },
        { name: "Matricular Usuarios", href: "/super-admin/users/enroll", icon: UserPlus },
        { name: "Habilitar Módulos", href: "/super-admin/modules", icon: Layers },
        { name: "Usuarios Globales", href: "/super-admin/users", icon: Users },
        { name: "Diagnósticos", href: "/super-admin/diagnosticos", icon: ClipboardList },
        { name: "Configuración", href: "/super-admin/settings", icon: Settings },
    ]

    return (
        <div className="flex h-screen bg-muted/20">
            {/* Super Admin Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-50 border-r flex flex-col hidden md:flex">
                <div className="p-6 border-b border-slate-800 flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        S
                    </div>
                    <span className="font-bold text-lg">Super Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                pathname === item.href
                                    ? "bg-blue-600/20 text-blue-400"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-500 hover:text-red-400 hover:bg-red-950/30"
                        onClick={() => signOut()}
                    >
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 px-6 border-b bg-background flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Panel de Control Total</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden md:inline-block">Super Admin</span>
                        <SuperAdminUserNav />
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
