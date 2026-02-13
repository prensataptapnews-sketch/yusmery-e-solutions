import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debug() {
    console.log('🔍 INICIANDO DIAGNÓSTICO DE DATOS...')

    const admin = await prisma.user.findUnique({
        where: { email: 'admin@esolutions.com' }
    })

    if (!admin) {
        console.log('❌ ERROR: Usuario admin@esolutions.com no existe.')
    } else {
        console.log(`✅ Usuario Admin encontrado: ID=${admin.id}, Role=${admin.role}`)

        const courses = await prisma.course.findMany({
            where: { teacherId: admin.id }
        })

        console.log(`📚 Cursos asignados a este ID: ${courses.length}`)
        courses.forEach(c => console.log(`   - ${c.title} (ID: ${c.id})`))

        const totalCourses = await prisma.course.count()
        console.log(`📊 Total de cursos en la DB: ${totalCourses}`)

        if (courses.length === 0 && totalCourses > 0) {
            const anyCourse = await prisma.course.findFirst()
            console.log(`⚠️ ALERTA: Hay cursos pero no pertenecen al admin. El primer curso pertenece al teacherId: ${anyCourse?.teacherId}`)
        }
    }

    const teacher = await prisma.user.findUnique({
        where: { email: 'profe@empresa.com' }
    })

    if (!teacher) {
        console.log('❌ ERROR: Usuario profe@empresa.com no existe.')
    } else {
        console.log(`✅ Usuario Profesor encontrado: ID=${teacher.id}, Role=${teacher.role}`)
        const courses = await prisma.course.findMany({ where: { teacherId: teacher.id } })
        console.log(`📚 Cursos asignados al Profesor: ${courses.length}`)
    }

    const student = await prisma.user.findUnique({
        where: { email: 'colaborador@empresa.com' }
    })

    if (!student) {
        console.log('❌ ERROR: Usuario colaborador@empresa.com no existe.')
    } else {
        console.log(`✅ Usuario Estudiante encontrado: ID=${student.id}, Role=${student.role}`)
        const enrolls = await prisma.enrollment.count({ where: { userId: student.id } })
        console.log(`🎓 Inscripciones del Estudiante: ${enrolls}`)
    }
}

debug()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
