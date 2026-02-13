
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

        const submissions = await prisma.evaluationSubmission.findMany({
            where: {
                evaluation: {
                    course: { teacherId }
                },
                reviewedAt: null // Only pending reviews
                // Alternatively, fetch all and filter client side, but performant is reviewedAt: null
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true, avatar: true }
                },
                evaluation: {
                    select: { id: true, title: true, type: true, course: { select: { title: true } } }
                }
            },
            orderBy: { submittedAt: 'desc' }
        })

        return NextResponse.json(submissions)

    } catch (error) {
        console.error("[TEACHER_EVALUATIONS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
