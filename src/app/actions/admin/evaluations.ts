"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { startOfDay, endOfDay } from "date-fns"

interface AdminStatsFilters {
    courseId?: string | "all"
    startDate?: Date
    endDate?: Date
}

export async function getAdminEvaluationStats(filters?: AdminStatsFilters) {
    const session = await auth()
    if (!session?.user?.id || (session.user.role !== 'ADMINISTRADOR' && session.user.role !== 'SUPER_ADMIN')) {
        return null
    }

    const whereClause: any = {}

    // Filter by Date Range
    if (filters?.startDate || filters?.endDate) {
        whereClause.submittedAt = {}
        if (filters.startDate) whereClause.submittedAt.gte = startOfDay(filters.startDate)
        if (filters.endDate) whereClause.submittedAt.lte = endOfDay(filters.endDate)
    }

    // Filter by Course (Indirectly via Evaluation)
    if (filters?.courseId && filters.courseId !== 'all') {
        whereClause.evaluation = {
            OR: [
                { courseId: filters.courseId },
                { lesson: { module: { courseId: filters.courseId } } }
            ]
        }
    }

    try {
        const submissions = await prisma.evaluationSubmission.findMany({
            where: whereClause,
            include: {
                evaluation: {
                    select: {
                        id: true,
                        title: true,
                        course: { select: { id: true, title: true } },
                        lesson: { select: { id: true, title: true, module: { select: { course: { select: { id: true, title: true } } } } } }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            }
        })

        // -- KPI Calculations --
        const totalSubmissions = submissions.length
        const totalPassed = submissions.filter(s => s.passed).length
        const totalFailed = submissions.filter(s => !s.passed && s.reviewedBy).length // Explicitly reviewed/graded as failed
        const totalPending = submissions.filter(s => !s.reviewedBy).length // Pending manual review (or auto-graded but logic usually marks reviewedBy for auto? Assuming 'reviewedBy' is trigger for 'finished')
        // Actually, for auto-graded quizzes, reviewedBy might be null but status is 'completed'. 
        // Let's assume 'pending' is only for those needing manual review opacity.
        // For simplicity: Pending = !reviewedBy. Passed = passed. Failed = !passed assigned.

        const avgScore = totalSubmissions > 0
            ? Math.round(submissions.reduce((acc, curr) => acc + curr.percentage, 0) / totalSubmissions)
            : 0

        const approvalRate = totalSubmissions > 0
            ? Math.round((totalPassed / totalSubmissions) * 100)
            : 0

        // -- Chart Data: Pass Rate by Course --
        const courseMap = new Map<string, { name: string, total: number, passed: number }>()

        submissions.forEach(sub => {
            const courseTitle = sub.evaluation.course?.title || sub.evaluation.lesson?.module?.course?.title || "Sin Curso"

            if (!courseMap.has(courseTitle)) {
                courseMap.set(courseTitle, { name: courseTitle, total: 0, passed: 0 })
            }
            const stat = courseMap.get(courseTitle)!
            stat.total++
            if (sub.passed) stat.passed++
        })

        const chartData = Array.from(courseMap.values()).map(stat => ({
            name: stat.name,
            passRate: Math.round((stat.passed / stat.total) * 100),
            total: stat.total
        }))

        // -- Struggling Students (< 60% Avg) --
        const studentMap = new Map<string, { user: any, totalScore: number, count: number, failedCount: number }>()

        submissions.forEach(sub => {
            const userId = sub.user.id
            if (!studentMap.has(userId)) {
                studentMap.set(userId, { user: sub.user, totalScore: 0, count: 0, failedCount: 0 })
            }
            const student = studentMap.get(userId)!
            student.totalScore += sub.percentage
            student.count++
            if (!sub.passed && sub.reviewedBy) student.failedCount++
        })

        const strugglingStudents = Array.from(studentMap.values())
            .map(s => ({
                user: s.user,
                avgScore: Math.round(s.totalScore / s.count),
                evaluationsTaken: s.count,
                failedCount: s.failedCount
            }))
            .filter(s => s.avgScore < 60)
            .sort((a, b) => a.avgScore - b.avgScore) // Lowest first


        return {
            kpis: {
                totalSubmissions,
                approvalRate,
                totalFailed,
                totalPending,
                avgScore
            },
            chartData,
            strugglingStudents
        }

    } catch (error) {
        console.error("Error fetching admin stats:", error)
        return null
    }
}
