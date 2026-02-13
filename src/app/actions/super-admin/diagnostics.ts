"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

// Helper to check perm
async function checkSuperAdmin() {
    const session = await auth()
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized")
    }
}

export async function toggleDiagnosticStatus(id: string, published: boolean) {
    await checkSuperAdmin()
    try {
        await prisma.diagnostic.update({
            where: { id },
            data: { published }
        })
        revalidatePath("/super-admin/diagnosticos")
        return { success: true }
    } catch (e) {
        return { success: false, error: "Failed to update status" }
    }
}

export async function duplicateDiagnostic(id: string) {
    await checkSuperAdmin()
    try {
        const original = await prisma.diagnostic.findUnique({
            where: { id },
            include: { questions: true }
        })

        if (!original) throw new Error("Not found")

        await prisma.diagnostic.create({
            data: {
                title: `${original.title} (Copia)`,
                description: original.description,
                category: original.category,
                published: false, // Draft by default
                questions: {
                    create: original.questions.map(q => ({
                        question: q.question,
                        type: q.type,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        points: q.points,
                        order: q.order
                    }))
                }
            }
        })
        revalidatePath("/super-admin/diagnosticos")
        return { success: true }
    } catch (e) {
        return { success: false, error: "Failed to duplicate" }
    }
}

export async function deleteDiagnostic(id: string) {
    await checkSuperAdmin()
    try {
        await prisma.diagnostic.delete({ where: { id } })
        revalidatePath("/super-admin/diagnosticos")
        return { success: true }
    } catch (e) {
        return { success: false, error: "Failed to delete" }
    }
}

export async function deleteBulkDiagnostics(ids: string[]) {
    await checkSuperAdmin()
    try {
        await prisma.diagnostic.deleteMany({
            where: { id: { in: ids } }
        })
        revalidatePath("/super-admin/diagnosticos")
        return { success: true }
    } catch (e) {
        return { success: false, error: "Failed to delete many" }
    }
}
