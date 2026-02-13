'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    LayoutDashboard,
    BookOpen,
    Library,
    FileText,
    Award,
    Settings,
    LogOut,
    Menu,
    ClipboardList
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    const routes = [
        {
            label: 'Inicio',
            icon: LayoutDashboard,
            href: '/',
            active: pathname === '/',
        },
        {
            label: 'Mis Cursos',
            icon: BookOpen,
            href: '/courses',
            active: pathname.startsWith('/courses'),
        },
        {
            label: 'Catálogo',
            icon: Library,
            href: '/catalog',
            active: pathname.startsWith('/catalog'),
        },
        {
            label: 'Biblioteca',
            icon: FileText,
            href: '/library',
            active: pathname.startsWith('/library'),
        },
        {
            label: 'Certificados',
            icon: Award,
            href: '/certificates',
            active: pathname.startsWith('/certificates'),
        },
        {
            label: 'Diagnósticos',
            icon: ClipboardList,
            href: '/diagnosticos',
            active: pathname.startsWith('/diagnosticos'),
        },
    ]

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight text-primary">
                        e-Solutions
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
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                        Cuenta
                    </h2>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/profile">
                                <Settings className="mr-2 h-4 w-4" />
                                Perfil
                            </Link>
                        </Button>
                        {/* Logout is usually handled by a separate button or form */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false)
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-background">
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
}
