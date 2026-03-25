"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath, unstable_noStore as noStore } from "next/cache"

/**
 * Guarda una evaluación por competencias (Autoevaluación, 360, etc.)
 */
export async function saveCompetencyEvaluation(data: {
  userId?: string, 
  type: "SELF" | "PEER" | "LEADER" | "SYSTEM",
  scores: { name: string, score: number }[],
  feedback?: string
}) {
  const session = await auth()
  if (!session?.user?.id) return { error: "No autorizado" }

  const targetUserId = data.userId || session.user.id
  const evaluatorId = session.user.id

  try {
    const evaluation = await prisma.competencyEvaluation.create({
      data: {
        userId: targetUserId,
        evaluatorId: evaluatorId,
        type: data.type,
        status: "COMPLETED",
        feedback: data.feedback,
        scores: {
          create: data.scores.map(s => ({
            competencyName: s.name,
            score: s.score
          }))
        }
      }
    })

    revalidatePath("/dashboard/evaluaciones")
    return { success: true, id: evaluation.id }
  } catch (error) {
    console.error("Error al guardar evaluación:", error)
    return { error: "Error al persistir la evaluación" }
  }
}

/**
 * Envía un Kudo (Reconocimiento) entre colaboradores
 */
export async function sendKudo(data: {
  receiverId: string,
  message: string,
  category: string
}) {
  const session = await auth()
  if (!session?.user?.id) return { error: "No autorizado" }

  try {
    const kudo = await prisma.kudo.create({
      data: {
        senderId: session.user.id,
        receiverId: data.receiverId,
        message: data.message,
        category: data.category
      }
    })

    revalidatePath("/dashboard/evaluaciones/reconocimientos")
    return { success: true, id: kudo.id }
  } catch (error) {
    console.error("Error al enviar kudo:", error)
    return { error: "Error al registrar el reconocimiento" }
  }
}

/**
 * Registra o actualiza un resultado en la Matriz de Talento (9-Box)
 */
export async function update9BoxResult(data: {
  userId: string,
  period: string,
  performance: number,
  potential: number,
  comment?: string
}) {
  const session = await auth()
  if (!session?.user?.role || (session.user.role !== "PROFESOR" && session.user.role !== "ADMIN")) {
     // Solo administradores o profesores pueden calificar matriz
     // A menos que sea una autocalibración (pero usualmente es jerárquico)
  }

  try {
    const result = await prisma.talentMatrixResult.upsert({
      where: {
        userId_period: {
          userId: data.userId,
          period: data.period
        }
      },
      update: {
        performance: data.performance,
        potential: data.potential,
        comment: data.comment
      },
      create: {
        userId: data.userId,
        period: data.period,
        performance: data.performance,
        potential: data.potential,
        comment: data.comment
      }
    })

    revalidatePath("/dashboard/evaluaciones/matriz-talento")
    return { success: true, id: result.id }
  } catch (error) {
    console.error("Error al guardar 9-box:", error)
    return { error: "Error al actualizar matriz" }
  }
}

/**
 * Crea o actualiza una meta (OKR)
 */
export async function syncGoal(data: {
  id?: string,
  title: string,
  description?: string,
  status?: string,
  progress?: number,
  order?: number,
  dueDate?: Date,
  period?: string
}) {
  const session = await auth()
  if (!session?.user?.id) return { error: "No autorizado" }

  try {
    if (data.id) {
      const goal = await prisma.goal.update({
        where: { id: data.id },
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
          progress: data.progress,
          order: data.order,
          dueDate: data.dueDate,
          period: data.period
        }
      })
      revalidatePath("/dashboard/evaluaciones/mis-metas")
      return { success: true, id: goal.id }
    } else {
      const goal = await prisma.goal.create({
        data: {
          userId: session.user.id,
          title: data.title,
          description: data.description,
          status: data.status || "IN_PROGRESS",
          progress: data.progress || 0,
          order: data.order || 0,
          category: "OKR",
          dueDate: data.dueDate,
          period: data.period
        }
      })
      revalidatePath("/dashboard/evaluaciones/mis-metas")
      return { success: true, id: goal.id }
    }
  } catch (error) {
    console.error("Error al sincronizar meta:", error)
    return { error: "Error al guardar meta" }
  }
}

/**
 * Guarda la selección de pares para evaluación 360
 */
