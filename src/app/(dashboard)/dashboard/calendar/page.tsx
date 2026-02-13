import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { CalendarView } from "@/components/dashboard/premium/calendar-view"

export default async function CalendarPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    // Fetch Enrollments and Evaluations for the calendar
    const enrollments = await prisma.enrollment.findMany({
        where: { userId: session.user.id },
        include: {
            course: {
                include: {
                    evaluations: true
                }
            }
        }
    })

    const events = enrollments.flatMap(en => {
        const courseEvents = []
        if (en.dueDate) {
            courseEvents.push({
                id: `en-${en.id}`,
                title: `Vencimiento: ${en.course.title}`,
                date: en.dueDate,
                type: "COURSE_DUE",
                color: "rose"
            })
        }

        en.course.evaluations.forEach(ev => {
            // For evaluations, we might use a logic or just show them assigned to a date if exists
            // Placeholder: using createdAt or current month distribution for demo if no dates
            courseEvents.push({
                id: `ev-${ev.id}`,
                title: ev.title,
                date: ev.createdAt, // Or a specific deadline if added to DB
                type: "EVALUATION",
                color: "indigo"
            })
        })

        return courseEvents
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Calendario Académico</h1>
                <p className="text-muted-foreground">Gestiona tus fechas límite y sesiones próximas</p>
            </div>

            <CalendarView events={events} />
        </div>
    )
}
