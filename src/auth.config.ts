import type { NextAuthConfig } from "next-auth"

export const authConfig = {
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
                return isLoggedIn && (userRole === 'SUPER_ADMIN' || userRole === 'ADMINISTRADOR');
            }

            if (isTeacherRoute) {
                return isLoggedIn && (userRole === 'SUPER_ADMIN' || userRole === 'PROFESOR');
            }

            if (isDashboardRoute) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }

            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id || '';
            }
            return token;
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as any;
                session.user.id = token.id as any;
            }
            return session;
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
