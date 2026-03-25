"use client"

import { useEffect, useCallback } from "react"
import { Map } from "lucide-react"
import { Button } from "@/components/ui/button"

// Dynamically import driver.js styles only on client
export function EvaluacionesTour() {
    useEffect(() => {
        // Inject driver.js CSS once on mount
        const linkId = "driver-js-styles"
        if (!document.getElementById(linkId)) {
            const link = document.createElement("link")
            link.id = linkId
            link.rel = "stylesheet"
            link.href = "https://cdn.jsdelivr.net/npm/driver.js@1.3.5/dist/driver.css"
            document.head.appendChild(link)
        }
    }, [])

    const startTour = useCallback(async () => {
        const { driver } = await import("driver.js")

        const driverObj = driver({
            showProgress: true,
            progressText: "Paso {{current}} de {{total}}",
            nextBtnText: "Siguiente →",
            prevBtnText: "← Anterior",
            doneBtnText: "¡Listo!",
            overlayOpacity: 0.75,
            smoothScroll: true,
            allowClose: true,
            popoverClass: "evaluaciones-tour-popover",
            steps: [
                {
                    element: "#tour-header",
                    popover: {
                        title: "🎯 Bienvenido a Evaluaciones 360",
                        description:
                            "Este es tu <strong>centro de crecimiento profesional</strong>. Cada herramienta aquí está diseñada para ayudarte a mejorar desde adentro y contribuir a la cultura de mejora continua de la empresa.",
                        side: "bottom",
                        align: "start",
                    },
                },
                {
                    element: "#ev-360",
                    popover: {
                        title: "🔄 Evaluación Dinámica",
                        description:
                            "Recibe retroalimentación <strong>360° de tus pares y líderes</strong>. Una visión completa e imparcial de tus competencias, sin sesgos. El punto de partida de tu desarrollo.",
                        side: "top",
                        align: "start",
                    },
                },
                {
                    element: "#ev-9box",
                    popover: {
                        title: "📊 Matriz de Talento 9-Box",
                        description:
                            "Descubre dónde estás hoy en términos de <strong>potencial y desempeño</strong> dentro del equipo. Esta herramienta ayuda a los líderes a acompañar tu crecimiento de forma estratégica.",
                        side: "top",
                        align: "start",
                    },
                },
                {
                    element: "#ev-auto",
                    popover: {
                        title: "🪞 Autoevaluación Dinámica",
                        description:
                            "Antes de recibir feedback externo, <strong>calibra honestamente tus fortalezas y áreas de mejora</strong>. La autoconciencia es el primer paso de cualquier transformación profesional.",
                        side: "top",
                        align: "start",
                    },
                },
                {
                    element: "#ev-peers",
                    popover: {
                        title: "🤝 Selección de Pares",
                        description:
                            "Elige a las personas que mejor conocen tu trabajo. <strong>Su retroalimentación será la más valiosa</strong> porque viene de quienes trabajan contigo día a día.",
                        side: "top",
                        align: "start",
                    },
                },
                {
                    element: "#ev-chat-sim",
                    popover: {
                        title: "💬 Simulador de Retroalimentación",
                        description:
                            "Practica cómo dar y recibir feedback asertivo en situaciones difíciles, <strong>de forma segura y realista</strong>. Porque saber comunicar es tan importante como tener buenos resultados.",
                        side: "top",
                        align: "start",
                    },
                },
                {
                    element: "#ev-radar",
                    popover: {
                        title: "🕸️ Radar de Competencias",
                        description:
                            "Visualiza en un solo gráfico <strong>la diferencia entre cómo te ves tú y cómo te ven los demás</strong>. Estas brechas son tus mayores oportunidades de crecimiento.",
                        side: "top",
                        align: "start",
                    },
                },
                {
                    element: "#ev-metas",
                    popover: {
                        title: "🎯 Alineación de Metas OKR",
                        description:
                            "Conecta tus objetivos personales con la estrategia de la empresa. <strong>Cuando tú creces, la organización crece contigo.</strong> Crecer juntos, en la misma dirección.",
                        side: "top",
                        align: "start",
                    },
                },
                {
                    element: "#ev-kanban",
                    popover: {
                        title: "🗂️ Plan de Acción",
                        description:
                            "Convierte los resultados de tus evaluaciones en <strong>pasos concretos, medibles y con fecha</strong>. La mejora real surge cuando convertimos el aprendizaje en acción.",
                        side: "top",
                        align: "start",
                    },
                },
                {
                    element: "#ev-clima",
                    popover: {
                        title: "🌡️ Termómetro de Clima",
                        description:
                            "Tu bienestar importa. <strong>Comparte cómo te sientes hoy</strong> y contribuye a construir un ambiente laboral positivo para todo el equipo. 30 segundos que marcan la diferencia.",
                        side: "top",
                        align: "start",
                    },
                },
                {
                    element: "#ev-kudos",
                    popover: {
                        title: "❤️ Muro de Reconocimientos",
                        description:
                            "Celebra los logros de tus compañeros. <strong>El reconocimiento mutuo fortalece la cultura organizacional</strong> y motiva a todos a dar lo mejor de sí mismos.",
                        side: "top",
                        align: "start",
                    },
                },
                {
                    element: "#ev-perfil",
                    popover: {
                        title: "🏷️ Creador de Perfil",
                        description:
                            "Define tu identidad profesional. <strong>Estas competencias guiarán tu plan de desarrollo personalizado</strong> y ayudarán a la empresa a ubicarte en los proyectos donde más puedes brillar.",
                        side: "top",
                        align: "start",
                    },
                },
            ],
        })

        driverObj.drive()
    }, [])

    return (
        <Button
            onClick={startTour}
            variant="outline"
            className="flex items-center gap-2 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 font-bold transition-all rounded-2xl px-5"
        >
            <Map className="w-4 h-4" />
            Iniciar Recorrido
        </Button>
    )
}
