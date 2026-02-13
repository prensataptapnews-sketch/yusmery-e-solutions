import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// === DATA DEFINITIONS FROM CATEGORIES ===

const COMPANIES = [
    { name: "TechCorp Solutions", slug: "techcorp" },
    { name: "Grupo Financiero del Bajío", slug: "gfb" },
    { name: "Retail Global", slug: "retail-global" },
    { name: "Pharma México", slug: "pharma-mexico" },
    { name: "Industrias del Norte", slug: "industrias-norte" },
    { name: "Construcciones Modernas", slug: "construcciones-modernas" },
    { name: "Energía Sustentable SA", slug: "energia-sustentable" },
    { name: "Alimentos del Valle", slug: "alimentos-valle" },
    { name: "Logística Express", slug: "logistica-express" },
    { name: "Telecomunicaciones Avanzadas", slug: "telecom-avanzadas" },
    { name: "Servicios Financieros Global", slug: "servicios-global" },
    { name: "Automotriz del Centro", slug: "automotriz-centro" },
    { name: "Consultoría Estratégica", slug: "consultoria-estrategica" },
    { name: "Industria Textil del Sur", slug: "textil-sur" },
    { name: "Tecnología e Innovación", slug: "tec-innovacion" }
]

const COURSES = [
    { title: "Liderazgo Transformacional para Mandos Medios", slug: "liderazgo-transformacional", students: 147, progress: 64, pendingEval: 23, inquiries: 8, status: "Activo" },
    { title: "Gestión de Equipos de Alto Rendimiento", slug: "gestion-equipos", students: 203, progress: 78, pendingEval: 47, inquiries: 12, status: "Activo" },
    { title: "Coaching Ejecutivo Aplicado", slug: "coaching-ejecutivo", students: 76, progress: 42, pendingEval: 12, inquiries: 5, status: "Activo" },
    { title: "Toma de Decisiones Estratégicas", slug: "toma-decisiones-estrategicas", students: 30, progress: 0, pendingEval: 0, inquiries: 2, status: "Próximamente" },
    { title: "Liderazgo en Tiempos de Crisis", slug: "liderazgo-crisis", students: 189, progress: 91, pendingEval: 3, inquiries: 1, status: "Finalizando" },
    { title: "Desarrollo de Inteligencia Emocional", slug: "inteligencia-emocional", students: 124, progress: 55, pendingEval: 18, inquiries: 14, status: "Activo" },
    { title: "Gestión del Cambio Organizacional", slug: "gestion-cambio", students: 98, progress: 38, pendingEval: 8, inquiries: 7, status: "Activo" },
    { title: "Negociación y Manejo de Conflictos", slug: "negociacion-conflictos", students: 167, progress: 82, pendingEval: 34, inquiries: 9, status: "Activo" },
    { title: "Liderazgo Ágil y Adaptativo", slug: "liderazgo-agil", students: 54, progress: 23, pendingEval: 5, inquiries: 11, status: "Activo" },
    { title: "Comunicación Estratégica para Líderes", slug: "comunicacion-estrategica", students: 211, progress: 67, pendingEval: 29, inquiries: 16, status: "Activo" },
    { title: "Formación de Líderes del Futuro", slug: "liderazgo-futuro", students: 143, progress: 100, pendingEval: 0, inquiries: 0, status: "Completado" },
    { title: "Ética y Responsabilidad en el Liderazgo", slug: "etica-liderazgo", students: 87, progress: 49, pendingEval: 15, inquiries: 6, status: "Activo" },
    { title: "Liderazgo Inclusivo y Diversidad", slug: "liderazgo-inclusivo", students: 156, progress: 72, pendingEval: 21, inquiries: 13, status: "Activo" },
    { title: "Pensamiento Estratégico para Ejecutivos", slug: "pensamiento-estrategico", students: 45, progress: 11, pendingEval: 2, inquiries: 4, status: "Activo" },
    { title: "Mentoring y Desarrollo de Talento", slug: "mentoring-talento", students: 112, progress: 58, pendingEval: 19, inquiries: 10, status: "Activo" }
]

