"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Calendar, TrendingUp, Activity, Heart, Droplets } from "lucide-react"
import { useAuth } from "./auth-provider"
import { 
  getUserData, 
  getSymptomLogs,
  type UserData,
  type SymptomLog 
} from "@/lib/firestore-service"

interface StatisticsViewProps {
  onClose: () => void
}

export function StatisticsView({ onClose }: StatisticsViewProps) {
  const { user } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      try {
        const [userDataResult, symptomLogsResult] = await Promise.all([
          getUserData(user.uid),
          getSymptomLogs(user.uid)
        ])

        setUserData(userDataResult)
        setSymptomLogs(symptomLogsResult)
      } catch (error) {
        console.error('Error loading statistics data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user])

  const getNextPeriodDate = (): Date | null => {
    if (!userData) return null

    const lastPeriod = new Date(userData.lastPeriodDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let nextPeriod = new Date(lastPeriod)
    while (nextPeriod <= today) {
      nextPeriod = new Date(nextPeriod.getTime() + userData.cycleLength * 24 * 60 * 60 * 1000)
    }

    return nextPeriod
  }

  const getOvulationDate = (): Date | null => {
    if (!userData) return null

    const lastPeriod = new Date(userData.lastPeriodDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Ovulation typically occurs 14 days before next period
    let nextPeriod = new Date(lastPeriod)
    while (nextPeriod <= today) {
      nextPeriod = new Date(nextPeriod.getTime() + userData.cycleLength * 24 * 60 * 60 * 1000)
    }

    const ovulation = new Date(nextPeriod.getTime() - 14 * 24 * 60 * 60 * 1000)
    return ovulation
  }

  const getCurrentPhase = (): string => {
    if (!userData) return "Desconocida"

    const lastPeriod = new Date(userData.lastPeriodDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
    const dayInCycle = daysSinceLastPeriod % userData.cycleLength

    if (dayInCycle < userData.periodLength) {
      return "Menstrual"
    } else if (dayInCycle < 14) {
      return "Folicular"
    } else if (dayInCycle >= 14 && dayInCycle < 17) {
      return "Ovulación"
    } else {
      return "Lútea"
    }
  }

  const getPhaseDescription = (phase: string): string => {
    switch (phase) {
      case "Menstrual":
        return "Tu periodo está aquí. Enfócate en descansar y cuidarte."
      case "Folicular":
        return "Los niveles de energía están aumentando. Buen momento para nuevos proyectos."
      case "Ovulación":
        return "Pico de ventana fértil. Puedes sentirte más enérgica."
      case "Lútea":
        return "La energía puede disminuir. Escucha las necesidades de tu cuerpo."
      default:
        return ""
    }
  }

  const getMostCommonSymptoms = (): { symptom: string; count: number }[] => {
    const symptomCounts: Record<string, number> = {}

    symptomLogs.forEach((log) => {
      log.symptoms.forEach((symptom) => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
      })
    })

    return Object.entries(symptomCounts)
      .map(([symptom, count]) => ({ symptom, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const getMostCommonMood = (): string | null => {
    const moodCounts: Record<string, number> = {}

    symptomLogs.forEach((log) => {
      if (log.mood) {
        moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1
      }
    })

    const entries = Object.entries(moodCounts)
    if (entries.length === 0) return null

    return entries.sort((a, b) => b[1] - a[1])[0][0]
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("es-ES", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatSymptomName = (symptom: string): string => {
    return symptom
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const nextPeriod = getNextPeriodDate()
  const ovulation = getOvulationDate()
  const currentPhase = getCurrentPhase()
  const commonSymptoms = getMostCommonSymptoms()
  const commonMood = getMostCommonMood()

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Información y Estadísticas</h1>
            <p className="text-sm text-muted-foreground">Patrones y predicciones de tu ciclo</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Current Phase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Fase Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-semibold text-foreground">{currentPhase}</p>
              <p className="text-sm text-muted-foreground">{getPhaseDescription(currentPhase)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Predictions */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-primary" />
                Próximo Periodo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground">{nextPeriod ? formatDate(nextPeriod) : "N/A"}</p>
              <p className="mt-1 text-xs text-muted-foreground">Fecha de inicio predicha</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-4 w-4 text-secondary" />
                Próxima Ovulación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-foreground">{ovulation ? formatDate(ovulation) : "N/A"}</p>
              <p className="mt-1 text-xs text-muted-foreground">Fecha de ovulación estimada</p>
            </CardContent>
          </Card>
        </div>

        {/* Cycle Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Estadísticas del Ciclo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Ciclo Promedio</p>
                <p className="text-2xl font-semibold text-foreground">{userData?.cycleLength || 0} días</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duración del Periodo</p>
                <p className="text-2xl font-semibold text-foreground">{userData?.periodLength || 0} días</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registros Guardados</p>
                <p className="text-2xl font-semibold text-foreground">{symptomLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Symptoms */}
        {commonSymptoms.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                Síntomas Más Comunes
              </CardTitle>
              <CardDescription>Basado en tus datos registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {commonSymptoms.map((item, index) => (
                  <div key={item.symptom} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-foreground">{formatSymptomName(item.symptom)}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.count} veces</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mood Insights */}
        {commonMood && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-secondary" />
                Información del Estado de Ánimo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tu estado de ánimo más común es{" "}
                <span className="font-medium text-foreground">
                  {commonMood.charAt(0).toUpperCase() + commonMood.slice(1)}
                </span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Educational Info */}
        <Card className="border-secondary/20 bg-secondary/5">
          <CardHeader>
            <CardTitle className="text-base">Entendiendo Tu Ciclo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">Fase Menstrual (Días 1-5)</p>
              <p>Tu periodo comienza. Los niveles hormonales están bajos, lo que puede causar fatiga.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Fase Folicular (Días 6-13)</p>
              <p>El estrógeno aumenta, mejorando energía y ánimo. Buen momento para la productividad.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Fase de Ovulación (Días 14-16)</p>
              <p>Pico de ventana fértil. Puedes sentirte más confiada y enérgica.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Fase Lútea (Días 17-28)</p>
              <p>La progesterona sube y luego baja. Los síntomas de SPM pueden aparecer antes del periodo.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
