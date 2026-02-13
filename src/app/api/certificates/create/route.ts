import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Using our existing auth
import prisma from '@/lib/prisma'; // Using our existing prisma
import { generateCertificatePDF } from '@/lib/pdf-generator';
import { mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { enrollmentId } = await req.json();

        // Verificar que el enrollment esté completado
        const enrollment = await prisma.enrollment.findUnique({
            where: { id: enrollmentId },
            include: {
                user: true,
                course: true
            }
        });

        if (!enrollment) {
            return NextResponse.json({ error: 'Inscripción no encontrada' }, { status: 404 });
        }

        // Check progress (assuming progress is stored as 100 for completed)
        // Note: Schema uses Float for progress.
        if (enrollment.progress < 100) {
            return NextResponse.json({ error: 'Curso no completado' }, { status: 400 });
        }

        // Verificar si ya existe certificado
        const existingCert = await prisma.certificate.findUnique({
            where: {
                userId_courseId: {
                    userId: enrollment.userId,
                    courseId: enrollment.courseId
                }
            }
        });

        if (existingCert) {
            return NextResponse.json({
                certificateUrl: existingCert.certificateUrl,
                code: existingCert.code
            });
        }

        // Crear directorio si no existe (though pdf-generator handles open? No, generator uses createWriteStream, dir must exist)
        const certDir = join(process.cwd(), 'public', 'certificates');
        try {
            await mkdir(certDir, { recursive: true });
        } catch (err) {
            // Directorio ya existe
        }

        // Generar código único
        const code = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Generar PDF
        const certificateUrl = await generateCertificatePDF({
            userName: enrollment.user.name || "Usuario",
            courseName: enrollment.course.title,
            completionDate: enrollment.completedAt || new Date(),
            certificateCode: code,
            hours: enrollment.course.duration ? enrollment.course.duration / 60 : 1 // Default duration if not set
        });

        // Guardar en base de datos
        const certificate = await prisma.certificate.create({
            data: {
                userId: enrollment.userId,
                courseId: enrollment.courseId,
                certificateUrl,
                code
            }
        });

        return NextResponse.json({
            success: true,
            certificateUrl,
            code
        });

    } catch (error) {
        console.error('Error generando certificado:', error);
        return NextResponse.json({
            error: 'Error al generar certificado',
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
