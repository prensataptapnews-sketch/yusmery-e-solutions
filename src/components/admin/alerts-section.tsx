"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertItem {
    type: "warning" | "error" | "info"
    message: string
}

interface AlertsSectionProps {
    alerts: AlertItem[]
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Alertas y Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {alerts.map((alert, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex items-center gap-4 rounded-md border p-4",
                            alert.type === "error" && "border-red-200 bg-red-50 text-red-900",
                            alert.type === "warning" && "border-yellow-200 bg-yellow-50 text-yellow-900",
                            alert.type === "info" && "border-blue-200 bg-blue-50 text-blue-900"
                        )}
                    >
                        {alert.type === "error" && <AlertCircle className="h-5 w-5" />}
                        {alert.type === "warning" && <AlertTriangle className="h-5 w-5" />}
                        {alert.type === "info" && <Info className="h-5 w-5" />}
                        <p className="text-sm font-medium">{alert.message}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
