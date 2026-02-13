import Link from "next/link"
import { Clock, PlayCircle } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CourseCardProps {
    course: {
        id: string
        title: string
        slug: string
        thumbnail?: string | null
        duration?: number | null
        category?: string | null
    }
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
            <div className="relative aspect-video bg-muted overflow-hidden">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-200">
                        <PlayCircle className="h-12 w-12" />
                    </div>
                )}
                {course.category && (
                    <Badge className="absolute top-2 right-2 bg-white/90 text-teal-700 hover:bg-white">
                        {course.category}
                    </Badge>
                )}
            </div>
            <CardHeader className="p-4 pb-2">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-teal-600 transition-colors">
                    <Link href={`/classroom/courses/${course.id}`}>
                        {course.title}
                    </Link>
                </h3>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{course.duration ? `${course.duration} min` : "Duración variable"}</span>
                </div>
            </CardContent>
        </Card>
    )
}
