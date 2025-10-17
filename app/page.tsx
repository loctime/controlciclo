"use client"

import { useEffect, useState } from "react"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { CalendarView } from "@/components/calendar-view"

export default function HomePage() {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user has completed onboarding
    const onboarded = localStorage.getItem("period_tracker_onboarded")
    setIsOnboarded(onboarded === "true")
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem("period_tracker_onboarded", "true")
    setIsOnboarded(true)
  }

  // Loading state
  if (isOnboarded === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {!isOnboarded ? <OnboardingFlow onComplete={handleOnboardingComplete} /> : <CalendarView />}
    </main>
  )
}
