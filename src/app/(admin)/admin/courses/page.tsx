
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users } from "lucide-react"
import { Area } from "@prisma/client"

export default async function AdminCoursesPage() {
    const session = await auth();

    if (!session?.user || !['ADMIN', 'ADMINISTRADOR', 'SUPER_ADMIN'].includes(session.user.role as string)) {
        redirect("/login");
    }

    const { default: prisma } = await import("@/lib/prisma")

    let userAreas: Area[] = [];
    if (session.user.role === 'SUPER_ADMIN') {
        userAreas = Object.values(Area);
    } else {
        // @ts-ignore
        const assigned = session.user.assignedAreas as any;
        // @ts-ignore
        const singleArea = session.user.area as Area;

        if (Array.isArray(assigned)) {
            userAreas = assigned as Area[];
        } else if (typeof assigned === 'string') {
            try {
                const parsed = JSON.parse(assigned.replace(/'/g, '"'));
                userAreas = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                if (singleArea) userAreas = [singleArea];
            }
        } else if (singleArea) {
            userAreas = [singleArea];
        }
    }

    // Fetch courses taught by teachers in this area OR just listing all courses?
    // Usually Admin wants to see courses their users are taking OR courses managed by their area.
    // Let's list courses where teachers are from this area.
    const courses = await prisma.course.findMany({
        where: {
            teacher: {
                area: { in: userAreas }
            }
        },
        include: {
            teacher: { select: { name: true } },
            _count: { select: { enrollments: true, modules: true } }
        }
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Cursos del Área</h1>
                <p className="text-muted-foreground">Cursos gestionados por instructores de {userAreas.join(", ")}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                        <div className="h-32 bg-slate-100 relative items-center justify-center flex">
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                                <BookOpen className="h-10 w-10 text-slate-300" />
                            )}
                            <Badge className={course.published ? "bg-green-500 absolute top-2 right-2" : "bg-slate-500 absolute top-2 right-2"}>
                                {course.published ? "Publicado" : "Borrador"}
                            </Badge>
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                            <CardDescription>{course.teacher?.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-sm text-slate-500">
                                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course._count.enrollments}</span>
                                <span>{course.level}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {courses.length === 0 && (
                <div className="text-center py-10 text-slate-500">No hay cursos gestionados por instructores de esta área.</div>
            )}
        </div>
    )
}
