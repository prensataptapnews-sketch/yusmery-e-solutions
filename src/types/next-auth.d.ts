import NextAuth, { DefaultSession } from "next-auth"
import { Role, Area } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: Role
            area?: Area
            assignedAreas?: Area[]
        } & DefaultSession["user"]
    }

    interface User {
        role: Role
        area?: Area
        assignedAreas?: Area[]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: Role
        area?: Area
        assignedAreas?: Area[]
    }
}
