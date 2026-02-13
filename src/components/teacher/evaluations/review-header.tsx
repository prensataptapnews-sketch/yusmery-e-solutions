import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { GraduationCap, Calendar, User } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ReviewHeaderProps {
    submission: {
        user: {
            name: string | null
            email: string | null
            avatar: string | null
        }
        evaluation: {
            title: string
        }
        courseTitle: string
        score: number
        maxScore: number
        percentage: number
        passed: boolean
        submittedAt: Date
    }
}

export function ReviewHeader({ submission }: ReviewHeaderProps) {
    const initials = submission.user.name
        ? submission.user.name.substring(0, 2).toUpperCase()
        : "AL"

    return (
        <Card className="mb-6">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Student Info */}
                    <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 border-2 border-muted">
                            <AvatarImage src={submission.user.avatar || ""} />
                            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-lg font-bold">{submission.user.name || "Alumno"}</h2>
                            <p className="text-sm text-muted-foreground mb-1">{submission.user.email}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded w-fit">
                                <GraduationCap className="h-3 w-3" />
                                <span>{submission.courseTitle}</span>
                            </div>
                        </div>
                    </div>

                    {/* Score Info */}
                    <div className="flex flex-col items-end min-w-[150px]">
                        <div className="text-3xl font-bold">
                            {submission.score}<span className="text-lg text-muted-foreground">/{submission.maxScore}</span>
                        </div>
                        <div className={`text-sm font-medium ${submission.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {submission.percentage}% ({submission.passed ? 'Aprobado' : 'No aprobado'})
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(submission.submittedAt), "d MMM yyyy, HH:mm", { locale: es })}</span>
                        </div>
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{submission.evaluation.title}</h3>
                    <Badge variant={submission.passed ? "default" : "destructive"}>
                        {submission.passed ? "Aprobado" : "Reprobado"}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}
