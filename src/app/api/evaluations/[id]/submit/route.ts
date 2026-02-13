
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

const compareAnswers = (userAnswer: any, correctAnswer: string, type: string) => {
    try {
        let parsedCorrect: any = correctAnswer

        // Try parsing JSON if it looks like one
        if (typeof correctAnswer === 'string' && (correctAnswer.startsWith('"') || correctAnswer.startsWith('['))) {
            try {
                parsedCorrect = JSON.parse(correctAnswer)
            } catch {
                parsedCorrect = correctAnswer
            }
        }

        // Normalize string answers
        if (typeof userAnswer === 'string') userAnswer = userAnswer.trim()
        if (typeof parsedCorrect === 'string') parsedCorrect = parsedCorrect.trim()

        // Comparison logic based on type
        if (type === "MULTIPLE_CHOICE" || type === "TRUE_FALSE") {
            return JSON.stringify(userAnswer) === JSON.stringify(parsedCorrect)
        }

        // For open text, we might need manual review or lenient matching
        // For now, strict match or simple inclusion
        if (type === "OPEN_TEXT") {
            // Primitive check: if correct answer is in user answer (lenient)
            // or identical
            return String(userAnswer).toLowerCase().trim() === String(parsedCorrect).toLowerCase().trim()
        }

        return userAnswer == parsedCorrect
    } catch (e) {
        console.error("Error comparing answers:", e)
        return false
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        const { id } = await params
        const body = await request.json()
        const { answers } = body

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // 1. Fetch Evaluation with Questions (including correct answer)
        const evaluation = await prisma.evaluation.findUnique({
            where: { id },
            include: {
                questions: true
            }
        })

        if (!evaluation) {
            return new NextResponse("Evaluation not found", { status: 404 })
        }

        // 2. Validate Attempts
        const submissionsCount = await prisma.evaluationSubmission.count({
            where: {
                evaluationId: id,
                userId: session.user.id
            }
        })

        if (submissionsCount >= evaluation.attempts) {
            return NextResponse.json({ error: "Sin intentos restantes" }, { status: 403 })
        }

        // 3. Calculate Score
        let score = 0
        const maxScore = evaluation.questions.reduce((sum, q) => sum + q.points, 0)
        const review = []

        for (const question of evaluation.questions) {
            const userAnswer = answers[question.id]
            const isCorrect = compareAnswers(userAnswer, question.correctAnswer, question.type)

            if (isCorrect) {
                score += question.points
            }

            review.push({
                questionId: question.id,
                question: question.question,
                userAnswer,
                correctAnswer: question.correctAnswer, // Warning: exposing correct answer to frontend in result
                isCorrect,
                explanation: question.explanation,
                points: isCorrect ? question.points : 0
            })
        }

        const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
        const passed = percentage >= evaluation.passingScore

        // 4. Save Submission
        const submission = await prisma.evaluationSubmission.create({
            data: {
                evaluationId: id,
                userId: session.user.id,
                answers: JSON.stringify(answers),
                score,
                maxScore,
                percentage,
                passed,
                attempt: submissionsCount + 1
            }
        })

        // 5. Update Progress if Passed and Linked to Lesson
        if (passed && evaluation.lessonId) {
            await prisma.progress.upsert({
                where: {
                    userId_lessonId: {
                        userId: session.user.id,
                        lessonId: evaluation.lessonId
                    }
                },
                update: { completed: true, completedAt: new Date() },
                create: {
                    userId: session.user.id,
                    lessonId: evaluation.lessonId,
                    completed: true,
                    completedAt: new Date()
                }
            })
        }

        return NextResponse.json({
            submissionId: submission.id,
            score,
            maxScore,
            percentage,
            passed,
            passingScore: evaluation.passingScore,
            attempt: submissionsCount + 1,
            attemptsLeft: evaluation.attempts - (submissionsCount + 1),
            review
        })

    } catch (error) {
        console.error("[EVALUATION_SUBMIT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
