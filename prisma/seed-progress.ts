
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Seeding progress...")

    const user = await prisma.user.findUnique({
        where: { email: "colaborador@empresa.com" }
    })

    if (!user) {
        console.error("Collaborator user not found")
        return
    }

    const lessonIds = ["lec-1", "lec-2", "lec-3"]

    for (const lessonId of lessonIds) {
        await prisma.progress.upsert({
            where: {
                userId_lessonId: {
                    userId: user.id,
                    lessonId: lessonId
                }
            },
            update: { completed: true },
            create: {
                userId: user.id,
                lessonId: lessonId,
                completed: true
            }
        })
        console.log(`Marked lesson ${lessonId} as completed`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
