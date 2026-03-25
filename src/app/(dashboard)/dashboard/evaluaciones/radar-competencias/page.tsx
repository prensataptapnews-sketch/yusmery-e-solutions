import { getCompetencyRadarData } from "@/app/actions/bi-actions"
import { RadarClient } from "./RadarClient"

export const metadata = {
  title: "Radar de Competencias | E-Learning",
  description: "Visualización de brechas y fortalezas profesionales.",
}

export default async function CompetencyRadarPage() {
    const radarData = await getCompetencyRadarData()

    return <RadarClient initialData={radarData} />
}
