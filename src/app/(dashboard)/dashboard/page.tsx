import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { HeroCard } from "@/components/dashboard/hero-card"
import { CourseCard } from "@/components/dashboard/course-card"
import { auth } from "@/lib/auth"
import { getStudentDashboardData } from "@/app/actions/dashboard"

// Premium Components
import { PerformanceAnalytics } from "@/components/dashboard/premium/performance-analytics"
import { SmartAgenda } from "@/components/dashboard/premium/smart-agenda"
import { AchievementsGallery } from "@/components/dashboard/premium/achievements-gallery"
import { ResourceVault } from "@/components/dashboard/premium/resource-vault"
import { TutorHub } from "@/components/dashboard/premium/tutor-hub"
import { CareerRoadmap } from "@/components/dashboard/premium/career-roadmap"
import { CommunityFeed } from "@/components/dashboard/premium/community-feed"

export default async function DashboardPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const data = await getStudentDashboardData()

    const dashboardData: any = data || {
        currentCourse: null,
        courses: [],
        stats: { totalCourses: 0, completed: 0, inProgress: 0, avgProgress: 0 },
        performance: [],
        agenda: [],
        resources: [],
        tutorMessages: [],
        achievements: []
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        Hola, {session.user?.name?.split(" ")[0] || "Colaborador"} 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Tienes {dashboardData.stats.inProgress} cursos en progreso hoy.
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>
            </section>

            {/* Top Row: Hero */}
            <section>
                <HeroCard course={dashboardData.currentCourse as any} />
            </section>

            {/* Main Content Grid: Bento Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Analytics & Agenda Block (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-1">
                            <PerformanceAnalytics data={dashboardData.performance || []} stats={dashboardData.stats} />
                        </div>
                        <div className="md:col-span-1">
                            <SmartAgenda items={dashboardData.agenda || []} />
                        </div>
                    </div>

                    {/* Courses List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Mis Cursos</h2>
                            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Ver todos</button>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                            {dashboardData.courses.length > 0 ? (
                                dashboardData.courses.slice(0, 4).map((course: any) => (
                                    <CourseCard key={course.id} course={course} />
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center text-muted-foreground bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                    No tienes cursos asignados por el momento.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Block (1/3 width) */}
                <div className="lg:col-span-1 space-y-8">
                    <AchievementsGallery />
                    <TutorHub />
                    <CareerRoadmap />
                </div>
            </div>

            {/* Bottom Section: Social & Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ResourceVault resources={dashboardData.resources || []} />
                <CommunityFeed />
            </div>
        </div>
    )
}