const FEATURED_STUDENTS = [
    { name: "María Fernández Gutiérrez", companySlug: "techcorp", courseSlug: "liderazgo-transformacional", progress: 92, score: 94, status: "EXCELLENT", lastIn: "2h" },
    { name: "Carlos Rodríguez Méndez", companySlug: "gfb", courseSlug: "gestion-equipos", progress: 78, score: 87, status: "GOOD", lastIn: "1d" },
    { name: "Ana Patricia Martínez Luna", companySlug: "industrias-norte", courseSlug: "coaching-ejecutivo", progress: 34, score: 76, status: "RISK", lastIn: "8d" },
    { name: "Luis Alberto González Soto", companySlug: "pharma-mexico", courseSlug: "liderazgo-transformacional", progress: 88, score: 91, status: "EXCELLENT", lastIn: "3h" },
    { name: "Patricia Sánchez Ríos", companySlug: "retail-global", courseSlug: "gestion-equipos", progress: 95, score: 98, status: "OUTSTANDING", lastIn: "1h" },
    { name: "Roberto Pérez Castro", companySlug: "construcciones-modernas", courseSlug: "coaching-ejecutivo", progress: 56, score: 82, status: "GOOD", lastIn: "2d" },
    { name: "Laura Torres Vega", companySlug: "energia-sustentable", courseSlug: "liderazgo-transformacional", progress: 15, score: 0, status: "CRITICAL", lastIn: "12d" },
    { name: "Miguel Ramírez Flores", companySlug: "alimentos-valle", courseSlug: "gestion-equipos", progress: 82, score: 89, status: "GOOD", lastIn: "5h" },
    { name: "Carmen López Herrera", companySlug: "logistica-express", courseSlug: "comunicacion-estrategica", progress: 67, score: 85, status: "GOOD", lastIn: "1d" },
    { name: "Fernando Díaz Moreno", companySlug: "telecom-avanzadas", courseSlug: "liderazgo-transformacional", progress: 45, score: 78, status: "REGULAR", lastIn: "6d" },
    { name: "Diana Ruiz Portillo", companySlug: "servicios-global", courseSlug: "inteligencia-emotional", progress: 89, score: 93, status: "EXCELLENT", lastIn: "4h" },
    { name: "Jorge Hernández Campos", companySlug: "automotriz-centro", courseSlug: "gestion-cambio", progress: 41, score: 80, status: "REGULAR", lastIn: "3d" },
    { name: "Sofía Morales Rivera", companySlug: "consultoria-estrategica", courseSlug: "negociacion-conflictos", progress: 97, score: 96, status: "OUTSTANDING", lastIn: "30m" },
    { name: "Ricardo Vargas Mendoza", companySlug: "textil-sur", courseSlug: "liderazgo-agil", progress: 28, score: 74, status: "RISK", lastIn: "5d" },
    { name: "Gabriela Castro Jiménez", companySlug: "tec-innovacion", courseSlug: "liderazgo-inclusivo", progress: 73, score: 88, status: "GOOD", lastIn: "6h" }
]

const RESOURCES = [
    { title: "Guía de Estilos de Liderazgo.pdf", courseSlug: "liderazgo-transformacional", type: "PDF" },
    { title: "Plantilla Plan de Desarrollo de Equipo.xlsx", courseSlug: "gestion-equipos", type: "EXCEL" },
    { title: "Manual de Técnicas de Coaching.pdf", courseSlug: "coaching-ejecutivo", type: "PDF" },
    { title: "Test de Inteligencia Emocional.pdf", courseSlug: "inteligencia-emotional", type: "PDF" },
    { title: "Checklist de Gestión del Cambio.docx", courseSlug: "gestion-cambio", type: "WORD" }
]

