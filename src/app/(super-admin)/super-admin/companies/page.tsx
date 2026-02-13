import { getAllCompanies } from "@/app/actions/super-admin/companies"
import { CompaniesList } from "@/components/super-admin/companies/companies-list"

export default async function SuperAdminCompaniesPage() {
    const companies = await getAllCompanies()

    return <CompaniesList initialCompanies={companies as any} />
}