export async function savePeerNominations(peerIds: string[]) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return { error: "No autorizado" }

  try {
    // 1. Eliminar nominaciones pendientes anteriores (para permitir re-selección)
    await prisma.peerNomination.deleteMany({
      where: {
        userId: userId,
        status: "PENDING"
      }
    })

    // 2. Crear las nuevas nominaciones
    await prisma.peerNomination.createMany({
      data: peerIds.map(peerId => ({
        userId: userId,
        peerId: peerId,
        status: "PENDING"
      }))
    })

    revalidatePath("/dashboard/evaluaciones/seleccionar-pares")
    return { success: true }
  } catch (error) {
    console.error("Error al guardar nominaciones:", error)
    return { error: "Error al guardar la selección de pares" }
  }
}

/**
 * Obtiene el feed de Kudos (Reconocimientos)
 */
export async function getKudos() {
  try {
    const kudos = await prisma.kudo.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { name: true, avatar: true } },
        receiver: { select: { name: true, avatar: true } }
      },
      take: 20
    })

    return kudos.map(k => ({
      id: k.id,
      senderName: k.sender.name || "Usuario",
      receiverName: k.receiver.name || "Equipo",
      message: k.message,
      claps: 0,
      timestamp: k.createdAt.toISOString()
    }))
  } catch (error) {
    console.error("Error fetching kudos:", error)
    return []
  }
}

/**
 * Obtiene la lista de usuarios para seleccionar en reconocimientos o pares
 */
export async function getTeamMembers() {
  try {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, role: true, avatar: true }
    })
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

/**
 * Obtiene las metas/OKRs del usuario
 */
export async function getGoals() {
  const session = await auth()
  noStore()
  if (!session?.user?.id) return []

  try {
    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
      orderBy: { order: 'asc' }
    })
    return goals
  } catch (error) {
    console.error("Error fetching goals:", error)
    return []
  }
}

/**
 * Guarda un pulso de clima laboral (anónimo o trackeado)
 */
export async function saveClimateResponse(data: {
  category: string,
  score: number,
  comment?: string
}) {
  const session = await auth()
  const userId = session?.user?.id

  try {
    const response = await prisma.climateResponse.create({
      data: {
        userId: userId, // Puede ser null si el esquema lo permite, pero aquí lo asociamos si existe sesión
        category: data.category,
        score: data.score,
        comment: data.comment
      }
    })

    return { success: true, id: response.id }
  } catch (error) {
    console.error("Error al guardar respuesta de clima:", error)
    return { error: "Error al registrar el pulso de clima" }
  }
}

/**
 * Inyecta metas de ejemplo (OKRs) si el usuario no tiene ninguna.
 */
export async function seedUserGoals() {
  const session = await auth()
  if (!session?.user?.id) return { error: "No autorizado" }

  try {
    console.log("SEED: Iniciando para usuario:", session.user.id)
    const existing = await prisma.goal.count({
      where: { userId: session.user.id }
    })
    console.log("SEED: Metas existentes:", existing)

    if (existing > 0) return { success: true, message: "Ya existen metas" }

    const sampleGoals = [
      {
        title: "Incrementar CSAT a 4.8/5",
        description: "Mejorar la satisfacción del cliente a través de mejores tiempos de respuesta.",
        category: "OKR",
        order: 0,
        status: "IN_PROGRESS",
        progress: 65,
      },
      {
        title: "Completar Certificación AWS Developer",
        description: "Obtener la certificación oficial para fortalecer las capacidades cloud del equipo.",
        category: "PROFESSIONAL",
        order: 1,
        status: "IN_PROGRESS",
        progress: 30,
      },
      {
        title: "Documentar el 100% de la API Core",
        description: "Asegurar que todos los endpoints tengan documentación en Swagger/OpenAPI.",
        category: "OKR",
        order: 2,
        status: "PAUSED",
        progress: 85,
      },
      {
        title: "Lanzar Módulo de Loyalty v2",
        description: "Puesta en producción de las nuevas funcionalidades de fidelización.",
        category: "OKR",
        order: 3,
        status: "IN_PROGRESS",
        progress: 10,
      }
    ]

    console.log(`SEED: Preparando para crear ${sampleGoals.length} metas para ${session.user.id}`)
    for (const g of sampleGoals) {
      const created = await prisma.goal.create({
        data: {
          ...g,
          userId: session.user.id
        }
      })
      console.log("SEED: Meta creada:", created.id)
    }

    revalidatePath("/dashboard/evaluaciones/mis-metas")
    return { success: true, created: sampleGoals.length }
  } catch (error) {
    console.error("Error seeding goals:", error)
    return { error: "Error al inyectar datos" }
  }
}
