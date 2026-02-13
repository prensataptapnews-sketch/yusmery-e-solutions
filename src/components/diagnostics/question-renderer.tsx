
"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface QuestionRendererProps {
    question: {
        id: string
        type: string
        question: string
        options: string // JSON string
    }
    value: any
    onChange: (val: any) => void
}

export function QuestionRenderer({ question, value, onChange }: QuestionRendererProps) {
    const options = question.options ? JSON.parse(question.options) : []

    switch (question.type) {
        case 'MULTIPLE_CHOICE':
            return (
                <RadioGroup
                    value={value as string}
                    onValueChange={onChange}
                    className="space-y-3"
                >
                    {options.map((option: string, i: number) => (
                        <div key={i} className={cn(
                            "flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                            value === option && "border-primary bg-muted/50"
                        )}>
                            <RadioGroupItem value={option} id={`${question.id}-${i}`} />
                            <Label htmlFor={`${question.id}-${i}`} className="flex-1 cursor-pointer font-normal text-base">
                                {option}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            )

        case 'TRUE_FALSE':
            return (
                <RadioGroup
                    value={String(value)}
                    onValueChange={onChange}
                    className="grid grid-cols-2 gap-4"
                >
                    {['Verdadero', 'Falso'].map((option) => (
                        <div key={option} className={cn(
                            "flex items-center justify-center space-x-2 border rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors",
                            String(value) === option && "border-primary bg-muted/50"
                        )}>
                            <RadioGroupItem value={option} id={`${question.id}-${option}`} className="sr-only" />
                            <Label htmlFor={`${question.id}-${option}`} className="cursor-pointer text-lg font-medium text-center w-full">
                                {option}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            )

        case 'SCALE_1_5':
            return (
                <div className="space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground px-2">
                        <span>Totalmente en desacuerdo</span>
                        <span>Totalmente de acuerdo</span>
                    </div>
                    <RadioGroup
                        value={String(value)}
                        onValueChange={onChange}
                        className="flex justify-between gap-2"
                    >
                        {[1, 2, 3, 4, 5].map((num) => (
                            <div key={num} className="flex flex-col items-center gap-2">
                                <RadioGroupItem value={String(num)} id={`${question.id}-${num}`} className="peer sr-only" />
                                <Label
                                    htmlFor={`${question.id}-${num}`}
                                    className={cn(
                                        "flex h-12 w-12 items-center justify-center rounded-full border-2 border-muted bg-transparent hover:bg-muted/50 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer text-lg font-bold transition-all",
                                        String(value) === String(num) && "border-primary text-primary bg-primary/10"
                                    )}
                                >
                                    {num}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            )

        case 'OPEN_TEXT':
            return (
                <Textarea
                    value={value as string || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    className="min-h-[150px] resize-none text-base"
                />
            )

        default:
            return <div>Tipo de pregunta no soportado</div>
    }
}
