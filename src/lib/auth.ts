import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data

                    // Database Lookup
                    // This enables logging in with users created via seed scripts or registration
                    if (process.env.DATABASE_URL) {
                        try {
                            const { prisma } = await import("@/lib/prisma");
                            const user = await prisma.user.findUnique({
                                where: { email }
                            });

                            if (user && user.password) {
                                const bcrypt = await import("bcryptjs");
                                const passwordsMatch = await bcrypt.compare(password, user.password);

                                if (passwordsMatch) {
                                    return {
                                        id: user.id,
                                        name: user.name,
                                        email: user.email,
                                        role: user.role,
                                        area: user.area ? user.area.toString() : undefined,
                                        assignedAreas: user.assignedAreas ? JSON.parse(user.assignedAreas) : undefined
                                    }
                                }
                            }
                        } catch (e) {
                            console.error("Auth DB Error", e);
                        }
                    }
                }
                return null
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                // @ts-ignore
                session.user.id = token.sub as string
                // @ts-ignore
                session.user.role = token.role as any
                // @ts-ignore
                session.user.area = token.area as any
                // @ts-ignore
                session.user.assignedAreas = token.assignedAreas as any
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.area = user.area
                token.assignedAreas = user.assignedAreas
            }
            return token
        },
    },
})
