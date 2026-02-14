"use client"

import React, { ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw } from "lucide-react"

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="flex flex-col items-center justify-center p-8 m-4 border-2 border-dashed border-red-200 rounded-xl bg-red-50 text-center space-y-4">
                    <div className="p-3 bg-red-100 rounded-full">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-red-900">Algo salió mal</h3>
                        <p className="text-sm text-red-700 max-w-md">
                            Ocurrió un error al cargar esta sección. Por favor, intenta recargar la página.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.reload()}
                        className="bg-white border-red-200 text-red-700 hover:bg-red-100"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Reintentar
                    </Button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
