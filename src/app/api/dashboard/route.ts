import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // 1. Fetch Comprehension Stats (Existing Logic)
        const submissions = await prisma.evaluationSubmission.findMany({
            where: { userId: session.user.id },
            orderBy: { submittedAt: 'asc' },
            include: { evaluation: { select: { title: true } } }
        })

        const totalEvaluations = submissions.length
        const totalScore = submissions.reduce((acc, curr) => acc + curr.percentage, 0)
        const averageScore = totalEvaluations > 0 ? Math.round(totalScore / totalEvaluations) : 0
        const highestScore = totalEvaluations > 0 ? Math.max(...submissions.map(s => s.percentage)) : 0

        const history = submissions.map(s => ({
            date: s.submittedAt.toISOString(),
            score: s.percentage,
            passed: s.passed,
            title: s.evaluation.title
        }))

        // 2. Fetch Real Enrolled Courses
        const enrollments = await prisma.enrollment.findMany({
            where: { userId: session.user.id, status: 'ACTIVE' },
            include: { course: true },
            orderBy: { updatedAt: 'desc' } // Most recently accessed first
        })

        // Map data for Dashboard UI
        const currentEnrollment = enrollments[0]
        const currentCourse = currentEnrollment ? {
            id: currentEnrollment.course.id,
            title: currentEnrollment.course.title,
            slug: currentEnrollment.course.slug,
            progress: Math.round(currentEnrollment.progress),
            thumbnail: currentEnrollment.course.thumbnail
        } : null

        const otherCourses = enrollments.slice(1).map(e => ({
            id: e.course.id,
            title: e.course.title,
            thumbnail: e.course.thumbnail,
            duration: e.course.duration,
            slug: e.course.slug,
            category: e.course.category || "General",
            progress: Math.round(e.progress)
        }))

        // Calculate Stats
        const completedCourses = await prisma.enrollment.count({
            where: { userId: session.user.id, progress: 100 }
        })
        const totalEnrollments = enrollments.length + completedCourses // Approximated total

        const totalProgress = enrollments.reduce((acc, curr) => acc + curr.progress, 0)
        const avgProgress = enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0

        const dashboardData = {
            currentCourse, // Can be null if no active courses
            courses: otherCourses,
            stats: {
                totalCourses: totalEnrollments,
                completed: completedCourses,
                avgProgress
            },
            comprehension: {
                totalEvaluations,
                averageScore,
                highestScore,
                history
            }
        }

        return NextResponse.json(dashboardData)

    } catch (error) {
        console.error("Dashboard API Error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
