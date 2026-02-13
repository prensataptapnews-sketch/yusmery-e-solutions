import { getMyCertificates } from "@/app/actions/certificates"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar, Download } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default async function CertificatesPage() {
    const res = await getMyCertificates()
    const certificates = res.success ? res.certificates : []

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Mis Certificados</h1>
                <p className="text-muted-foreground">Logros académicos obtenidos y diplomas listos para descargar.</p>
            </div>

            {certificates && certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert: any) => (
                        <Card key={cert.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mb-2">
                                        <Award className="h-6 w-6" />
                                    </div>
                                    <Badge variant="outline" className="font-mono text-xs">
                                        {cert.code}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg leading-tight">
                                    {cert.course.title}
                                </CardTitle>
                                <CardDescription>
                                    Completado con éxito
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="flex items-center text-sm text-muted-foreground gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Emitido: {format(new Date(cert.issuedAt), "d 'de' MMMM, yyyy", { locale: es })}</span>
                                    {/* Link to verify: /certificates/verify/[code] could be added later */}
                                </div>
                            </CardContent>
                            <CardFooter className="pt-4">
                                <Button asChild className="w-full gap-2">
                                    <Link href={`/certificates/${cert.id}`}>
                                        <Download className="h-4 w-4" />
                                        Ver Diploma
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/20 border-dashed">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Award className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Aún no tienes certificados</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        Completa tus cursos al 100% para obtener certificaciones oficiales de e-Solutions.
                    </p>
                    <Button asChild>
                        <Link href="/catalog">Explorar Cursos</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
