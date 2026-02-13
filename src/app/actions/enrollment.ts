"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function enrollInCourse(courseId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        // Check if already enrolled
        const existing = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: courseId
                }
            }
        })

        if (existing) {
            return { success: true, message: "Ya estás inscrito en este curso." }
        }

        // Create Enrollment
        await prisma.enrollment.create({
            data: {
                userId: session.user.id,
                courseId: courseId,
                status: 'ACTIVE',
                progress: 0,
                startedAt: new Date()
            }
        })

        revalidatePath("/catalog")
        revalidatePath("/dashboard")
        return { success: true, message: "Inscripción exitosa" }
    } catch (error) {
        console.error("Enrollment Error:", error)
        return { error: "Error al inscribirse" }
    }
}
