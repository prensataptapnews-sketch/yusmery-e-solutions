import { format } from "date-fns"
import { es } from "date-fns/locale"

interface CertificateTemplateProps {
    studentName: string
    courseName: string
    courseDuration: number
    issueDate: Date
    code: string
    companyName?: string
}

export function CertificateTemplate({
    studentName,
    courseName,
    courseDuration,
    issueDate,
    code,
    companyName = "e-Solutions Enterprise"
}: CertificateTemplateProps) {
    return (
        <div id="certificate-frame" className="w-[1100px] h-[750px] bg-white text-black relative mx-auto overflow-hidden shadow-2xl print:shadow-none print:w-full print:h-full print:m-0 print:border-none">
            {/* Decorative Border */}
            <div className="absolute inset-4 border-4 border-double border-slate-800 pointer-events-none z-10"></div>
            <div className="absolute inset-6 border border-slate-600 pointer-events-none z-10"></div>

            {/* Corner Ornaments (CSS Shapes) */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-amber-600 z-20"></div>
            <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-amber-600 z-20"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-amber-600 z-20"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-amber-600 z-20"></div>

            {/* Content */}
            <div className="flex flex-col items-center justify-center h-full py-12 px-20 text-center font-serif">

                {/* Header */}
                <div className="mb-8">
                    <h3 className="text-xl uppercase tracking-[0.2em] text-slate-600 mb-2 font-sans font-semibold">Certificado de Finalización</h3>
                    <div className="h-1 w-24 bg-amber-500 mx-auto"></div>
                </div>

                {/* Institution */}
                <h2 className="text-3xl font-bold text-slate-800 mb-12 font-sans tracking-wide">
                    {companyName}
                </h2>

                <p className="text-xl text-slate-600 italic mb-6">
                    Otorga el presente reconocimiento a:
                </p>

                {/* Student Name */}
                <h1 className="text-5xl font-bold text-slate-900 mb-8 font-serif italic decoration-amber-500/30 underline decoration-2 underline-offset-8">
                    {studentName}
                </h1>

                <p className="text-xl text-slate-600 mb-2">
                    Por haber completado satisfactoriamente el curso:
                </p>

                {/* Course Name */}
                <h2 className="text-3xl font-bold text-slate-800 mb-4 max-w-2xl leading-tight">
                    "{courseName}"
                </h2>

                <p className="text-lg text-slate-500 mb-16">
                    Con una duración de <strong>{courseDuration} horas</strong> académicas.
                </p>

                {/* Footer / Signatures */}
                <div className="flex justify-between items-end w-full px-12 mt-auto">
                    <div className="text-center">
                        <div className="w-64 border-b-2 border-slate-400 mb-2"></div>
                        <p className="font-bold text-slate-800">Dirección Académica</p>
                        <p className="text-sm text-slate-500">e-Solutions Inc.</p>
                    </div>

                    {/* Seal */}
                    <div className="relative h-32 w-32 rounded-full border-4 border-amber-600 flex items-center justify-center text-amber-700 opacity-80">
                        <div className="absolute inset-1 border border-amber-600 rounded-full"></div>
                        <span className="font-bold text-xs uppercase tracking-widest text-center rotate-[-15deg]">
                            Sello<br />Oficial<br />2024
                        </span>
                    </div>

                    <div className="text-center">
                        <div className="w-64 border-b-2 border-slate-400 mb-2"></div>
                        <p className="font-bold text-slate-800">Instructor del Curso</p>
                        <p className="text-sm text-slate-500">Certificación Valida</p>
                    </div>
                </div>

                {/* Metadata */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                    <p className="text-xs text-slate-400 font-mono">
                        Código de Verificación: {code}  |  Fecha de Emisión: {format(new Date(issueDate), "PPP", { locale: es })}
                    </p>
                </div>
            </div>

            {/* Branding Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <span className="text-[15rem] font-bold rotate-[-30deg]">CERTIFICADO</span>
            </div>
        </div>
    )
}
