import { NextResponse } from "next/server"
import { generateCertificatePDF } from "@/lib/pdf-generator"
import { readFile } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
    try {
        const { userId, courseId, userName, courseName } = await request.json()

        const date = new Date()
        const code = `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

        // Generate PDF - Returns local file path relative to public/
        // Function expects CertificateData object
        const relativePath = await generateCertificatePDF({
            userName: userName || "Usuario E-Solutions",
            courseName: courseName || "Curso Completado",
            completionDate: date,
            certificateCode: code,
            hours: 40 // Default or dynamic
        })

        // Read the file and return it
        // The generator returns "/certificates/filename.pdf", so remove leading slash for join if needed or handle absolute path logic
        // The generator implementation uses: resolve(`/certificates/${fileName}`);

        // We need the absolute path to read it server-side to send as stream/buffer
        // process.cwd() + '/public' + relativePath
        const filePath = join(process.cwd(), 'public', relativePath)

        const fileBuffer = await readFile(filePath)

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="certificado-${code}.pdf"`,
            },
        })

    } catch (error) {
        console.error("[CERTIFICATE_GEN_ERROR]", error)
        return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 })
    }
}
