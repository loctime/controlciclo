"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { useAuth } from "./auth-provider"
import { saveUserData, type UserData } from "@/lib/firestore-service"
import { useToast } from "@/hooks/use-toast"

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [cycleLength, setCycleLength] = useState("28")
  const [periodLength, setPeriodLength] = useState("5")
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>(undefined)
  const [isSaving, setIsSaving] = useState(false)

  const handleComplete = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "No hay usuario autenticado",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const userData: UserData = {
        cycleLength: Number.parseInt(cycleLength),
        periodLength: Number.parseInt(periodLength),
        lastPeriodDate: lastPeriodDate?.toISOString() || new Date().toISOString(),
        setupDate: new Date().toISOString(),
      }
      
      await saveUserData(user.uid, userData)
      
      toast({
        title: "¡Configuración guardada!",
        description: "Tu información se ha guardado exitosamente.",
      })
      
      onComplete()
    } catch (error) {
      console.error('Error saving user data:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const canProceedStep1 = cycleLength && Number.parseInt(cycleLength) >= 21 && Number.parseInt(cycleLength) <= 35
  const canProceedStep2 = periodLength && Number.parseInt(periodLength) >= 2 && Number.parseInt(periodLength) <= 10
  const canProceedStep3 = lastPeriodDate !== undefined

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Bienvenida a tu Rastreador de Ciclo</CardTitle>
          <CardDescription>Personalicemos tu experiencia con unas preguntas rápidas</CardDescription>
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 w-12 rounded-full transition-colors ${i === step ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cycle-length">¿Cuál es la duración promedio de tu ciclo?</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="cycle-length"
                    type="number"
                    min="21"
                    max="35"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value)}
                    className="text-lg"
                  />
                  <span className="text-sm text-muted-foreground">días</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  La mayoría de los ciclos duran entre 21-35 días. El promedio es de 28 días.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="period-length">¿Cuánto dura tu periodo normalmente?</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="period-length"
                    type="number"
                    min="2"
                    max="10"
                    value={periodLength}
                    onChange={(e) => setPeriodLength(e.target.value)}
                    className="text-lg"
                  />
                  <span className="text-sm text-muted-foreground">días</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  La mayoría de los periodos duran entre 2-7 días. El promedio es de 5 días.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>¿Cuándo comenzó tu último periodo?</Label>
                <div className="flex justify-center rounded-lg border bg-card p-4">
                  <Calendar
                    mode="single"
                    selected={lastPeriodDate}
                    onSelect={setLastPeriodDate}
                    disabled={(date) => date > new Date()}
                    className="rounded-md"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Esto nos ayuda a predecir tu próximo ciclo y proporcionar información precisa.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)}
                className="flex-1"
              >
                Continuar
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={!canProceedStep3 || isSaving} className="flex-1">
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Guardando...
                  </>
                ) : (
                  <>
                    Comenzar
                    <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
