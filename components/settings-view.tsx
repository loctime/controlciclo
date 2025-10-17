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
import { X, Save, Trash2, Shield, Calendar, Info, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./auth-provider"
import { 
  getUserData, 
  updateUserSettings, 
  deleteAllUserData, 
  exportUserData,
  type UserData 
} from "@/lib/firestore-service"

interface SettingsViewProps {
  onClose: () => void
}

export function SettingsView({ onClose }: SettingsViewProps) {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [cycleLength, setCycleLength] = useState("")
  const [periodLength, setPeriodLength] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return

      try {
        const data = await getUserData(user.uid)
        if (data) {
          setUserData(data)
          setCycleLength(data.cycleLength.toString())
          setPeriodLength(data.periodLength.toString())
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del usuario",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [user, toast])

  const handleSaveSettings = async () => {
    if (!user || !userData) return

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

    setIsSaving(true)
    try {
      await updateUserSettings(user.uid, {
        cycleLength: cycleLengthNum,
        periodLength: periodLengthNum,
      })

      setUserData(prev => prev ? {
        ...prev,
        cycleLength: cycleLengthNum,
        periodLength: periodLengthNum,
      } : null)

      toast({
        title: "Configuración guardada",
        description: "Tu configuración de ciclo se ha actualizado exitosamente.",
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAllData = async () => {
    if (!user) return

    try {
      await deleteAllUserData(user.uid)
      toast({
        title: "Datos eliminados",
        description: "Todos tus datos han sido eliminados permanentemente.",
      })

      // Reload the page to restart onboarding
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Error deleting data:', error)
      toast({
        title: "Error",
        description: "No se pudieron eliminar los datos. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleExportData = async () => {
    if (!user) return

    try {
      const allData = await exportUserData(user.uid)
      const dataStr = JSON.stringify(allData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `controlciclo-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Datos exportados",
        description: "Tus datos se han descargado como un archivo JSON.",
      })
    } catch (error) {
      console.error('Error exporting data:', error)
      toast({
        title: "Error",
        description: "No se pudieron exportar los datos. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      })
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
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

            <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full sm:w-auto">
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
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

              <Button onClick={handleSignOut} variant="outline" className="w-full bg-transparent">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
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
