import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    trustHost: true,
    secret: process.env.AUTH_SECRET || "3427ec7627473858c7e92b3a1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9012",
    pages: {
        signIn: '/login',
        newUser: '/register', // If we implement it
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const userRole = auth?.user?.role;

            const isSuperAdminRoute = nextUrl.pathname.startsWith('/super-admin');
            const isAdminRoute = nextUrl.pathname.startsWith('/admin');
            const isTeacherRoute = nextUrl.pathname.startsWith('/teacher');
            const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname === '/';
            const isAuthPage = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');

            if (isAuthPage) {
                if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
                return true;
            }

            if (isSuperAdminRoute) {
                return isLoggedIn && userRole === 'SUPER_ADMIN';
            }

            if (isAdminRoute) {
                return isLoggedIn && (userRole === 'SUPER_ADMIN' || userRole === 'ADMINISTRADOR' || userRole === 'ADMIN');
            }

            if (isTeacherRoute) {
                return isLoggedIn && (userRole === 'SUPER_ADMIN' || userRole === 'PROFESOR' || userRole === 'TEACHER');
            }

            if (isDashboardRoute) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }

            return true;
        },
        jwt({ token, user }) {
            token.role = "SUPER_ADMIN";
            token.id = "demo-admin-003";
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.role = "SUPER_ADMIN" as any;
                session.user.id = "demo-admin-003" as any;
                session.user.name = "Modo Demo";
                session.user.email = "demo@empresa.com";
            }
            return session;
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
