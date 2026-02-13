import { getCertificate } from "@/app/actions/certificates"
import { CertificateTemplate } from "@/components/certificates/certificate-template"
import { Button } from "@/components/ui/button"
import { Printer, ChevronLeft, Download } from "lucide-react"
import Link from "next/link"
import { PrintButton } from "@/components/certificates/print-button"

interface PageProps {
    params: {
        id: string
    }
}

export default async function CertificateViewPage({ params }: PageProps) {
    const res = await getCertificate(params.id)

    if (!res.success || !res.certificate) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <h1 className="text-2xl font-bold text-red-500">Certificado no encontrado</h1>
                <Button asChild><Link href="/certificates">Volver</Link></Button>
            </div>
        )
    }

    const { certificate } = res

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            {/* Navbar (Hidden on Print) */}
            <header className="bg-white border-b p-4 flex justify-between items-center print:hidden sticky top-0 z-50 shadow-sm">
                <Button variant="ghost" asChild>
                    <Link href="/certificates" className="gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        Volver a mis certificados
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <PrintButton />
                </div>
            </header>

            {/* Main Preview Area */}
            <main className="flex-1 p-8 flex items-center justify-center overflow-auto print:p-0 print:overflow-hidden">
                <CertificateTemplate
                    studentName={certificate.user?.name || "Estudiante"}
                    courseName={certificate.course.title}
                    courseDuration={certificate.course.duration || 40}
                    issueDate={certificate.issuedAt}
                    code={certificate.code}
                />
            </main>
        </div>
    )
}
