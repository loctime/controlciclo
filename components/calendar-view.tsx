"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Plus, Settings, TrendingUp, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { SymptomLogModal, type SymptomLog } from "@/components/symptom-log-modal"
import { StatisticsView } from "@/components/statistics-view"
import { SettingsView } from "@/components/settings-view"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./auth-provider"
import { usePWAInstall } from "@/hooks/use-pwa-install"
import { 
  subscribeToUserData, 
  subscribeToSymptomLogs, 
  saveSymptomLog,
  type UserData,
  type SymptomLog as FirestoreSymptomLog
} from "@/lib/firestore-service"

interface PeriodLog {
  startDate: string
  endDate?: string
  symptoms?: string[]
}

export function CalendarView() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { isInstallable, isInstalled, installPWA } = usePWAInstall()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [userData, setUserData] = useState<UserData | null>(null)
  const [periodLogs, setPeriodLogs] = useState<PeriodLog[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [symptomModalOpen, setSymptomModalOpen] = useState(false)
  const [symptomLogsState, setSymptomLogsState] = useState<FirestoreSymptomLog[]>([])
  const [showStatistics, setShowStatistics] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (!user) return

    // Subscribe to user data changes
    const unsubscribeUserData = subscribeToUserData(user.uid, (data) => {
      setUserData(data)
    })

    // Subscribe to symptom logs changes
    const unsubscribeSymptomLogs = subscribeToSymptomLogs(user.uid, (logs) => {
      setSymptomLogsState(logs)
    })

    // Cleanup subscriptions
    return () => {
      unsubscribeUserData()
      unsubscribeSymptomLogs()
    }
  }, [user])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const isPeriodDay = (date: Date): boolean => {
    if (!userData) return false

    const dateStr = date.toISOString().split("T")[0]

    // Check logged periods
    for (const log of periodLogs) {
      const start = new Date(log.startDate)
      const end = log.endDate
        ? new Date(log.endDate)
        : new Date(start.getTime() + userData.periodLength * 24 * 60 * 60 * 1000)

      if (date >= start && date <= end) {
        return true
      }
    }

    // Check initial period from onboarding
    const lastPeriod = new Date(userData.lastPeriodDate)
    const periodEnd = new Date(lastPeriod.getTime() + userData.periodLength * 24 * 60 * 60 * 1000)

    if (date >= lastPeriod && date <= periodEnd) {
      return true
    }

    return false
  }

  const isPredictedPeriod = (date: Date): boolean => {
    if (!userData) return false

    const lastPeriod = new Date(userData.lastPeriodDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Only show predictions for future dates
    if (date <= today) return false

    // Calculate next predicted period
    const daysSinceLastPeriod = Math.floor((date.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
    const cycleNumber = Math.floor(daysSinceLastPeriod / userData.cycleLength)
    const dayInCycle = daysSinceLastPeriod % userData.cycleLength

    // Predicted period days
    if (dayInCycle >= 0 && dayInCycle < userData.periodLength) {
      return true
    }

    return false
  }

  const isFertileWindow = (date: Date): boolean => {
    if (!userData) return false

    const lastPeriod = new Date(userData.lastPeriodDate)
    const daysSinceLastPeriod = Math.floor((date.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
    const dayInCycle = daysSinceLastPeriod % userData.cycleLength

    // Fertile window is typically days 10-17 of cycle (ovulation around day 14)
    return dayInCycle >= 10 && dayInCycle <= 17
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const isPeriod = isPeriodDay(date)
      const isPredicted = isPredictedPeriod(date)
      const isFertile = isFertileWindow(date)
      const isCurrentDay = isToday(date)

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={cn(
            "aspect-square rounded-lg p-2 text-sm transition-colors hover:bg-muted",
            isCurrentDay && "ring-2 ring-primary ring-offset-2",
            isPeriod && "bg-primary text-primary-foreground hover:bg-primary/90",
            isPredicted && !isPeriod && "bg-primary/20 text-primary hover:bg-primary/30",
            isFertile && !isPeriod && !isPredicted && "bg-secondary/30 text-secondary-foreground",
          )}
        >
          <div className="flex h-full flex-col items-center justify-center">
            <span className={cn("font-medium", isCurrentDay && !isPeriod && "font-bold")}>{day}</span>
            {isPeriod && <div className="mt-1 h-1 w-1 rounded-full bg-primary-foreground" />}
            {isPredicted && !isPeriod && <div className="mt-1 h-1 w-1 rounded-full bg-primary opacity-50" />}
          </div>
        </button>,
      )
    }

    return days
  }

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

  const getDaysUntilNextPeriod = (): number | null => {
    const nextPeriod = getNextPeriodDate()
    if (!nextPeriod) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return Math.ceil((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const daysUntilNext = getDaysUntilNextPeriod()

  const handleSaveSymptomLog = async (log: SymptomLog) => {
    if (!user) {
      toast({
        title: "Error",
        description: "No hay usuario autenticado",
        variant: "destructive",
      })
      return
    }

    try {
      await saveSymptomLog(user.uid, log)
      toast({
        title: "Síntomas registrados",
        description: "Tus síntomas se han guardado exitosamente.",
      })
    } catch (error) {
      console.error('Error saving symptom log:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar el registro. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleInstallPWA = async () => {
    const installed = await installPWA()
    if (installed) {
      toast({
        title: "¡App instalada!",
        description: "ControlCiclo se ha instalado en tu dispositivo.",
      })
    }
  }

  if (showStatistics) {
    return <StatisticsView onClose={() => setShowStatistics(false)} />
  }

  if (showSettings) {
    return <SettingsView onClose={() => setShowSettings(false)} />
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Tu Ciclo</h1>
            {daysUntilNext !== null && (
              <p className="text-sm text-muted-foreground">
                Próximo periodo en <span className="font-medium text-foreground">{daysUntilNext} días</span>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {!isInstalled && isInstallable && (
              <Button variant="outline" size="icon" onClick={handleInstallPWA} title="Instalar App">
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="icon" onClick={() => setShowStatistics(true)}>
              <TrendingUp className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="flex flex-wrap gap-4 p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-primary" />
              <span className="text-sm text-muted-foreground">Periodo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-primary/20" />
              <span className="text-sm text-muted-foreground">Predicción</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-secondary/30" />
              <span className="text-sm text-muted-foreground">Ventana Fértil</span>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-xl">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="cursor-pointer transition-colors hover:bg-muted/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Registrar Periodo</CardTitle>
                  <CardDescription className="text-xs">Registra tu ciclo actual</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer transition-colors hover:bg-muted/50"
            onClick={() => setSymptomModalOpen(true)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                  <Plus className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-base">Registrar Síntomas</CardTitle>
                  <CardDescription className="text-xs">Registra cómo te sientes</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      <SymptomLogModal
        open={symptomModalOpen}
        onOpenChange={setSymptomModalOpen}
        selectedDate={selectedDate || undefined}
        onSave={handleSaveSymptomLog}
      />
    </div>
  )
}
