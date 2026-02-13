import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req
    const userRole = req.auth?.user?.role

    const isPublicRoute = nextUrl.pathname.startsWith("/verify") || nextUrl.pathname.startsWith("/api/public")
    const isLoginRoute = nextUrl.pathname.startsWith("/login")

    // Protected Routes
    const isSuperAdminRoute = nextUrl.pathname.startsWith("/super-admin")
    const isAdminRoute = nextUrl.pathname.startsWith("/admin")
    const isTeacherRoute = nextUrl.pathname.startsWith("/teacher")

    if (isPublicRoute) return NextResponse.next()

    if (isLoginRoute) {
        if (isLoggedIn) {
            if (userRole === "SUPER_ADMIN") return NextResponse.redirect(new URL("/super-admin", nextUrl))
            if (userRole === "ADMINISTRADOR") return NextResponse.redirect(new URL("/admin", nextUrl))
            if (userRole === "PROFESOR") return NextResponse.redirect(new URL("/teacher", nextUrl))
            // Default for COLABORADOR or others
            return NextResponse.redirect(new URL("/dashboard", nextUrl))
        }
        return NextResponse.next()
    }

    if (!isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl))
    }

    // Role-based protection
    if (isSuperAdminRoute && userRole !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    if (isAdminRoute && !["ADMINISTRADOR", "SUPER_ADMIN"].includes(userRole as string)) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    if (isTeacherRoute && !["PROFESOR", "SUPER_ADMIN"].includes(userRole as string)) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    if (nextUrl.pathname === "/" && isLoggedIn) {
        if (userRole === "SUPER_ADMIN") return NextResponse.redirect(new URL("/super-admin", nextUrl))
        if (userRole === "ADMINISTRADOR") return NextResponse.redirect(new URL("/admin", nextUrl))
        if (userRole === "PROFESOR") return NextResponse.redirect(new URL("/teacher", nextUrl))
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/teacher/:path*',
        '/super-admin/:path*',
        '/courses/:path*',
        '/certificates/:path*',
        '/login',
        '/verify/:path*'
    ]
}
