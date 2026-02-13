"use server"

import prisma from "@/lib/prisma"

// Rename locally to match existing code structure if needed, or just use prisma
const db = prisma

export async function getDashboardStats() {
    try {
        const [totalCompanies, totalUsers, totalCourses] = await Promise.all([
            db.company.count(),
            db.user.count(),
            db.course.count()
        ])

        // Calculate growth (mock logic for now or real date comparison)
        // Real logic: Count created in last 7 days
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const newCompanies = await db.company.count({
            where: { createdAt: { gte: sevenDaysAgo } }
        })

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const newUsers = await db.user.count({
            where: { createdAt: { gte: thirtyDaysAgo } }
        })

        return {
            totalCompanies,
            newCompanies,
            totalUsers,
            newUsers,
            totalCourses
        }
    } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return {
            totalCompanies: 0,
            newCompanies: 0,
            totalUsers: 0,
            newUsers: 0,
            totalCourses: 0
        }
    }
}
