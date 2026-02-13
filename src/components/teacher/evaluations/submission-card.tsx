"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ClipboardCheck, GraduationCap } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface SubmissionCardProps {
    submission: {
        id: string
        student: {
            name: string | null
            avatar: string | null
            email: string
        }
        evaluation: {
            title: string
            type: string
        }
        course: {
            title: string
        }
        score: number
        maxScore: number
        percentage: number
        status: string
        submittedAt: Date
    }
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
    const initials = submission.student.name
        ? submission.student.name.substring(0, 2).toUpperCase()
        : "ST"

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                        <Avatar className="h-10 w-10 border">
                            <AvatarImage src={submission.student.avatar || ""} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-sm">{submission.student.name || submission.student.email}</h3>
                            <div className="flex items-center text-xs text-muted-foreground gap-1">
                                <GraduationCap className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">{submission.course.title}</span>
                            </div>
                        </div>
                    </div>
                    <Badge variant={submission.status === 'pendiente' ? "secondary" : "default"}>
                        {submission.status === 'pendiente' ? 'Pendiente revisión' : 'Revisado'}
                    </Badge>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{submission.evaluation.title}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(submission.submittedAt), "d MMM, yyyy - HH:mm", { locale: es })}</span>
                    </div>

                    <div className="mt-2 pt-2 border-t flex justify-between items-center">
                        <div className="text-sm">
                            <span className="font-bold">{submission.score}/{submission.maxScore}</span>
                            <span className="text-muted-foreground ml-1">({submission.percentage}%)</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-3">
                <Button className="w-full h-8 text-xs" variant="outline">
                    <ClipboardCheck className="mr-2 h-3 w-3" />
                    Revisar y dar feedback
                </Button>
            </CardFooter>
        </Card>
    )
}
