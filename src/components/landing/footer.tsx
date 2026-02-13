import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-slate-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Col 1: Brand (2 cols wide) */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-slate-900 font-bold">
                                E
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">E-SOLUTIONS</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
                            Transformamos organizaciones a través del desarrollo de talento y tecnología educativa de vanguardia.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                                <Linkedin className="h-5 w-5 text-white" />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                                <Twitter className="h-5 w-5 text-white" />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                                <Instagram className="h-5 w-5 text-white" />
                            </Link>
                        </div>
                    </div>

                    {/* Col 2: Solutions */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Soluciones</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Capacitación In-Company</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Implementación LMS</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Consultoría de RRHH</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Desarrollo de Contenido</Link></li>
                        </ul>
                    </div>

                    {/* Col 3: Company */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Empresa</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Casos de Éxito</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog Corporativo</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Trabaja con nosotros</Link></li>
                        </ul>
                    </div>

                    {/* Col 4: Legal */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Privacidad</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Términos de Uso</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="pt-8 border-t border-slate-900 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} E-SOLUTIONS. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
