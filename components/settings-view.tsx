"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { X, Save, Trash2, Shield, Calendar, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserData {
  cycleLength: number
  periodLength: number
  lastPeriodDate: string
  setupDate: string
}

interface SettingsViewProps {
  onClose: () => void
}

export function SettingsView({ onClose }: SettingsViewProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [cycleLength, setCycleLength] = useState("")
  const [periodLength, setPeriodLength] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const data = localStorage.getItem("period_tracker_user_data")
    if (data) {
      const parsed = JSON.parse(data)
      setUserData(parsed)
      setCycleLength(parsed.cycleLength.toString())
      setPeriodLength(parsed.periodLength.toString())
    }
  }, [])

  const handleSaveSettings = () => {
    if (!userData) return

    const cycleLengthNum = Number.parseInt(cycleLength)
    const periodLengthNum = Number.parseInt(periodLength)

    if (cycleLengthNum < 21 || cycleLengthNum > 35) {
      toast({
        title: "Duración de ciclo inválida",
        description: "La duración del ciclo debe estar entre 21-35 días.",
        variant: "destructive",
      })
      return
    }

    if (periodLengthNum < 2 || periodLengthNum > 10) {
      toast({
        title: "Duración de periodo inválida",
        description: "La duración del periodo debe estar entre 2-10 días.",
        variant: "destructive",
      })
      return
    }

    const updatedData = {
      ...userData,
      cycleLength: cycleLengthNum,
      periodLength: periodLengthNum,
    }

    localStorage.setItem("period_tracker_user_data", JSON.stringify(updatedData))
    setUserData(updatedData)

    toast({
      title: "Configuración guardada",
      description: "Tu configuración de ciclo se ha actualizado exitosamente.",
    })
  }

  const handleDeleteAllData = () => {
    localStorage.removeItem("period_tracker_user_data")
    localStorage.removeItem("period_tracker_logs")
    localStorage.removeItem("period_tracker_symptom_logs")
    localStorage.removeItem("period_tracker_onboarded")

    toast({
      title: "Datos eliminados",
      description: "Todos tus datos han sido eliminados permanentemente.",
    })

    // Reload the page to restart onboarding
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  const handleExportData = () => {
    const allData = {
      userData: localStorage.getItem("period_tracker_user_data"),
      logs: localStorage.getItem("period_tracker_logs"),
      symptomLogs: localStorage.getItem("period_tracker_symptom_logs"),
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(allData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cycle-tracker-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Datos exportados",
      description: "Tus datos se han descargado como un archivo JSON.",
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Configuración</h1>
            <p className="text-sm text-muted-foreground">Administra tus preferencias de seguimiento de ciclo</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cycle Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Configuración del Ciclo
            </CardTitle>
            <CardDescription>Actualiza la duración promedio de tu ciclo y periodo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cycle-length-setting">Duración Promedio del Ciclo</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="cycle-length-setting"
                  type="number"
                  min="21"
                  max="35"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                />
                <span className="text-sm text-muted-foreground">días</span>
              </div>
              <p className="text-xs text-muted-foreground">Rango típico: 21-35 días</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period-length-setting">Duración del Periodo</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="period-length-setting"
                  type="number"
                  min="2"
                  max="10"
                  value={periodLength}
                  onChange={(e) => setPeriodLength(e.target.value)}
                />
                <span className="text-sm text-muted-foreground">días</span>
              </div>
              <p className="text-xs text-muted-foreground">Rango típico: 2-10 días</p>
            </div>

            <Button onClick={handleSaveSettings} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacidad y Datos
            </CardTitle>
            <CardDescription>Administra tus datos personales y privacidad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
                <Info className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Tus datos se almacenan localmente</p>
                  <p className="text-xs text-muted-foreground">
                    Todos tus datos de ciclo, síntomas y registros se almacenan solo en tu dispositivo. No recopilamos, almacenamos ni
                    compartimos ninguna de tu información personal con terceros.
                  </p>
                </div>
              </div>

              <Button onClick={handleExportData} variant="outline" className="w-full bg-transparent">
                <Save className="mr-2 h-4 w-4" />
                Exportar Mis Datos
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar Todos los Datos
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás completamente segura?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente todos tus datos de ciclo, registros de síntomas y
                      configuración de tu dispositivo.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAllData}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Eliminar Todo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Acerca de
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">ControlCiclo v1.0</p>
              <p className="text-xs">Una aplicación de seguimiento de periodo enfocada en privacidad</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Descargo de responsabilidad</p>
              <p className="text-xs">
                Esta aplicación es solo para fines informativos y no debe usarse como sustituto de consejo médico profesional.
                Las predicciones son estimaciones basadas en tus datos de ciclo y pueden no ser precisas para todas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
