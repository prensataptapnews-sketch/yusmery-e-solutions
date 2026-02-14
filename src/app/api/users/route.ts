import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["STUDENT", "PROFESOR", "ADMINISTRADOR", "SUPER_ADMIN", "COLABORADOR", "COMPANY_ADMIN"]),
    department: z.string().optional(),
    companyId: z.string().optional(),
})

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || "ALL"
    const department = searchParams.get("department") || "ALL"

    try {
        const skip = (page - 1) * limit
        const where: any = { isActive: true }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ]
        }
        if (role !== "ALL") where.role = role
        if (department !== "ALL") where.department = department

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

        const formattedUsers = users.map(u => {
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
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Input Validation (Zod)
        const validation = userSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json({ error: "Invalid input", details: validation.error.format() }, { status: 400 })
        }

        const { name, email, password, role, department, companyId } = validation.data

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 })
        }

        // Password Hashing (Bcrypt)
        const hashedPassword = await bcrypt.hash(password, 10)

        // Whitelisted creation
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                department,
                companyId,
                isActive: true
            },
            select: { // Don't return password
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                isActive: true,
                createdAt: true
            }
        })

        return NextResponse.json(newUser, { status: 201 })
    } catch (error) {
        console.error("[USERS_POST_ERROR]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
