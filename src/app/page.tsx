import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesGrid } from "@/components/landing/features-grid"
import { CompaniesSection } from "@/components/landing/companies-section"
import { SolutionsSection } from "@/components/landing/solutions-section"
import { ProgramsPreview } from "@/components/landing/programs-preview"
import { ContactSection } from "@/components/landing/contact-section"
import { Footer } from "@/components/landing/footer"

export default async function RootPage() {
    const session = await auth()

    // If logged in, redirect to appropriate dashboard
    if (session) {
        switch (session.user?.role) {
            case 'SUPER_ADMIN':
                redirect('/super-admin')
            case 'ADMINISTRADOR':
                redirect('/admin')
            case 'PROFESOR':
                redirect('/teacher')
            case 'COLABORADOR':
                redirect('/dashboard')
            default:
                redirect('/dashboard')
        }
    }

    // If NOT logged in, render the Landing Page
    return (
        <main className="min-h-screen bg-slate-50 font-sans selection:bg-slate-900 selection:text-white">
            <Navbar />
            <HeroSection />
            <CompaniesSection />
            <SolutionsSection />
            <FeaturesGrid />
            <ProgramsPreview />
            <ContactSection />
            <Footer />
        </main>
    )
}
