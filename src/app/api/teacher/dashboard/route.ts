
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

        // 1. Assigned Courses
        const coursesCount = await prisma.course.count({
            where: { teacherId }
        })

        // 2. Total Students (Distinct users enrolled in teacher's courses)
        // Prisma doesn't support distinct count across relation easily in one go for sqlite sometimes, 
        // but we can count enrollments where course.teacherId is teacherId.
        // Actually unique students is better.
        const students = await prisma.enrollment.findMany({
            where: {
                course: { teacherId }
            },
            distinct: ['userId'],
            select: { userId: true }
        })
        const studentCount = students.length

        // 3. Pending Evaluations
        // Submissions for evaluations in teacher's courses that haven't been reviewed
        const pendingEvaluations = await prisma.evaluationSubmission.count({
            where: {
                evaluation: {
                    course: { teacherId }
                },
                reviewedAt: null
            }
        })

        // 4. Pending Inquiries
        // Inquiries for teacher's courses that are PENDING
        const pendingInquiries = await prisma.inquiry.count({
            where: {
                course: { teacherId },
                status: "PENDING"
            }
        })

        return NextResponse.json({
            coursesCount,
            studentCount,
            pendingEvaluations,
            pendingInquiries
        })

    } catch (error) {
        console.error("[TEACHER_DASHBOARD_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
