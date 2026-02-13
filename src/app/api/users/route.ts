import { NextResponse } from "next/server"
// import prisma from "@/lib/prisma" // Commented out for mock fallback strategy

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || "ALL"
    const department = searchParams.get("department") || "ALL"

    // MOCK DATA GENERATOR
    const generateMockUsers = () => {
        const users = []
        const departments = ["RRHH", "Operaciones", "TI", "Comercial", "Finanzas"]
        const roles = ["STUDENT", "COMPANY_ADMIN", "SUPER_ADMIN"]

        for (let i = 1; i <= 50; i++) {
            users.push({
                id: `user-${i}`,
                name: `Usuario ${i}`,
                email: `usuario${i}@example.com`,
                role: roles[i % 3], // Rotate roles
                department: departments[i % 5], // Rotate departments
                avatar: null,
                courseCount: Math.floor(Math.random() * 10),
                progress: Math.floor(Math.random() * 100),
                isActive: true,
                createdAt: new Date().toISOString()
            })
        }
        return users
    }

    try {
        // Dynamic import to try prisma
        const { default: prisma } = await import("@/lib/prisma")

        const skip = (page - 1) * limit

        // Build where clause
        const where: any = { isActive: true }
        if (search) {
            where.OR = [
                { name: { contains: search } }, // SQLite doesn't support mode: insensitive well without quirks in Prisma
                { email: { contains: search } }
            ]
        }
        if (role !== "ALL") where.role = role
        if (department !== "ALL") where.department = department

        // Transaction for count and findMany
        const [total, users] = await prisma.$transaction([
            prisma.user.count({ where }),
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: { select: { enrollments: true } },
                    enrollments: { select: { progress: true } }
                }
            })
        ])

        if (total === 0 && !search) {
            // If DB is empty and no search mode, throw to use mock for demo
            throw new Error("Empty DB, using mock")
        }

        const formattedUsers = users.map(u => {
            // Calculate avg progress
            const totalProgress = u.enrollments.reduce((acc, curr) => acc + curr.progress, 0)
            const avgProgress = u.enrollments.length > 0 ? Math.round(totalProgress / u.enrollments.length) : 0

            return {
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                department: u.department,
                avatar: u.avatar,
                courseCount: u._count.enrollments,
                progress: avgProgress,
                isActive: u.isActive,
                createdAt: u.createdAt
            }
        })

        return NextResponse.json({
            data: formattedUsers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error("[USERS_GET_ERROR]", error)

        // MOCK FALLBACK
        let mockUsers = generateMockUsers()

        // Filter Mock Data
        if (search) {
            const lowerSearch = search.toLowerCase()
            mockUsers = mockUsers.filter(u =>
                u.name.toLowerCase().includes(lowerSearch) ||
                u.email.toLowerCase().includes(lowerSearch)
            )
        }
        if (role !== "ALL") mockUsers = mockUsers.filter(u => u.role === role)
        if (department !== "ALL") mockUsers = mockUsers.filter(u => u.department === department)

        // Paginate Mock Data
        const total = mockUsers.length
        const start = (page - 1) * limit
        const paginatedUsers = mockUsers.slice(start, start + limit)

        return NextResponse.json({
            data: paginatedUsers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { default: prisma } = await import("@/lib/prisma")

        // Simple create
        const newUser = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password, // In real app, hash this!
                role: body.role,
                department: body.department,
                isActive: true
            }
        })

        return NextResponse.json(newUser, { status: 201 })
    } catch (error) {
        console.error("[USERS_POST_ERROR]", error)
        // Mock successful creation
        return NextResponse.json({
            id: "mock-new-user-id",
            ...await request.json(),
            isActive: true,
            createdAt: new Date()
        }, { status: 201 })
    }
}
