"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { LoginScreen } from "@/components/login-screen"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { CalendarView } from "@/components/calendar-view"
import { getUserData } from "@/lib/firestore-service"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [hasUserData, setHasUserData] = useState<boolean | null>(null)
  const [checkingData, setCheckingData] = useState(false)

  useEffect(() => {
    const checkUserData = async () => {
      if (!user) {
        setHasUserData(null)
        return
      }

      setCheckingData(true)
      try {
        const userData = await getUserData(user.uid)
        setHasUserData(!!userData)
      } catch (error) {
        console.error('Error checking user data:', error)
        setHasUserData(false)
      } finally {
        setCheckingData(false)
      }
    }

    checkUserData()
  }, [user])

  const handleOnboardingComplete = () => {
    setHasUserData(true)
  }

  // Loading state
  if (loading || checkingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // No user authenticated
  if (!user) {
    return <LoginScreen />
  }

  // User authenticated but no data (needs onboarding)
  if (hasUserData === false) {
    return (
      <main className="min-h-screen bg-background">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </main>
    )
  }

  // User authenticated with data
  return (
    <main className="min-h-screen bg-background">
      <CalendarView />
    </main>
  )
}
