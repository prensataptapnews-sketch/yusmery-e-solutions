import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (credentials?.email === 'admin@example.com' && credentials?.password === 'admin123') {
                    return { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'SUPER_ADMIN' }
                }
                return null
            },
        }),
    ],
})