async function main() {
    console.log('🌱 Starting Massive Seed...')

    // 1. Setup E-Solutions Company
    const mainCompany = await prisma.company.upsert({
        where: { slug: 'e-solutions' },
        update: {},
        create: {
            name: 'E-Solutions Group',
            slug: 'e-solutions',
            plan: 'ENTERPRISE'
        }
    })

    // 2. Setup Super Admin / Head Teacher (admin@esolutions.com)
    const adminEmail = 'admin@esolutions.com'
    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
            companyId: mainCompany.id,
            password: 'password123',
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
        }
    })

    // 3. Companies (Top 15)
    const companyMap = new Map()
    for (const c of COMPANIES) {
        const company = await prisma.company.upsert({
            where: { slug: c.slug },
            update: {},
            create: { name: c.name, slug: c.slug, plan: 'STANDARD' }
        })
        companyMap.set(c.slug, company.id)
    }

    // 4. Courses (15 Courses)
    const courseMap = new Map()
    for (const c of COURSES) {
        const course = await prisma.course.upsert({
            where: { slug: c.slug },
            update: { teacherId: adminUser.id },
            create: {
                title: c.title,
                slug: c.slug,
                description: `Curso completo de ${c.title}. Datos simulados para demostración.`,
                category: "Liderazgo",
                duration: 40,
                level: "INTERMEDIATE",
                published: true,
                companyId: mainCompany.id,
                teacherId: adminUser.id
            }
        })
        courseMap.set(c.slug, course.id)

        // Modules & Lessons (Basic structure for classroom browsing)
        for (let i = 1; i <= 5; i++) {
            const module = await prisma.module.create({
                data: {
                    title: `Módulo ${i}: Conceptos Fundamentales`,
                    order: i,
                    courseId: course.id
                }
            })
            const lesson = await prisma.lesson.create({
                data: {
                    title: `Lección ${i}.1: Introducción Teórica`,
                    order: 1,
                    moduleId: module.id,
                    content: "Contenido extendido para la lección de prueba...",
                    contentType: "VIDEO",
                    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                }
            })

            // Resources
            const resourceData = RESOURCES.find(r => r.courseSlug === c.slug)
            if (resourceData) {
                await prisma.resource.create({
                    data: {
                        title: resourceData.title,
                        url: "/mock-resource.pdf",
                        type: resourceData.type,
                        lessonId: lesson.id
                    }
                })
            }

            // Evaluation (if course needs pending evals)
            if (c.pendingEval > 0 && i === 4) {
                const evaluation = await prisma.evaluation.create({
                    data: {
                        title: `Actividad Práctica - Módulo ${i}`,
                        type: "ASSIGNMENT",
                        courseId: course.id,
                        lessonId: lesson.id,
                        published: true,
                        questions: { create: [{ question: "¿Cómo aplicarías esto a tu equipo?", type: "OPEN", options: "[]", correctAnswer: "", order: 1 }] }
                    }
                })

                // Create submissions (to match pendingEval stat)
                for (let j = 0; j < c.pendingEval; j++) {
                    await prisma.evaluationSubmission.create({
                        data: {
                            evaluationId: evaluation.id,
                            userId: adminUser.id, // placeholder, will use randoms usually but let's keep it simple
                            answers: "RESPUESTA DE PRUEBA",
                            score: 0,
                            maxScore: 100,
                            percentage: 0,
                            passed: false,
                            attempt: 1,
                            submittedAt: new Date(Date.now() - (j * 3600000))
                        }
                    })
                }
            }
        }

        // Inquiries (to match inquiries stat)
        for (let j = 0; j < c.inquiries; j++) {
            await prisma.inquiry.create({
                data: {
                    studentId: adminUser.id,
                    courseId: course.id,
                    teacherId: adminUser.id,
                    question: `Duda número ${j + 1} sobre el contenido de ${c.title}.`,
                    status: "PENDING",
                    createdAt: new Date(Date.now() - (j * 7200000))
                }
            })
        }
    }

    // 5. Featured Students (15 Students)
    for (const s of FEATURED_STUDENTS) {
        const email = `${s.name.toLowerCase().replace(/ /g, '.')}@${s.companySlug}.com`
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                name: s.name,
                email,
                role: 'STUDENT',
                companyId: companyMap.get(s.companySlug),
                department: "Operaciones",
                position: "Manager",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`
            }
        })

        const courseId = courseMap.get(s.courseSlug)
        if (courseId) {
            await prisma.enrollment.upsert({
                where: { userId_courseId: { userId: user.id, courseId } },
                update: { progress: s.progress, status: s.progress === 100 ? 'COMPLETED' : 'ACTIVE' },
                create: {
                    userId: user.id,
                    courseId,
                    progress: s.progress,
                    status: s.progress === 100 ? 'COMPLETED' : 'ACTIVE'
                }
            })

            // If excellent/outstanding, mark 100 on some lessons
            if (s.progress > 0) {
                const lessons = await prisma.lesson.findMany({ where: { module: { courseId } }, take: 2 })
                for (const l of lessons) {
                    await prisma.progress.upsert({
                        where: { userId_lessonId: { userId: user.id, lessonId: l.id } },
                        update: { completed: true },
                        create: { userId: user.id, lessonId: l.id, completed: true }
                    })
                }
            }

            // Create certificate for COMPLETED
            if (s.progress === 100) {
                await prisma.certificate.upsert({
                    where: { userId_courseId: { userId: user.id, courseId } },
                    update: {},
                    create: {
                        userId: user.id,
                        courseId,
                        code: `CERT-${Math.random().toString(36).substring(7).toUpperCase()}`,
                        certificateUrl: "/certificates/demo.pdf"
                    }
                })
            }
        }
    }

    console.log('✅ Massive Seed Completed!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
