"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { BookOpen, Home, Library, LogOut, User, Menu, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function Header() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const user = session?.user

    const routes = [
        {
            href: "/",
            label: "Inicio",
            icon: Home,
            active: pathname === "/",
        },
        {
            href: "/courses",
            label: "Mis Cursos",
            icon: BookOpen,
            active: pathname.startsWith("/courses"),
        },
        {
            href: "/catalog",
            label: "Catálogo",
            icon: Library,
            active: pathname.startsWith("/catalog"),
        },
        {
            href: "/certificates",
            label: "Certificados",
            icon: BookOpen,
            active: pathname.startsWith("/certificates"),
        },
    ]

    const isAdmin = user?.role === "ADMINISTRADOR" || user?.role === "SUPER_ADMIN" || user?.role === "ADMIN"
    const isTeacher = user?.role === "PROFESOR" || user?.role === "TEACHER"

    if (isAdmin) {
        routes.splice(1, 0, {
            href: user?.role === "SUPER_ADMIN" ? "/super-admin" : "/admin",
            label: "Panel Admin",
            icon: ShieldCheck,
            active: pathname.startsWith("/admin") || pathname.startsWith("/super-admin"),
        })
    }

    if (isTeacher) {
        routes.splice(1, 0, {
            href: "/teacher",
            label: "Panel Instructor",
            icon: BookOpen,
            active: pathname.startsWith("/teacher"),
        })
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-[#1E40AF] text-white shadow-md">
            <div className="flex h-16 items-center justify-between w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        {/* Logo Placeholder */}
                        <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center">
                            <span className="text-white text-lg">E</span>
                        </div>
                        <span>e-Solutions</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "transition-colors hover:text-teal-200",
                                    route.active ? "text-white font-bold border-b-2 border-teal-400 pb-1" : "text-white/80"
                                )}
                            >
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {/* User Dropdown */}
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8 border-2 border-white/20">
                                        <AvatarImage src={user.image || ""} alt={user.name || ""} />
                                        <AvatarFallback className="bg-teal-600 text-white">
                                            {user.name?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {isAdmin && (
                                    <DropdownMenuItem asChild>
                                        <Link href={user?.role === "SUPER_ADMIN" ? "/super-admin" : "/admin"} className="cursor-pointer font-semibold">
                                            <ShieldCheck className="mr-2 h-4 w-4 text-indigo-600" />
                                            <span>Panel Admin</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                {isTeacher && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/teacher" className="cursor-pointer font-semibold">
                                            <BookOpen className="mr-2 h-4 w-4 text-emerald-600" />
                                            <span>Panel Instructor</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Perfil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={() => signOut()}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar Sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                            <div className="flex flex-col gap-4 py-4">
                                {routes.map((route) => (
                                    <Link
                                        key={route.href}
                                        href={route.href}
                                        className={cn(
                                            "px-2 py-1 text-lg font-medium transition-colors hover:text-primary",
                                            route.active ? "text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        {route.label}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
