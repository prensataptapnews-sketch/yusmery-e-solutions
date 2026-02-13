import { notFound } from "next/navigation"
import { getCompanyDetails } from "@/app/actions/super-admin/companies"
import { CompanyDetailsView } from "@/components/super-admin/companies/company-details-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const company = await getCompanyDetails(id)

    if (!company) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/super-admin/companies">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
                    <p className="text-muted-foreground">Gestión de empresa y usuarios</p>
                </div>
            </div>

            <CompanyDetailsView company={company} />
        </div>
    )
}
