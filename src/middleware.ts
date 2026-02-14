import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req
    const userRole = req.auth?.user?.role

    const isPublicRoute = nextUrl.pathname.startsWith("/verify") || nextUrl.pathname.startsWith("/api/public") || nextUrl.pathname.startsWith("/api/auth")
    const isLoginRoute = nextUrl.pathname.startsWith("/login")
    const isApiRoute = nextUrl.pathname.startsWith("/api")

    // Protected Routes
    const isSuperAdminRoute = nextUrl.pathname.startsWith("/super-admin")
    const isAdminRoute = nextUrl.pathname.startsWith("/admin")
    const isTeacherRoute = nextUrl.pathname.startsWith("/teacher")

    if (isPublicRoute) return NextResponse.next()

    if (isApiRoute && !isLoggedIn) {
        return new NextResponse(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        )
    }

    if (isLoginRoute) {
        if (isLoggedIn) {
            if (userRole === "SUPER_ADMIN") return NextResponse.redirect(new URL("/super-admin", nextUrl))
            if (userRole === "ADMIN" || userRole === "ADMINISTRADOR") return NextResponse.redirect(new URL("/admin", nextUrl))
            if (userRole === "TEACHER" || userRole === "PROFESOR") return NextResponse.redirect(new URL("/teacher", nextUrl))
            // Default for STUDENT, COLABORADOR or others
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

    if (isAdminRoute && !["ADMIN", "ADMINISTRADOR", "SUPER_ADMIN"].includes(userRole as string)) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    if (isTeacherRoute && !["TEACHER", "PROFESOR", "SUPER_ADMIN"].includes(userRole as string)) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    if (nextUrl.pathname === "/" && isLoggedIn) {
        if (userRole === "SUPER_ADMIN") return NextResponse.redirect(new URL("/super-admin", nextUrl))
        if (userRole === "ADMIN" || userRole === "ADMINISTRADOR") return NextResponse.redirect(new URL("/admin", nextUrl))
        if (userRole === "TEACHER" || userRole === "PROFESOR") return NextResponse.redirect(new URL("/teacher", nextUrl))
        return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        '/api/:path*',
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
