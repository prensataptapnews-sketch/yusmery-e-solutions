const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({})

async function main() {
    const email = 'admin@esolutions.com'

    // Cleanup existing data
    await prisma.enrollment.deleteMany()
    await prisma.certificate.deleteMany()
    await prisma.user.deleteMany({ where: { email } })
    await prisma.course.deleteMany()

    // Create User
    const user = await prisma.user.create({
        data: {
            email,
            name: 'Admin User',
            password: 'hashed_password_placeholder', // Auth uses hardcoded check, this is for DB relation
            role: 'STUDENT',
            company: {
                create: {
                    name: 'e-Solutions Corp',
                    slug: 'esolutions',
                    plan: 'ENTERPRISE'
                }
            }
        }
    })

    // Create Courses
    const course1 = await prisma.course.create({
        data: {
            title: 'Compliance Corporativo 2024',
            slug: 'compliance-2024',
            description: 'Curso obligatorio de cumplimiento normativo.',
            published: true,
            duration: 60,
            category: 'Legal'
        }
    })

    const course2 = await prisma.course.create({
        data: {
            title: 'Seguridad de la Información',
            slug: 'sec-info',
            published: true,
            duration: 45,
            category: 'IT'
        }
    })

    const course3 = await prisma.course.create({
        data: {
            title: 'Liderazgo Efectivo',
            slug: 'liderazgo',
            published: true,
            duration: 120,
            category: 'Soft Skills'
        }
    })

    // Create Active Enrollment (Progress 65%)
    await prisma.enrollment.create({
        data: {
            userId: user.id,
            courseId: course1.id,
            status: 'ACTIVE',
            progress: 65,
            enrolledAt: new Date()
        }
    })

    // Create Other Enrollments
    await prisma.enrollment.create({
        data: {
            userId: user.id,
            courseId: course2.id,
            status: 'ACTIVE',
            progress: 10,
            enrolledAt: new Date()
        }
    })

    // Create Certificates (Completed Courses)
    await prisma.certificate.create({
        data: {
            userId: user.id,
            courseId: course3.id,
            code: 'CERT-001',
            issuedAt: new Date()
        }
    })

    // Also enroll in the completed course for consistency
    await prisma.enrollment.create({
        data: {
            userId: user.id,
            courseId: course3.id,
            status: 'COMPLETED',
            progress: 100,
            enrolledAt: new Date(),
            completedAt: new Date()
        }
    })

    console.log('Seed completed successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
