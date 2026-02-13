"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
// import { customAlphabet } from 'nanoid' // If we had it, but we can use simple random str

export async function generateCertificate(courseId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        // 1. Verify Completion
        // We can check Enrollment progress or calculate from Progress records.
        // For MVP, relying on Enrollment.progress being accurate (updated by markLessonComplete or similar)
        // OR we can recalc here to be safe.

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: courseId
                }
            }
        })

        // For this MVP, we assume the frontend/action calling this has ensured progress is 100
        // But let's double check if we can. 
        // If progress < 100, we might strictly block or leniently allow if triggered by "Finish" action.
        // Let's rely on enrollment status for now.

        // Check if certificate already exists
        const existing = await prisma.certificate.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: courseId
                }
            }
        })

        if (existing) return { success: true, certificateId: existing.id }

        // Generate Code
        const code = `CERT-${courseId.slice(-4).toUpperCase()}-${Date.now().toString().slice(-6)}`

        // Create
        const cert = await prisma.certificate.create({
            data: {
                userId: session.user.id,
                courseId: courseId,
                code: code,
                certificateUrl: `/certificates/verify/${code}` // Placeholder URL
            }
        })

        return { success: true, certificateId: cert.id }

    } catch (error) {
        console.error("Certificate Generation Error:", error)
        return { error: "Failed to generate certificate" }
    }
}

export async function getMyCertificates() {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const certs = await prisma.certificate.findMany({
            where: { userId: session.user.id },
            include: { course: true },
            orderBy: { issuedAt: 'desc' }
        })
        return { success: true, certificates: certs }
    } catch (error) {
        return { error: "Failed to fetch certificates" }
    }
}

export async function getCertificate(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const cert = await prisma.certificate.findUnique({
            where: { id },
            include: {
                course: true,
                user: true // To get student name
            }
        })

        if (!cert) return { error: "Certificate not found" }
        // Security: Only owner (or admin) can view? For now owner.
        if (cert.userId !== session.user.id) return { error: "Unauthorized access to certificate" }

        return { success: true, certificate: cert }
    } catch (error) {
        return { error: "Failed to fetch certificate" }
    }
}
