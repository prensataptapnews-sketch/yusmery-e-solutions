"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const companySchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    plan: z.string().optional(),
    status: z.string().optional(),
    adminEmail: z.string().email().optional().or(z.literal("")),
})

export async function getCompanyDetails(id: string) {
    try {
        const company = await prisma.company.findUnique({
            where: { id },
            include: {
                users: {
                    orderBy: { name: 'asc' }
                },
                courses: {
                    orderBy: { title: 'asc' },
                    include: {
                        _count: {
                            select: { enrollments: true }
                        }
                    }
                },
                _count: {
                    select: {
                        users: true,
                        courses: true
                    }
                }
            }
        })
        return company
    } catch (error) {
        console.error("Error fetching company details:", error)
        return null
    }
}

export async function updateCompany(id: string, data: z.infer<typeof companySchema>) {
    try {
        await prisma.company.update({
            where: { id },
            data
        })
        revalidatePath(`/super-admin/companies/${id}`)
        return { success: true }
    } catch (error) {
        console.error("Error updating company:", error)
        return { success: false, error: "Failed to update company" }
    }
}

export async function getAllCompanies() {
    try {
        const companies = await prisma.company.findMany({
            include: {
                _count: {
                    select: {
                        users: true,
                        courses: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return companies
    } catch (error) {
        console.error("Error fetching all companies:", error)
        return []
    }
}
