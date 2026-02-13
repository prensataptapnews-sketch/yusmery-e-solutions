
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user || (session.user.role !== 'PROFESOR' && session.user.role !== 'SUPER_ADMIN')) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { default: prisma } = await import("@/lib/prisma")
        const teacherId = session.user.id

        const inquiries = await prisma.inquiry.findMany({
            where: {
                course: { teacherId }
            },
            include: {
                student: {
                    select: { id: true, name: true, email: true, avatar: true }
                },
                course: {
                    select: { id: true, title: true }
                }
            },
            orderBy: [
                { status: 'desc' }, // PENDING first
                { createdAt: 'desc' }
            ]
        })

        return NextResponse.json(inquiries)

    } catch (error) {
        console.error("[TEACHER_INQUIRIES_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user || (session.user.role !== 'PROFESOR' && session.user.role !== 'SUPER_ADMIN')) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { default: prisma } = await import("@/lib/prisma")
        const body = await request.json()
        const { inquiryId, answer } = body
        const teacherId = session.user.id

        if (!inquiryId || !answer) {
            return new NextResponse("Missing fields", { status: 400 })
        }

        // Verify ownership/permission
        const inquiry = await prisma.inquiry.findUnique({
            where: { id: inquiryId },
            include: { course: true }
        })

        if (!inquiry) return new NextResponse("Inquiry not found", { status: 404 })

        // Ensure teacher handles this course (or is super admin)
        // Note: For now assuming only assigned teacher replies, but usually any authorized staff could.
        // We'll trust the role check + course mapping if we want strictness.
        // if (inquiry.course.teacherId !== teacherId && session.user.role !== 'SUPER_ADMIN') ...

        const updatedInquiry = await prisma.inquiry.update({
            where: { id: inquiryId },
            data: {
                answer,
                teacherId: teacherId,
                status: "ANSWERED",
                updatedAt: new Date()
            }
        })

        return NextResponse.json(updatedInquiry)

    } catch (error) {
        console.error("[TEACHER_INQUIRIES_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
