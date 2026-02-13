
const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('Initializing PrismaClient...');
    try {
        const prisma = new PrismaClient();
        console.log('PrismaClient initialized.');
        const count = await prisma.user.count();
        console.log('User count:', count);
        await prisma.$disconnect();
        console.log('Success!');
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

main();
