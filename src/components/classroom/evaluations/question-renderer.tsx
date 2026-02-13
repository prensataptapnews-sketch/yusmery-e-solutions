"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface Question {
    id: string
    question: string
    type: string
    options: string // Comma separated
    points: number
}

interface RendererProps {
    question: Question
    currentAnswer: any
    setAnswer: (value: any) => void
    disabled?: boolean
}

export function QuestionRenderer({ question, currentAnswer, setAnswer, disabled }: RendererProps) {
    const optionsArray = question.options ? question.options.split(',').map(o => o.trim()) : []

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium leading-tight">
                    {question.question}
                </h3>
                <Badge variant="outline">{question.points} pt{question.points !== 1 ? 's' : ''}</Badge>
            </div>

            {question.type === 'MULTIPLE_CHOICE' && (
                <RadioGroup
                    value={currentAnswer as string}
                    onValueChange={setAnswer}
                    disabled={disabled}
                    className="space-y-3"
                >
                    {optionsArray.map((option, idx) => (
                        <div key={idx} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-accent/50 transition-colors">
                            <RadioGroupItem value={option} id={`${question.id}-${idx}`} />
                            <Label htmlFor={`${question.id}-${idx}`} className="flex-1 cursor-pointer font-normal">
                                {option}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            )}

            {question.type === 'TRUE_FALSE' && (
                <RadioGroup
                    value={currentAnswer as string}
                    onValueChange={setAnswer}
                    disabled={disabled}
                    className="space-y-3"
                >
                    <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="Verdadero" id={`${question.id}-true`} />
                        <Label htmlFor={`${question.id}-true`} className="flex-1 cursor-pointer font-normal">Verdadero</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="Falso" id={`${question.id}-false`} />
                        <Label htmlFor={`${question.id}-false`} className="flex-1 cursor-pointer font-normal">Falso</Label>
                    </div>
                </RadioGroup>
            )}

            {question.type === 'OPEN_TEXT' && (
                <Textarea
                    value={currentAnswer as string || ""}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    disabled={disabled}
                    className="min-h-[150px]"
                />
            )}
        </div>
    )
}
