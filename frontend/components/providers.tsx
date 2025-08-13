"use client"

import type React from "react"

import { Provider } from "react-redux"
import { ThemeProvider } from "next-themes"
import { store } from "@/lib/store"
import { Toaster } from "@/components/ui/toaster"
import { AuthGuard } from "@/components/auth/auth-guard"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthGuard>
          {children}
          <Toaster />
        </AuthGuard>
      </ThemeProvider>
    </Provider>
  )
}
