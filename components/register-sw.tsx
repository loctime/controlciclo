"use client"

import { useEffect } from "react"

export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[SW] Service Worker registered:", registration.scope)
            
            // Verificar actualizaciones
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              console.log('[SW] New service worker found')
              
              newWorker?.addEventListener('statechange', () => {
                console.log('[SW] Service worker state:', newWorker.state)
              })
            })
          })
          .catch((error) => {
            console.error("[SW] Service Worker registration failed:", error)
          })
      })
    } else {
      console.log('[SW] Service Workers not supported')
    }
  }, [])

  return null
}

