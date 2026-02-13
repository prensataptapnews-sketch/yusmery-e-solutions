import prisma from '@/lib/prisma';
import { CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;

    const certificate = await prisma.certificate.findUnique({
        where: { code },
        include: {
            user: {
                select: { name: true }
            },
            course: {
                select: { title: true, duration: true }
            }
        }
    });

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 border border-neutral-100">
                {certificate ? (
                    <>
                        <div className="text-center mb-8">
                            <CheckCircle className="w-20 h-20 text-teal-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                                Certificado Válido
                            </h1>
                            <p className="text-neutral-600 bg-teal-50 py-2 px-4 rounded-full text-sm inline-block">
                                Verificado por e-Solutions LXP
                            </p>
                        </div>

                        <div className="space-y-5 border-t border-neutral-100 pt-6">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Colaborador</p>
                                <p className="font-semibold text-lg text-neutral-900">{certificate.user.name}</p>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Curso Completado</p>
                                <p className="font-semibold text-lg text-neutral-900 leading-tight">{certificate.course.title}</p>
                            </div>

                            <div className="flex gap-8">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Duración</p>
                                    <p className="font-semibold text-neutral-900">
                                        {certificate.course.duration ? (certificate.course.duration / 60).toFixed(1) : 0} horas
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Fecha de Emisión</p>
                                    <p className="font-semibold text-neutral-900">
                                        {format(new Date(certificate.issuedAt), 'dd MMM yyyy', { locale: es })}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-neutral-50 p-3 rounded-lg mt-2">
                                <p className="text-xs text-neutral-500 mb-1 text-center">Código de verificación</p>
                                <p className="font-mono text-sm text-neutral-700 text-center font-medium tracking-wide">{certificate.code}</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                                Certificado No Válido
                            </h1>
                            <p className="text-neutral-600">
                                No pudimos encontrar un certificado asociado al código proporcionado.
                            </p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg text-sm text-red-800 text-center">
                            Por favor verifica que el código esté escrito correctamente o contacta a soporte.
                        </div>
                    </>
                )}
            </div>

            <div className="mt-8 text-center text-neutral-400 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Verificación segura vía e-Solutions LXP</span>
            </div>
        </div>
    );
}
