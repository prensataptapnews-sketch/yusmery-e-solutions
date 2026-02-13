
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Area } from "@prisma/client"

export default async function AdminUsersPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMINISTRADOR' && session.user.role !== 'SUPER_ADMIN') {
        redirect("/login");
    }

    const { default: prisma } = await import("@/lib/prisma")

    // Logic to get area filter (reused from dashboard, could be extracted to util)
    let userAreas: Area[] = [];
    if (session.user.role === 'SUPER_ADMIN') {
        userAreas = Object.values(Area);
    } else {
        // @ts-ignore
        const assignedString = session.user.assignedAreas as any;
        // @ts-ignore
        const singleArea = session.user.area as Area;
        if (assignedString) {
            try {
                const str = typeof assignedString === 'string' ? assignedString : JSON.stringify(assignedString);
                const parsed = JSON.parse(str.replace(/'/g, '"'));
                userAreas = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) { if (singleArea) userAreas = [singleArea]; }
        } else if (singleArea) {
            userAreas = [singleArea];
        }
    }

    // Fetch users in area
    const users = await prisma.user.findMany({
        where: {
            area: { in: userAreas }
        },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { enrollments: true }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Colaboradores</h1>
                <p className="text-muted-foreground">Gestión de usuarios en {userAreas.join(", ")}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <Card key={user.id}>
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar || ""} />
                                <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-base">{user.name}</CardTitle>
                                <CardDescription className="text-xs truncate max-w-[180px]">{user.email}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="secondary" className="text-xs">{user.role}</Badge>
                                <Badge variant="outline" className="text-xs">{user.area}</Badge>
                            </div>
                            <div className="text-xs text-slate-500">
                                <span className="font-semibold">{user._count.enrollments}</span> cursos inscritos
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {users.length === 0 && (
                <div className="text-center py-10 text-slate-500">No se encontraron colaboradores en esta área.</div>
            )}
        </div>
    )
}
