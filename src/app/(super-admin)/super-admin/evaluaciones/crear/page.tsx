import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { EvaluationBuilder } from "@/components/super-admin/evaluations/evaluation-builder"
import { Separator } from "@/components/ui/separator"

async function getCourses() {
    return await prisma.course.findMany({
        select: { id: true, title: true },
        orderBy: { title: 'asc' }
    })
}

export default async function CreateEvaluationPage() {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMINISTRADOR')) {
        redirect("/login")
    }

    const courses = await getCourses()

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Crear Nueva Evaluación</h1>
                <p className="text-muted-foreground">
                    Configura quizzes, exámenes finales o prácticas y asígnalos a cursos o lecciones.
                </p>
            </div>
            <Separator />

            <EvaluationBuilder courses={courses} />
        </div>
    )
}
