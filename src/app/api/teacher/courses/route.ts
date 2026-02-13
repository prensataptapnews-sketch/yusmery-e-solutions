
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

        const courses = await prisma.course.findMany({
            where: { teacherId },
            include: {
                _count: {
                    select: {
                        enrollments: true,
                        modules: true,
                        inquiries: { where: { status: "PENDING" } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(courses)

    } catch (error) {
        console.error("[TEACHER_COURSES_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
