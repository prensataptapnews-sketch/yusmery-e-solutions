
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const calculateLevel = (percentage: number) => {
    if (percentage >= 85) return 'EXPERTO'
    if (percentage >= 70) return 'AVANZADO'
    if (percentage >= 50) return 'INTERMEDIO'
    return 'BASICO'
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await req.json()
        const { answers } = body

        // Fetch diagnostic with questions and correct answers
        const diagnostic = await prisma.diagnostic.findUnique({
            where: { id },
            include: {
                questions: true
            }
        })

        if (!diagnostic) {
            return new NextResponse("Diagnostic not found", { status: 404 })
        }

        let score = 0
        let maxScore = 0

        diagnostic.questions.forEach((question) => {
            // Only grade if it has a correct answer and points
            if (question.correctAnswer && question.points > 0) {
                maxScore += question.points

                const userAnswer = answers[question.id]
                // Simple string comparison for now. 
                // For arrays (multiple choice multiple select), could need more logic.
                // Assuming single correct answer for simplicity as per requirements.
                if (String(userAnswer) === String(question.correctAnswer)) {
                    score += question.points
                }
            }
        })

        const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
        const level = calculateLevel(percentage)

        // Save Result
        const result = await prisma.diagnosticResult.upsert({
            where: {
                userId_diagnosticId: {
                    userId: session.user.id,
                    diagnosticId: id
                }
            },
            update: {
                score,
                maxScore,
                level,
                answers: JSON.stringify(answers),
                completedAt: new Date()
            },
            create: {
                userId: session.user.id,
                diagnosticId: id,
                score,
                maxScore,
                level,
                answers: JSON.stringify(answers)
            }
        })

        // TODO: Update User profile with new level for this category if needed?
        // For now, valid result is stored.

        return NextResponse.json({
            score,
            maxScore,
            percentage,
            level,
            resultId: result.id
        })

    } catch (error) {
        console.error("[DIAGNOSTIC_SUBMIT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
