import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const area = searchParams.get("area")
    const modality = searchParams.get("modality")
    const search = searchParams.get("search") || ""

    const session = await auth()
    const userId = session?.user?.id

    try {
        const where: any = { published: true }

        if (area) where.category = area // Assuming 'category' maps to 'area' in UI, or 'level', schema says 'category' exists
        // Wait, schema has `category` but UI generic filters use 'area'. Let's map appropriately or use what we have.
        // Schema: `category`, `level`, `modality`. UI filter uses 'area'.
        // Let's assume UI 'area' maps to `category` in DB for now, or remove filter if not matching.

        if (modality) where.modality = modality
        if (search) where.title = { contains: search }

        const courses = await prisma.course.findMany({
            where,
            include: {
                enrollments: userId ? {
                    where: { userId: userId },
                    select: { progress: true, status: true }
                } : false
            },
            orderBy: { createdAt: 'desc' }
        })

        const mappedCourses = courses.map(course => {
            const enrollment = course.enrollments?.[0]

            // Map 'category' to 'area' for UI compatibility
            return {
                id: course.id,
                title: course.title,
                description: course.description,
                area: course.category || "General",
                modality: course.modality,
                duration: course.duration ? `${course.duration}h` : "N/A",
                image: course.thumbnail || "/images/course-placeholder.jpg",
                progress: enrollment ? enrollment.progress : undefined, // undefined means not enrolled
                isEnrolled: !!enrollment
            }
        })

        return NextResponse.json({
            courses: mappedCourses,
            total: mappedCourses.length
        })

    } catch (error) {
        console.error("Catalog API Error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
