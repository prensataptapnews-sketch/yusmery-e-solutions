
import { PrismaClient, Role, Area } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('password123', 12)

    // 1. Super Admin
    const superAdmin = await prisma.user.upsert({
        where: { email: 'super@esolutions.com' },
        update: {
            role: 'SUPER_ADMIN',
            area: null,
            assignedAreas: null
        },
        create: {
            email: 'super@esolutions.com',
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
            password,
        },
    })
    console.log({ superAdmin })

    // 2. Administrador de Finanzas
    const adminFinanzas = await prisma.user.upsert({
        where: { email: 'admin.finanzas@empresa.com' },
        update: {
            role: 'ADMINISTRADOR',
            area: 'FINANZAS',
            assignedAreas: JSON.stringify(['FINANZAS'])
        },
        create: {
            email: 'admin.finanzas@empresa.com',
            name: 'Admin Finanzas',
            role: 'ADMINISTRADOR',
            area: 'FINANZAS',
            assignedAreas: JSON.stringify(['FINANZAS']),
            password,
        },
    })
    console.log({ adminFinanzas })

    // 3. Profesor
    const profesor = await prisma.user.upsert({
        where: { email: 'profesor@empresa.com' },
        update: {
            role: 'PROFESOR',
            area: 'TALENTO'
        },
        create: {
            email: 'profesor@empresa.com',
            name: 'Profesor Talento',
            role: 'PROFESOR',
            area: 'TALENTO',
            password,
        },
    })
    console.log({ profesor })

    // 4. Colaborador
    const colaborador = await prisma.user.upsert({
        where: { email: 'colaborador@empresa.com' },
        update: {
            role: 'COLABORADOR',
            area: 'OPERACIONES'
        },
        create: {
            email: 'colaborador@empresa.com',
            name: 'Colaborador Ops',
            role: 'COLABORADOR',
            area: 'OPERACIONES',
            password,
        },
    })
    console.log({ colaborador })
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
