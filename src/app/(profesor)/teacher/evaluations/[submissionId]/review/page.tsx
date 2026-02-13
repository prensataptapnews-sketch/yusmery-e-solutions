import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getSubmissionDetails } from "@/app/actions/teacher/evaluations"
import { ReviewHeader } from "@/components/teacher/evaluations/review-header"
import { AnswerReview } from "@/components/teacher/evaluations/answer-review"
import { FeedbackForm } from "@/components/teacher/evaluations/feedback-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function TeacherReviewPage({ params }: { params: { submissionId: string } }) {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'PROFESOR' && session.user.role !== 'ADMINISTRADOR' && session.user.role !== 'SUPER_ADMIN')) {
        redirect("/login")
    }

    const submission = await getSubmissionDetails(params.submissionId)

    if (!submission) {
        redirect("/teacher/evaluations")
    }

    // Transform submission.evaluation.questions with submission answers
    // Component expects questions array and answers JSON string

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/teacher/evaluations">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Evaluaciones
                    </Link>
                </Button>
            </div>

            <ReviewHeader submission={submission} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <AnswerReview
                        questions={submission.evaluation.questions}
                        studentAnswers={submission.answers}
                    />
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-6 p-6 border rounded-xl bg-card shadow-sm">
                        <FeedbackForm submissionId={submission.id} />
                    </div>
                </div>
            </div>
        </div>
    )
}
