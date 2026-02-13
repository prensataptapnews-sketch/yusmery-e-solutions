"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { compareAnswers, QuestionType } from "@/lib/compare-answers"

export async function getEvaluationForTaking(evaluationId: string) {
    const session = await auth()
    if (!session?.user?.id) return null

    // Fetch Evaluation with Questions
    const evaluation = await prisma.evaluation.findUnique({
        where: { id: evaluationId },
        include: {
            questions: {
                orderBy: { order: 'asc' }
            }
        }
    })

    if (!evaluation || !evaluation.published) return null

    // Check Attempts
    const attemptsCount = await prisma.evaluationSubmission.count({
        where: {
            userId: session.user.id,
            evaluationId: evaluationId
        }
    })

    if (attemptsCount >= evaluation.attempts) {
        return { error: "Max attempts reached", attemptsCount, maxAttempts: evaluation.attempts }
    }

    // Sanitize Questions (Remove correct answers)
    const sanitizedQuestions = evaluation.questions.map(q => ({
        id: q.id,
        question: q.question,
        type: q.type,
        options: q.options, // Client needs options
        points: q.points,
        // OMIT correctAnswer and explanation (security)
    }))

    return {
        ...evaluation,
        questions: sanitizedQuestions,
        attemptsCount
    }
}

export async function submitEvaluation(evaluationId: string, answers: Record<string, any>) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    // 1. Fetch Full Evaluation (Source of Truth)
    const evaluation = await prisma.evaluation.findUnique({
        where: { id: evaluationId },
        include: { questions: true }
    })

    if (!evaluation) return { error: "Evaluation not found" }

    // 2. Determine Attempt Number
    const attemptsCount = await prisma.evaluationSubmission.count({
        where: { userId: session.user.id, evaluationId: evaluationId }
    })

    if (attemptsCount >= evaluation.attempts) {
        return { error: "Max attempts reached" }
    }

    // 3. Grade Answers
    let score = 0
    let maxScore = 0

    // Store processed answers for DB (we might want to store validity too, but for now just raw answers)
    // Actually, let's just store the JSON as passed.

    evaluation.questions.forEach(q => {
        maxScore += q.points
        const userAnswer = answers[q.id]

        // Use helper for comparison
        const isCorrect = compareAnswers(userAnswer, q.correctAnswer, q.type as QuestionType)

        if (isCorrect) {
            score += q.points
        }
    })

    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
    const passed = percentage >= evaluation.passingScore

    // 4. Save Submission
    const submission = await prisma.evaluationSubmission.create({
        data: {
            evaluationId,
            userId: session.user.id,
            answers: JSON.stringify(answers),
            score,
            maxScore,
            percentage,
            passed,
            attempt: attemptsCount + 1,
            // reviewedBy is null unless auto-graded implies reviewed? 
            // Usually simpler to leave null so teacher sees it in "Pending" list if they want to review manually, 
            // OR if it's purely auto-graded, we could mark reviewedBy SYSTEM.
            // For this system, let's leave it null so it shows up in Teacher Dashboard as a submission they CAN review.
            // But if it's passed, maybe they don't look.
        }
    })

    return {
        success: true,
        submissionId: submission.id,
        score,
        maxScore,
        percentage,
        passed
    }
}
