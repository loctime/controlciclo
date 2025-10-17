"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Smartphone, Cloud, Heart } from "lucide-react"
import { useAuth } from "./auth-provider"

export function LoginScreen() {
  const { signInWithGoogle, loading } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">ControlCiclo</CardTitle>
          <CardDescription className="text-lg">
            Tu compañera personal para el seguimiento del ciclo menstrual
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Beneficios */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Cloud className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Sincronización en la nube</p>
                <p className="text-sm text-muted-foreground">
                  Accede a tus datos desde cualquier dispositivo
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Smartphone className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Multi-dispositivo</p>
                <p className="text-sm text-muted-foreground">
                  Usa la app en tu teléfono, tablet o computadora
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Shield className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Privacidad garantizada</p>
                <p className="text-sm text-muted-foreground">
                  Solo tú puedes acceder a tus datos personales
                </p>
              </div>
            </div>
          </div>

          {/* Botón de login */}
          <Button 
            onClick={handleSignIn} 
            disabled={loading || isSigningIn}
            className="w-full"
            size="lg"
          >
            {isSigningIn ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Iniciando sesión...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Iniciar sesión con Google
              </>
            )}
          </Button>

          {/* Información de privacidad */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              Al iniciar sesión, aceptas que tus datos se almacenen de forma segura en la nube 
              para sincronización entre dispositivos. Solo tú puedes acceder a tu información personal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
