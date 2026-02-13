import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { InquiryCenter } from "@/components/dashboard/premium/inquiry-center"

export default async function TutorPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const inquiries = await prisma.inquiry.findMany({
        where: { studentId: session.user.id },
        include: {
            teacher: true,
            course: true
        },
        orderBy: { updatedAt: 'desc' }
    })

    const courses = await prisma.enrollment.findMany({
        where: { userId: session.user.id },
        include: { course: true }
    }).then(enrollments => enrollments.map(e => e.course))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">TutorHub: Centro de Consultas</h1>
                <p className="text-muted-foreground">Resuelve tus dudas con tus instructores expertos</p>
            </div>

            <InquiryCenter initialInquiries={inquiries} courses={courses} />
        </div>
    )
}
