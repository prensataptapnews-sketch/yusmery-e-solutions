import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getModules, getCompaniesWithModules } from "@/app/actions/super-admin/modules"
import { CompanyModulesManager } from "@/components/super-admin/modules/company-manager"

// Define interface locally
export interface Module {
    key: string
    name: string
    description: string
    status: string
    version: string
    dependencies: string | null
    updatedAt: string
    updatedBy: string | null
}

export default async function SuperAdminModulesPage() {
    const session = await auth();

    if (session?.user?.role !== 'SUPER_ADMIN') {
        redirect("/login");
    }

    let companies: any[] = []
    let modules: Module[] = []

    try {
        const [rawModules, rawCompanies] = await Promise.all([
            getModules(),
            getCompaniesWithModules()
        ])

        if (rawModules && Array.isArray(rawModules)) {
            modules = rawModules.map(m => ({
                ...m,
                updatedAt: m.updatedAt.toISOString(),
                dependencies: m.dependencies
            })) as unknown as Module[]
        }

        companies = rawCompanies || []

    } catch (e) {
        console.error("Failed to fetch data:", e)
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Habilitar Módulos</h1>
                    <p className="text-muted-foreground">Gestión de servicios por empresa.</p>
                </div>
            </div>

            <CompanyModulesManager companies={companies} systemModules={modules} />
        </div>
    )
}

