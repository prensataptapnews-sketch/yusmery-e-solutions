import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'colaborador@empresa.com'

    // 1. Find User
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        console.error("User not found")
        return
    }

    // 2. Find a Course (First published one)
    const course = await prisma.course.findFirst({
        where: { published: true },
        include: {
            modules: {
                include: { lessons: true }
            }
        }
    })

    if (!course) {
        console.error("No published course found")
        return
    }

    console.log(`Completing course: ${course.title} for user: ${user.name}`)

    const allLessons = course.modules.flatMap(m => m.lessons)

    // 3. Mark all lessons as complete
    for (const lesson of allLessons) {
        await prisma.progress.upsert({
            where: {
                userId_lessonId: {
                    userId: user.id,
                    lessonId: lesson.id
                }
            },
            update: { completed: true },
            create: {
                userId: user.id,
                lessonId: lesson.id,
                completed: true
            }
        })
    }

    // 4. Update Enrollment to 100%
    await prisma.enrollment.upsert({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: course.id
            }
        },
        update: {
            progress: 100,
            status: 'COMPLETED',
            completedAt: new Date()
        },
        create: {
            userId: user.id,
            courseId: course.id,
            status: 'COMPLETED',
            progress: 100,
            startedAt: new Date(),
            completedAt: new Date()
        }
    })

    console.log("Course completed successfully! 🚀")
    console.log("Go to /certificates to generate your diploma.")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
