
import { prisma } from './src/lib/prisma'

async function checkData() {
    const courses = await prisma.course.findMany({
        include: {
            _count: {
                select: { enrollments: true, modules: true }
            }
        }
    })
    console.log('Courses:', courses.length)
    courses.forEach(c => {
        console.log(`- ${c.title} (Teacher: ${c.teacherId}, Enrollments: ${c._count.enrollments})`)
    })

    const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true, name: true }
    })
    console.log('\nUsers:', users.length)
    users.forEach(u => {
        console.log(`- ${u.email} (${u.role}, Name: ${u.name}, ID: ${u.id})`)
    })

    const enrollments = await prisma.enrollment.findMany()
    console.log('\nEnrollments:', enrollments.length)

    const inquiries = await prisma.inquiry.findMany()
    console.log('\nInquiries:', inquiries.length)
}

checkData()
