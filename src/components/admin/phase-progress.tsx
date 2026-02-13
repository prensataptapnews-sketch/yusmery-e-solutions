"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Phase {
    name: string
    progress: number
    status: "completed" | "active" | "pending"
}

interface PhaseProgressProps {
    phases: Phase[]
}

export function PhaseProgress({ phases }: PhaseProgressProps) {
    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Avance por Etapa del Programa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {phases.map((phase, index) => (
                    <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{phase.name}</span>
                            <span className="text-muted-foreground">{phase.progress}%</span>
                        </div>
                        <Progress
                            value={phase.progress}
                            className="h-3"
                        // Custom visual logic for colors could go here via CSS vars or cn()
                        // For MVP default generic teal color is fine, but we can enhance later
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
