"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setCredentials } from "@/lib/slices/authSlice"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { user, token } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Check for stored authentication data on app initialization
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("eventHub_token")
        const storedUser = localStorage.getItem("eventHub_user")

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser)
          dispatch(setCredentials({ user, token: storedToken }))
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        // Clear invalid stored data
        localStorage.removeItem("eventHub_token")
        localStorage.removeItem("eventHub_user")
      } finally {
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [dispatch])

  // Store auth data when user logs in
  useEffect(() => {
    if (isAuthenticated && user && token) {
      localStorage.setItem("eventHub_token", token)
      localStorage.setItem("eventHub_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("eventHub_token")
      localStorage.removeItem("eventHub_user")
    }
  }, [isAuthenticated, user, token])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
