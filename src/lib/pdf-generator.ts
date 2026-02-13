import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { join } from 'path';

interface CertificateData {
    userName: string;
    courseName: string;
    completionDate: Date;
    certificateCode: string;
    hours: number;
}

export async function generateCertificatePDF(data: CertificateData): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4',
                margin: 50
            });

            const fileName = `certificate-${data.certificateCode}.pdf`;
            const filePath = join(process.cwd(), 'public', 'certificates', fileName);
            const stream = createWriteStream(filePath);

            doc.pipe(stream);

            // Header con logo (opcional si tienes logo)
            doc.fontSize(12).text('e-Solutions LXP', 50, 50);

            // Título principal
            doc.moveDown(3);
            doc.fontSize(36)
                .font('Helvetica-Bold')
                .fillColor('#14B8A6')
                .text('CERTIFICADO DE FINALIZACIÓN', { align: 'center' });

            // Línea decorativa
            doc.moveDown(2);
            doc.strokeColor('#14B8A6')
                .lineWidth(2)
                .moveTo(200, doc.y)
                .lineTo(600, doc.y)
                .stroke();

            // Cuerpo del certificado
            doc.moveDown(3);
            doc.fontSize(18)
                .fillColor('#000000')
                .font('Helvetica')
                .text('Se certifica que', { align: 'center' });

            doc.moveDown(1);
            doc.fontSize(28)
                .font('Helvetica-Bold')
                .fillColor('#1E40AF')
                .text(data.userName, { align: 'center' });

            doc.moveDown(1.5);
            doc.fontSize(18)
                .font('Helvetica')
                .fillColor('#000000')
                .text('ha completado exitosamente el curso', { align: 'center' });

            doc.moveDown(1);
            doc.fontSize(22)
                .font('Helvetica-Bold')
                .fillColor('#1E40AF')
                .text(data.courseName, { align: 'center' });

            // Detalles del curso
            doc.moveDown(2);
            doc.fontSize(14)
                .font('Helvetica')
                .fillColor('#666666')
                .text(`Fecha de finalización: ${data.completionDate.toLocaleDateString('es-CL')}`, { align: 'center' });

            doc.moveDown(0.5);
            doc.text(`Duración: ${data.hours} horas`, { align: 'center' });

            // Código de verificación
            doc.moveDown(2);
            doc.fontSize(10)
                .fillColor('#999999')
                .text(`Código de verificación: ${data.certificateCode}`, { align: 'center' });

            doc.text('Verificar en: https://esolutions.com/verify', { align: 'center' });

            // Finalizar
            doc.end();

            stream.on('finish', () => {
                resolve(`/certificates/${fileName}`);
            });

            stream.on('error', reject);

        } catch (error) {
            reject(error);
        }
    });
}
