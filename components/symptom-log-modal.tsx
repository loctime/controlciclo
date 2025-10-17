"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  CalendarIcon,
  Droplets,
  Heart,
  Zap,
  Frown,
  Smile,
  Meh,
  ThermometerSun,
  Moon,
  Activity,
  Coffee,
  AlertCircle,
} from "lucide-react"
import { format } from "date-fns"

interface SymptomLogModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate?: Date
  onSave: (log: SymptomLog) => void
}

export interface SymptomLog {
  date: string
  flow?: "light" | "medium" | "heavy" | "spotting"
  mood?: "happy" | "neutral" | "sad" | "anxious" | "irritable"
  symptoms: string[]
  notes?: string
}

const flowOptions = [
  { value: "spotting", label: "Manchado", icon: Droplets, color: "text-primary/40" },
  { value: "light", label: "Ligero", icon: Droplets, color: "text-primary/60" },
  { value: "medium", label: "Moderado", icon: Droplets, color: "text-primary/80" },
  { value: "heavy", label: "Abundante", icon: Droplets, color: "text-primary" },
]

const moodOptions = [
  { value: "happy", label: "Feliz", icon: Smile, color: "text-secondary" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "text-muted-foreground" },
  { value: "sad", label: "Triste", icon: Frown, color: "text-blue-500" },
  { value: "anxious", label: "Ansiosa", icon: AlertCircle, color: "text-accent" },
  { value: "irritable", label: "Irritable", icon: Zap, color: "text-destructive" },
]

const symptomOptions = [
  { value: "cramps", label: "Cólicos", icon: Activity },
  { value: "headache", label: "Dolor de Cabeza", icon: AlertCircle },
  { value: "bloating", label: "Hinchazón", icon: Heart },
  { value: "fatigue", label: "Fatiga", icon: Moon },
  { value: "breast_tenderness", label: "Sensibilidad en Senos", icon: Heart },
  { value: "acne", label: "Acné", icon: ThermometerSun },
  { value: "cravings", label: "Antojos", icon: Coffee },
  { value: "back_pain", label: "Dolor de Espalda", icon: Activity },
]

export function SymptomLogModal({ open, onOpenChange, selectedDate, onSave }: SymptomLogModalProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate || new Date())
  const [flow, setFlow] = useState<string | undefined>()
  const [mood, setMood] = useState<string | undefined>()
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState("")

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const handleSave = () => {
    if (!date) return

    const log: SymptomLog = {
      date: date.toISOString(),
      flow: flow as any,
      mood: mood as any,
      symptoms,
      notes: notes.trim() || undefined,
    }

    onSave(log)
    onOpenChange(false)

    // Reset form
    setFlow(undefined)
    setMood(undefined)
    setSymptoms([])
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Síntomas</DialogTitle>
          <DialogDescription>Registra cómo te sientes y cualquier síntoma que estés experimentando</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} disabled={(date) => date > new Date()} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Flow Selection */}
          <div className="space-y-2">
            <Label>Flujo (opcional)</Label>
            <div className="grid grid-cols-2 gap-2">
              {flowOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => setFlow(flow === option.value ? undefined : option.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-muted",
                      flow === option.value && "border-primary bg-primary/5",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", option.color)} />
                    <span className="text-sm">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mood Selection */}
          <div className="space-y-2">
            <Label>Estado de ánimo (opcional)</Label>
            <div className="grid grid-cols-3 gap-2">
              {moodOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => setMood(mood === option.value ? undefined : option.value)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors hover:bg-muted",
                      mood === option.value && "border-primary bg-primary/5",
                    )}
                  >
                    <Icon className={cn("h-5 w-5", option.color)} />
                    <span className="text-xs">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Symptoms Selection */}
          <div className="space-y-2">
            <Label>Síntomas (opcional)</Label>
            <div className="grid grid-cols-2 gap-2">
              {symptomOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleSymptom(option.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-muted",
                      symptoms.includes(option.value) && "border-primary bg-primary/5",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Agrega notas adicionales sobre cómo te sientes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!date}>
            Guardar Registro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
