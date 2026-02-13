
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DiagnosticRunner } from "@/components/diagnostics/diagnostic-runner"
import { notFound, redirect } from "next/navigation"

export default async function DiagnosticPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) return redirect('/login')

    const diagnostic = await prisma.diagnostic.findUnique({
        where: { id },
        include: {
            questions: {
                orderBy: { order: 'asc' }
            },
            results: {
                where: { userId: session.user.id }
            }
        }
    })

    if (!diagnostic || !diagnostic.published) {
        return notFound()
    }

    // If already taken, redirect to results
    if (diagnostic.results.length > 0) {
        return redirect(`/diagnosticos/${id}/resultado`)
    }

    return (
        <div className="min-h-screen bg-muted/5">
            <header className="bg-white border-b py-6">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold">{diagnostic.title}</h1>
                </div>
            </header>

            <DiagnosticRunner diagnostic={diagnostic} />
        </div>
    )
}
