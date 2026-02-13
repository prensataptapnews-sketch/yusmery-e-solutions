const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- SYSTEM SEED & STATUS CHECK ---')

    // 1. Check count
    const count = await prisma.systemModule.count()
    console.log(`Total Modules: ${count}`)

    // 2. List all
    const modules = await prisma.systemModule.findMany()
    console.table(modules.map(m => ({ key: m.key, name: m.name, status: m.status })))

    // 3. Check for specific module
    const testModule = await prisma.systemModule.findUnique({ where: { key: 'evaluations' } })
    console.log('Evaluations Module Status:', testModule ? testModule.status : 'NOT FOUND')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
