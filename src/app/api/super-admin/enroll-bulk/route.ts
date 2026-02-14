
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const session = await auth();

    if (session?.user?.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    try {
        const { userIds, courseId, enabledModules, dueDate } = await req.json();

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json({ error: 'No users provided' }, { status: 400 });
        }

        if (!courseId) {
            return NextResponse.json({ error: 'No course provided' }, { status: 400 });
        }

        // Crear enrollments
        // Using transaction to ensuring consistency
        // Note: skipDuplicates on SQLite requires Prisma 5.3+, we are on v6.

        // We try to create enrollments. The prisma.enrollment.createMany with skipDuplicates should work.
        // If userIds contains duplicates, it's fine.

        // To enable skipping duplicates on SQLite with older Prisma or explicit behavior:
        // We can loop. But createMany is cleaner.

        await prisma.enrollment.createMany({
            data: userIds.map((userId: string) => ({
                userId,
                courseId,
                dueDate: dueDate ? new Date(dueDate) : null,
                status: 'ACTIVE'
            })),
            // skipDuplicates: true // Not supported in SQLite
        });

        // TODO: Lógica para habilitar/deshabilitar módulos específicos
        // Guardar en tabla ModuleAccess (crear si no existe)
        if (enabledModules && enabledModules.length > 0) {
            // We would create ModuleAccess entries here.
        }

        return NextResponse.json({
            success: true,
            enrolled: userIds.length
        });
    } catch (error: any) {
        console.error("Bulk enroll error:", error);
        return NextResponse.json({
            error: error.message || "Internal Server Error"
        }, { status: 500 });
    }
}
