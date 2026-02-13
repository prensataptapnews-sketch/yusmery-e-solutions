
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string; sid: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id, sid } = await params

        const submission = await prisma.evaluationSubmission.findUnique({
            where: { id: sid },
            include: {
                evaluation: {
                    include: {
                        questions: true
                    }
                }
            }
        })

        if (!submission) {
            return new NextResponse("Submission not found", { status: 404 })
        }

        // Security check: ensure the submission belongs to the user
        if (submission.userId !== session.user.id && session.user.role === "COLABORADOR") {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        return NextResponse.json(submission)

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}
