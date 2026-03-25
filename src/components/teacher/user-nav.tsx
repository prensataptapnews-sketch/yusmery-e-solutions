
"use client"

import { LogOut, Settings, User } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function UserNav() {
    const { data: session } = useSession()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-11 w-11 rounded-full ring-2 ring-white hover:ring-indigo-100 transition-all shadow-sm">
                    <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
                        <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black">
                            {session?.user?.name?.slice(0, 2).toUpperCase() || "PR"}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            {/* Forced bg-white and high shadow completely overriding transparency issues */}
            <DropdownMenuContent className="w-64 bg-white border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] rounded-2xl p-2 z-[100] mt-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1.5">
                        <p className="text-sm font-bold text-slate-800 leading-none">{session?.user?.name || 'Profesor'}</p>
                        <p className="text-xs font-medium leading-none text-slate-500">
                            {session?.user?.email || 'admin@e-solutions.com'}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100 mb-2" />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50 rounded-xl py-2.5 px-3 transition-colors">
                        <Link href="/teacher/profile" className="flex items-center">
                            <User className="mr-3 h-4 w-4 text-slate-500" />
                            <span className="font-semibold text-slate-700">Mi Perfil</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50 rounded-xl py-2.5 px-3 transition-colors mt-1">
                        <Link href="/teacher/settings" className="flex items-center">
                            <Settings className="mr-3 h-4 w-4 text-slate-500" />
                            <span className="font-semibold text-slate-700">Configuración</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-100 my-2" />
                <DropdownMenuItem 
                    onClick={() => signOut({ callbackUrl: '/login' })} 
                    className="cursor-pointer text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus:bg-rose-50 focus:text-rose-700 rounded-xl py-2.5 px-3 transition-colors font-semibold"
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
