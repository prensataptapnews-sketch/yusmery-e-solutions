
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Seeding evaluation...")

    // Ensure we have a course and lesson (optional, but good for foreign keys if we enforced them strictly, 
    // but Evaluation model has optional lessonId/courseId or we can just create one)
    // For 'eval-1', we just need the ID to match what's in the mock data.

    const evaluation = await prisma.evaluation.upsert({
        where: { id: "eval-1" },
        update: {},
        create: {
            id: "eval-1",
            title: "Quiz: Protección de Datos",
            description: "Demuestra lo aprendido sobre seguridad de la información.",
            type: "QUIZ",
            passingScore: 80,
            attempts: 3,
            timeLimit: 10,
            published: true,
            questions: {
                create: [
                    {
                        question: "¿Qué es el GDPR?",
                        type: "MULTIPLE_CHOICE", // Using Enum string
                        options: JSON.stringify([
                            { id: "a", text: "General Data Protection Regulation" },
                            { id: "b", text: "Global Data Protocol Rule" },
                            { id: "c", text: "Google Data Private Route" }
                        ]),
                        correctAnswer: "a", // Simple matching for now
                        points: 10,
                        order: 1
                    },
                    {
                        question: "Es seguro compartir contraseñas por email.",
                        type: "TRUE_FALSE",
                        options: JSON.stringify([
                            { id: "true", text: "Verdadero" },
                            { id: "false", text: "Falso" }
                        ]),
                        correctAnswer: "false",
                        points: 10,
                        order: 2
                    }
                ]
            }
        }
    })

    console.log("Seeded evaluation:", evaluation)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
