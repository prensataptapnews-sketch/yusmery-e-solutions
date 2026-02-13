const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- FORCING MODULE SEED ---')

    // Original Project Modules
    const modules = [
        { key: "evaluations", name: "Evaluaciones", description: "Sistema de exámenes, quizzes y bancos de preguntas.", status: "ACTIVE", dependencies: "[]" },
        { key: "diagnostics", name: "Diagnósticos", description: "Pruebas de nivelación inicial para determinar ruta de aprendizaje.", status: "ACTIVE", dependencies: "[]" },
        { key: "certificates", name: "Certificados", description: "Generación automática de diplomas y credenciales.", status: "ACTIVE", dependencies: "[\"evaluations\"]" },
        { key: "gamification", name: "Gamificación", description: "Sistema de puntos, medallas y tablas de clasificación (Beta).", status: "BETA", dependencies: "[\"evaluations\"]" },
        { key: "reports", name: "Reportes Avanzados", description: "Analytics detallados de progreso, retención y rendimiento.", status: "INACTIVE", dependencies: "[]" },
        { key: "courses", name: "Gestión de Cursos", description: "Creación y administración de contenido educativo central.", status: "ACTIVE", dependencies: "[]" },
        { key: "users", name: "Gestión de Usuarios", description: "Control de roles, permisos y accesos al sistema.", status: "ACTIVE", dependencies: "[]" },
    ]

    console.log('Clearing Utopia modules...')
    await prisma.systemModule.deleteMany({}) // Clear old data

    console.log('Seeding Project modules...')
    for (const mod of modules) {
        await prisma.systemModule.create({
            data: mod
        })
    }

    console.log('Seeding complete!')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
