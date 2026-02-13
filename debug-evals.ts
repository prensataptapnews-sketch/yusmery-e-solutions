import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debug() {
    console.log('🔍 INICIANDO DIAGNÓSTICO DE EVALUACIONES...')

    const teacher = await prisma.user.findUnique({
        where: { email: 'profe@empresa.com' }
    })

    if (!teacher) {
        console.log('❌ ERROR: Usuario profe@empresa.com no existe.')
        return
    }

    const teacherId = teacher.id
    console.log(`✅ Usuario Profesor: ${teacherId}`)

    const submissions = await prisma.evaluationSubmission.findMany({
        where: {
            evaluation: {
                OR: [
                    { course: { teacherId: teacherId } },
                    { lesson: { module: { course: { teacherId: teacherId } } } }
                ]
            }
        },
        include: {
            evaluation: {
                include: {
                    course: true,
                    lesson: { include: { module: { include: { course: true } } } }
                }
            }
        }
    })

    console.log(`📊 Entregas encontradas relacionadas con este profesor: ${submissions.length}`)

    submissions.forEach((s, idx) => {
        const cTitle = s.evaluation.course?.title || s.evaluation.lesson?.module?.course?.title
        console.log(`${idx + 1}. Curso: ${cTitle}, Evaluacion: ${s.evaluation.title}, Status: ${s.reviewedAt ? 'Revisado' : 'Pendiente'}`)
    })

    if (submissions.length === 0) {
        console.log('⚠️ No se encontraron entregas. Verificando si hay evaluaciones...')
        const evals = await prisma.evaluation.count()
        console.log(`Total evaluaciones en DB: ${evals}`)

        const anyEval = await prisma.evaluation.findFirst({
            include: { course: true, lesson: { include: { module: { include: { course: true } } } } }
        })
        console.log('Ejemplo evaluación:', anyEval?.title, 'Pertenece a teacherId:', anyEval?.course?.teacherId || anyEval?.lesson?.module?.course?.teacherId)
    }
}

debug()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
