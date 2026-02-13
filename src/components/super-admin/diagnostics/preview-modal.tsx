"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface PreviewDiagnosticModalProps {
    diagnostic: any // Using any for simplicity in mock/prisma mix, strictly should be typed
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PreviewDiagnosticModal({ diagnostic, open, onOpenChange }: PreviewDiagnosticModalProps) {
    if (!diagnostic) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <DialogTitle>{diagnostic.title}</DialogTitle>
                        <Badge variant="secondary">{diagnostic.category}</Badge>
                    </div>
                    <DialogDescription>
                        {diagnostic.description || "Sin descripción"}
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-6 py-4">
                        {diagnostic.questions && diagnostic.questions.length > 0 ? (
                            diagnostic.questions.map((q: any, i: number) => (
                                <div key={i} className="space-y-3 p-4 border rounded-lg bg-slate-50/50">
                                    <h3 className="font-medium text-sm flex gap-2">
                                        <span className="text-muted-foreground">{i + 1}.</span>
                                        {q.text}
                                    </h3>

                                    {q.options && (
                                        <RadioGroup>
                                            {q.options.map((opt: any, j: number) => (
                                                <div key={j} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={String(j)} id={`q${i}-opt${j}`} />
                                                    <Label htmlFor={`q${i}-opt${j}`} className="font-normal text-slate-600">
                                                        {opt.text}
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                Este diagnóstico no tiene preguntas configuradas aún.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
