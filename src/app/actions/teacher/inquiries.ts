"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getTeacherInquiries() {
    const session = await auth()
    if (!session?.user?.id) return []

    try {
        const inquiries = await prisma.inquiry.findMany({
            where: {
                course: {
                    teacherId: session.user.id
                }
            },
            include: {
                student: {
                    select: {
                        name: true,
                        avatar: true
                    }
                },
                course: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return inquiries
    } catch (error) {
        console.error("Error fetching teacher inquiries:", error)
        return []
    }
}

export async function answerInquiry(id: string, answer: string) {
    try {
        await prisma.inquiry.update({
            where: { id },
            data: {
                answer,
                status: 'ANSWERED',
                updatedAt: new Date()
            }
        })
        revalidatePath("/teacher")
        return { success: true }
    } catch (error) {
        console.error("Error answering inquiry:", error)
        return { success: false }
    }
}
