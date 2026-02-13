
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        const { id } = await params

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // 1. Fetch Evaluation with Questions (ordered) and without answers
        const evaluation = await prisma.evaluation.findUnique({
            where: { id },
            include: {
                questions: {
                    orderBy: { order: "asc" },
                    select: {
                        id: true,
                        question: true,
                        type: true,
                        options: true, // JSON string
                        points: true,
                        order: true,
                        // EXCLUDE correctAnswer and explanation
                    }
                }
            }
        })

        if (!evaluation) {
            return new NextResponse("Evaluation not found", { status: 404 })
        }

        // 2. Validate Access (Published or Admin)
        if (!evaluation.published &&
            session.user.role !== "SUPER_ADMIN" &&
            session.user.role !== "ADMINISTRADOR") {
            return new NextResponse("Evaluation not published", { status: 403 })
        }

        // 3. Check Enrollment (if linked to a course)
        if (evaluation.courseId && session.user.role === "COLABORADOR") {
            const enrollment = await prisma.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: session.user.id,
                        courseId: evaluation.courseId
                    }
                }
            })
            if (!enrollment) {
                return new NextResponse("User not enrolled in this course", { status: 403 })
            }
        }

        // 4. Check Attempts using EvaluationSubmission
        const submissionsCount = await prisma.evaluationSubmission.count({
            where: {
                evaluationId: id,
                userId: session.user.id
            }
        })

        if (submissionsCount >= evaluation.attempts) {
            return NextResponse.json({
                error: "Sin intentos restantes",
                attemptsLeft: 0,
                maxAttempts: evaluation.attempts
            }, { status: 403 })
        }

        // 5. Parse JSON options and Return Data
        const parsedEvaluation = {
            ...evaluation,
            questions: evaluation.questions.map(q => {
                let parsedOptions = []
                try {
                    parsedOptions = q.options ? JSON.parse(q.options) : []
                } catch (e) {
                    console.error("Error parsing options for question", q.id, e)
                }
                return {
                    ...q,
                    options: parsedOptions
                }
            })
        }

        return NextResponse.json({
            evaluation: parsedEvaluation,
            attemptsLeft: evaluation.attempts - submissionsCount,
            userAttempts: submissionsCount
        })

    } catch (error) {
        console.error("[EVALUATION_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
