
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await params

        const submission = await prisma.evaluationSubmission.findUnique({
            where: { id },
            include: {
                evaluation: {
                    include: {
                        questions: true,
                        // Include course to allow "Continue Course" link logic
                        course: {
                            select: { slug: true }
                        }
                    }
                },
                // Include reviewer if we want to show teacher details (though schema stores ID/Name, we might need relation or mock for now)
                // Schema has `reviewedBy` (String) but no relation defined in `EvaluationSubmission` to User for reviewer yet?
                // Checking schema... `reviewedBy` is just String.
                // We can fetch the user manually or just show "Profesor" for now.
            }
        })

        if (!submission) {
            return new NextResponse("Submission not found", { status: 404 })
        }

        if (submission.userId !== session.user.id && session.user.role === "COLABORADOR") {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        return NextResponse.json(submission)

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
