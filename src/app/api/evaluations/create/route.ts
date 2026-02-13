import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMINISTRADOR')) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const data = await req.json()
        const { title, description, type, passingScore, attempts, timeLimit, published, courseId, lessonId, questions } = data

        if (!title || !questions || questions.length === 0) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Create Evaluation with Nested Questions
        const evaluation = await prisma.evaluation.create({
            data: {
                title,
                description,
                type,
                passingScore,
                attempts,
                timeLimit,
                published,
                courseId: courseId || null,
                lessonId: lessonId || null,
                questions: {
                    create: questions.map((q: any) => ({
                        question: q.question,
                        type: q.type,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation || null,
                        points: q.points,
                        order: q.order
                    }))
                }
            }
        })

        return NextResponse.json(evaluation)
    } catch (error) {
        console.error("[EVALUATION_CREATE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
