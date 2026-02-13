import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface CertData {
    userName: string;
    courseName: string;
    completionDate: Date;
    code: string;
    hours: number;
}

export async function generateCertificate(data: CertData): Promise<string> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
        const fileName = `cert-${data.code}.pdf`;
        const dir = path.join(process.cwd(), 'public', 'certificates');

        // Crear directorio si no existe
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const filePath = path.join(dir, fileName);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // Diseño del certificado
        doc.fontSize(12).text('e-Solutions LXP', 50, 50);

        doc.moveDown(3)
            .fontSize(40)
            .font('Helvetica-Bold')
            .fillColor('#14B8A6')
            .text('CERTIFICADO DE FINALIZACIÓN', { align: 'center' });

        doc.moveDown(3)
            .fontSize(18)
            .fillColor('#000000')
            .font('Helvetica')
            .text('Se certifica que', { align: 'center' });

        doc.moveDown(1)
            .fontSize(32)
            .font('Helvetica-Bold')
            .fillColor('#1E40AF')
            .text(data.userName, { align: 'center' });

        doc.moveDown(2)
            .fontSize(18)
            .font('Helvetica')
            .fillColor('#000000')
            .text('ha completado exitosamente el curso', { align: 'center' });

        doc.moveDown(1)
            .fontSize(24)
            .font('Helvetica-Bold')
            .fillColor('#1E40AF')
            .text(data.courseName, { align: 'center' });

        doc.moveDown(3)
            .fontSize(14)
            .font('Helvetica')
            .fillColor('#666666')
            .text(`Fecha: ${data.completionDate.toLocaleDateString('es-CL')} | Duración: ${data.hours} horas`, { align: 'center' });

        doc.moveDown(2)
            .fontSize(10)
            .fillColor('#999999')
            .text(`Código: ${data.code}`, { align: 'center' });

        doc.end();

        stream.on('finish', () => resolve(`/certificates/${fileName}`));
        stream.on('error', reject);
    });
}
