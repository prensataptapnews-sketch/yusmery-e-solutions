'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CertificateProps {
    certificate: {
        id: string;
        code: string;
        certificateUrl: string;
        issuedAt: Date | string;
        course: {
            title: string;
            thumbnail: string | null;
        };
    };
}

export default function CertificateCard({ certificate }: CertificateProps) {
    const handleDownload = () => {
        // Determine the download URL. 
        // If certificateUrl is a relative path (e.g. /certificates/...), it works directly from public.
        // If validation fails or needs specific headers, we might need an API route, but direct link is standard for public files.
        const link = document.createElement('a');
        link.href = certificate.certificateUrl;
        link.download = `certificado-${certificate.code}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Mi certificado',
                    text: `He completado el curso: ${certificate.course.title}`,
                    url: `${window.location.origin}/verify/${certificate.code}`
                });
            } catch (err) {
            }
        } else {
            navigator.clipboard.writeText(`${window.location.origin}/verify/${certificate.code}`);
            // Simple alert as requested, though toast would be better
            alert('Link copiado al portapapeles');
        }
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-neutral-200">
            <div className="relative h-48 bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                <div className="text-center text-white p-4">
                    <CheckCircle className="w-16 h-16 mx-auto mb-3 opacity-90" />
                    <p className="text-sm font-medium uppercase tracking-wider opacity-90">Certificado Oficial</p>
                </div>
            </div>

            <div className="p-5">
                <h3 className="font-bold text-xl mb-2 line-clamp-2 text-neutral-800 h-14">
                    {certificate.course.title}
                </h3>

                <div className="flex flex-col gap-1 mb-4">
                    <p className="text-sm text-neutral-500">
                        Emitido el <span className="font-medium text-neutral-700">{format(new Date(certificate.issuedAt), 'dd MMM yyyy', { locale: es })}</span>
                    </p>
                    <p className="text-xs text-neutral-400 font-mono bg-neutral-100 w-fit px-2 py-1 rounded mt-1">
                        ID: {certificate.code}
                    </p>
                </div>


                <div className="flex gap-3 mt-4">
                    <Button
                        onClick={handleDownload}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                        size="sm"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                    </Button>

                    <Button
                        onClick={handleShare}
                        variant="outline"
                        size="sm"
                        className="border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    >
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
