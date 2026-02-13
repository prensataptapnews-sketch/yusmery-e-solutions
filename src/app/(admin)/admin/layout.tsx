"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BookOpen, BarChart3, Settings, LogOut, ClipboardCheck, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { AdminUserNav } from "@/components/admin/user-nav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Colaboradores", href: "/admin/users", icon: Users },
        { name: "Cursos", href: "/admin/courses", icon: BookOpen },
        { name: "Reportes", href: "/admin/reports", icon: BarChart3 },
        { name: "Evaluaciones", href: "/admin/evaluations", icon: ClipboardCheck },
        { name: "Diagnósticos", href: "/admin/diagnosticos", icon: ClipboardList },
        { name: "Configuración", href: "/admin/settings", icon: Settings },
    ]

    return (
        <div className="flex h-screen bg-muted/20">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-card border-r flex flex-col hidden md:flex">
                <div className="p-6 border-b flex items-center gap-2">
                    <div className="h-8 w-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                        A
                    </div>
                    <span className="font-bold text-lg">Admin Área</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                pathname === item.href
                                    ? "bg-teal-50 text-teal-600"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => signOut()}>
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 px-6 border-b bg-card flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Panel de Área</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden md:inline-block">Admin Área</span>
                        <AdminUserNav />
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
