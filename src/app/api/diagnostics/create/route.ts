
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const questionSchema = z.object({
    question: z.string().min(1),
    type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SCALE_1_5', 'OPEN_TEXT']),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().optional(),
    points: z.number().default(1),
    order: z.number()
})

const createDiagnosticSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    category: z.string(),
    published: z.boolean(),
    questions: z.array(questionSchema).min(1)
})

export async function POST(req: Request) {
    const session = await auth()

    // Check if super admin
    if (session?.user?.role !== 'SUPER_ADMIN') {
        return new NextResponse("Unauthorized", { status: 403 })
    }

    try {
        const body = await req.json()
        const validatedData = createDiagnosticSchema.parse(body)

        // Transaction to create diagnostic and questions
        const diagnostic = await prisma.$transaction(async (tx) => {
            const newDiagnostic = await tx.diagnostic.create({
                data: {
                    title: validatedData.title,
                    description: validatedData.description,
                    category: validatedData.category,
                    published: validatedData.published
                }
            })

            // Create questions linked to diagnostic
            for (const q of validatedData.questions) {
                await tx.diagnosticQuestion.create({
                    data: {
                        diagnosticId: newDiagnostic.id,
                        question: q.question,
                        type: q.type,
                        options: q.options ? JSON.stringify(q.options) : '[]',
                        correctAnswer: q.correctAnswer,
                        points: q.points,
                        order: q.order
                    }
                })
            }

            return newDiagnostic
        })

        return NextResponse.json({ success: true, id: diagnostic.id })

    } catch (error: any) {
        console.error("[CREATE_DIAGNOSTIC]", error)
        if (error instanceof z.ZodError) {
            return new NextResponse("Datos inválidos: " + JSON.stringify(error.issues), { status: 400 })
        }
        return new NextResponse(error.message || "Error Interno del Servidor", { status: 500 })
    }
}
