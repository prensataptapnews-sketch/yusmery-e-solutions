import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { authConfig } from "@/auth.config"

// Helper to get prisma safely only when needed
const getPrisma = async () => {
    try {
        const { prisma } = await import("@/lib/prisma");
        return prisma;
    } catch (err) {
        console.error("[auth] Failed to load Prisma:", err);
        return null;
    }
};

// Hardcoded demo users — used when password is "developer"
// This bypasses Prisma entirely so it works on Netlify edge/serverless
const DEMO_USERS: Record<string, { id: string; name: string; email: string; role: string }> = {
    "colaborador@empresa.com": {
        id: "demo-colaborador-001",
        name: "Estudiante Prueba",
        email: "colaborador@empresa.com",
        role: "STUDENT",
    },
    "profe@empresa.com": {
        id: "demo-profesor-002",
        name: "Profesor Experto",
        email: "profe@empresa.com",
        role: "PROFESOR",
    },
    "admin@esolutions.com": {
        id: "demo-admin-003",
        name: "Super Admin",
        email: "admin@esolutions.com",
        role: "SUPER_ADMIN",
    },
}

const nextAuthResult = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "Credentials",
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (!parsedCredentials.success) return null

                const { email, password } = parsedCredentials.data

                // ✅ Developer bypass — no DB call needed
                if (password === "developer") {
                    const demoUser = DEMO_USERS[email]
                    if (demoUser) return demoUser as any
                    return null
                }

                // 🔐 Real login — query DB with protection against Prisma errors
                try {
                    const prisma = await getPrisma();
                    if (!prisma) {
                        console.warn("[auth] Prisma not available, skipping DB check");
                        return null;
                    }
                    const user = await prisma.user.findUnique({ where: { email } })

                    if (user && user.password) {
                        const passwordsMatch = await bcrypt.compare(password, user.password)
                        if (passwordsMatch) {
                            return {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                area: user.area as any,
                                assignedAreas: user.assignedAreas as any,
                            } as any
                        }
                    }
                } catch (err) {
                    console.error("[auth] DB error during login:", err)
                }

                return null
            },
        }),
    ],
})

export const { handlers, signIn, signOut } = nextAuthResult

export const auth = async (...args: any[]) => {
    // DEMO BYPASS: Always return a valid session so server components don't redirect to /login
    return {
        user: {
            id: "demo-admin-003",
            name: "Demo Admin",
            email: "demo@empresa.com",
            role: "SUPER_ADMIN",
            area: null,
            assignedAreas: []
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    } as any
}
