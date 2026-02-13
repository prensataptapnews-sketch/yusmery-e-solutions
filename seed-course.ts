import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Seeding Demo Course...")

    const company = await prisma.company.findFirst()
    if (!company) throw new Error("No company found")

    const course = await prisma.course.create({
        data: {
            title: "Curso Demo: Gestión Efectiva",
            slug: "demo-gestion-efectiva-" + Date.now(),
            description: "Curso completo de demostración para probar certificados y reproductor.",
            published: true,
            companyId: company.id,
            duration: 10,
            modality: "ELEARNING",
            modules: {
                create: [
                    {
                        title: "Módulo 1: Introducción",
                        order: 1,
                        lessons: {
                            create: [
                                { title: "Bienvenida al Curso", order: 1, contentType: "VIDEO", duration: 5, content: "Introducción a la plataforma." },
                                { title: "Conceptos Básicos", order: 2, contentType: "TEXT", duration: 10, content: "Lectura sobre fundamentos." }
                            ]
                        }
                    },
                    {
                        title: "Módulo 2: Herramientas",
                        order: 2,
                        lessons: {
                            create: [
                                { title: "Herramienta A", order: 1, contentType: "VIDEO", duration: 15 },
                                { title: "Herramienta B", order: 2, contentType: "VIDEO", duration: 20 }
                            ]
                        }
                    },
                    {
                        title: "Módulo 3: Conclusión",
                        order: 3,
                        lessons: {
                            create: [
                                { title: "Cierre y Próximos Pasos", order: 1, contentType: "VIDEO", duration: 5 }
                            ]
                        }
                    }
                ]
            }
        }
    })

    console.log(`Created Course: ${course.title} (${course.id})`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
