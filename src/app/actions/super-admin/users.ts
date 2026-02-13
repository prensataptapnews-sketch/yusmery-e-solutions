"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function updateUser(userId: string, data: any) {
    const session = await auth()
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized")
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
                role: data.role,
                company: data.company, // Assuming string storage for simplicity or relation update
                isActive: data.isActive
            }
        })
        revalidatePath("/super-admin/users")
        return { success: true }
    } catch (error) {
        console.error("Failed to update user:", error)
        return { success: false, error: "Failed to update user" }
    }
}

export async function deleteUser(userId: string) {
    const session = await auth()
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized")
    }

    try {
        await prisma.user.delete({
            where: { id: userId }
        })
        revalidatePath("/super-admin/users")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete user:", error)
        return { success: false, error: "Failed to delete user" }
    }
}
