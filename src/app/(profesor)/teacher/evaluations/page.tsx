import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTeacherSubmissions, getTeacherCourses } from "@/app/actions/teacher/evaluations"
import { EvaluationsFilter } from "@/components/teacher/evaluations/evaluations-filter"
import { SubmissionCard } from "@/components/teacher/evaluations/submission-card"
import { ClipboardList } from "lucide-react"

export default async function TeacherEvaluationsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'PROFESOR' && session.user.role !== 'ADMINISTRADOR' && session.user.role !== 'SUPER_ADMIN')) {
        redirect("/login")
    }

    const courseId = typeof searchParams.courseId === 'string' ? searchParams.courseId : undefined
    const type = typeof searchParams.type === 'string' ? searchParams.type : undefined
    const status = typeof searchParams.status === 'string' ? searchParams.status : undefined

    const [submissions, courses] = await Promise.all([
        getTeacherSubmissions({ courseId, type, status }),
        getTeacherCourses()
    ])

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Evaluaciones de Alumnos</h1>
                <p className="text-muted-foreground">Revisa y califica las entregas pendientes de tus cursos.</p>
            </div>

            <EvaluationsFilter courses={courses} />

            {submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg bg-muted/10">
                    <div className="p-4 bg-muted rounded-full mb-4">
                        <ClipboardList className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No hay evaluaciones pendientes</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-sm mt-2">
                        No se encontraron entregas que coincidan con los filtros seleccionados, o tus alumnos aún no han enviado nada.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {submissions.map((submission) => (
                        <SubmissionCard key={submission.id} submission={submission} />
                    ))}
                </div>
            )}
        </div>
    )
}
