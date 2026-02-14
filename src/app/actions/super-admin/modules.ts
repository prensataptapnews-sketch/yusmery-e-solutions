"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getModules() {
    try {
        const session = await auth()

        // DEBUG LOGGING

        if (session?.user?.role !== 'SUPER_ADMIN') {
            const role = session?.user?.role || 'No Role'
            return []
        }

        const count = await prisma.systemModule.count()

        const modules = await prisma.systemModule.findMany({
            include: {
                overrides: true
            },
            orderBy: { name: 'asc' }
        })

        return modules
    } catch (e) {
        console.error("GET_MODULES ERROR:", e)
        return []
    }
}

export async function toggleModuleStatus(key: string, currentStatus: string) {
    const session = await auth()

    if (session?.user?.role !== 'SUPER_ADMIN') {
        console.error("[TOGGLE_MODULE] Unauthorized access attempt")
        return { success: false, message: "Unauthorized" }
    }

    try {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

        // 1. Dependency Check (Enforce "Original Function" logic)
        if (newStatus === 'ACTIVE') {
            const module = await prisma.systemModule.findUnique({ where: { key } })
            if (module?.dependencies) {
                const deps = JSON.parse(module.dependencies)
                if (Array.isArray(deps) && deps.length > 0) {
                    const requiredModules = await prisma.systemModule.findMany({
                        where: {
                            key: { in: deps },
                            status: { not: 'ACTIVE' }
                        }
                    })

                    if (requiredModules.length > 0) {
                        const missingNames = requiredModules.map(m => m.name).join(", ")
                        return { success: false, message: `No se puede activar. Requiere: ${missingNames}` }
                    }
                }
            }
        }


        const result = await prisma.systemModule.update({
            where: { key },
            data: {
                status: newStatus,
                updatedBy: session.user.id
            }
        })
        revalidatePath("/super-admin/modules")
        return { success: true, message: `Módulo ${newStatus === 'ACTIVE' ? 'activado' : 'desactivado'} exitosamente`, newStatus }
    } catch (error) {
        console.error("[TOGGLE_MODULE] Error:", error)
        return { success: false, message: "Error al actualizar módulo" }
    }
}

export async function setMaintenanceMode(key: string) {
    const session = await auth()
    if (session?.user?.role !== 'SUPER_ADMIN') return { success: false, message: "Unauthorized" }

    try {
        await prisma.systemModule.update({
            where: { key },
            data: { status: "MAINTENANCE", updatedBy: session.user.id }
        })
        revalidatePath("/super-admin/modules")
        return { success: true, message: "Módulo en modo mantenimiento" }
    } catch (error) {
        return { success: false, message: "Error al actualizar" }
    }
}

export async function getAuditLogs(moduleKey: string) {
    // Simulated Audit Logs for Phase 35 requirements
    // In a real app, this would query an AuditLog table
    return []
}

// --- COMPANY MODULE MANAGEMENT (Phase 39) ---

export async function getCompaniesWithModules() {
    const session = await auth()
    if (session?.user?.role !== 'SUPER_ADMIN') return []

    try {
        const companies = await prisma.company.findMany({
            include: {
                moduleOverrides: true
            },
            orderBy: { name: 'asc' }
        })
        return companies
    } catch (error) {
        console.error("Error fetching companies:", error)
        return []
    }
}

export async function toggleCompanyModuleStatus(companyId: string, moduleKey: string, currentStatus: boolean) {
    const session = await auth()
    if (session?.user?.role !== 'SUPER_ADMIN') return { success: false, message: "Unauthorized" }

    try {
        const newStatus = currentStatus ? 'INACTIVE' : 'ACTIVE' // Toggle logic

        await prisma.companyModule.upsert({
            where: {
                companyId_moduleKey: {
                    companyId,
                    moduleKey
                }
            },
            update: {
                status: newStatus
            },
            create: {
                companyId,
                moduleKey,
                status: newStatus
            }
        })

        revalidatePath("/super-admin/modules")
        return { success: true, message: `Módulo ${newStatus === 'ACTIVE' ? 'activado' : 'desactivado'} para la empresa.` }
    } catch (error) {
        console.error("Error toggling company module:", error)
        return { success: false, message: "Error al actualizar módulo de empresa" }
    }
}
