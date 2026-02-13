'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    Users,
    BookOpen,
    BarChart,
    Settings
} from 'lucide-react'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AdminSidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    const routes = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            href: '/admin',
            active: pathname === '/admin',
        },
        {
            label: 'Usuarios',
            icon: Users,
            href: '/admin/users',
            active: pathname.startsWith('/admin/users'),
        },
        {
            label: 'Cursos',
            icon: BookOpen,
            href: '/admin/courses',
            active: pathname.startsWith('/admin/courses'),
        },
        {
            label: 'Reportes',
            icon: BarChart,
            href: '/admin/reports',
            active: pathname.startsWith('/admin/reports'),
        },
        {
            label: 'Configuración',
            icon: Settings,
            href: '/admin/settings',
            active: pathname.startsWith('/admin/settings'),
        },
    ]

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight text-primary">
                        e-Solutions Admin
                    </h2>
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.active ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href={route.href}>
                                    <route.icon className="mr-2 h-4 w-4" />
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
