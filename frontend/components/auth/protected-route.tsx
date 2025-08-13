"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "user" | "admin" | "organizer"
  fallbackPath?: string
}

export function ProtectedRoute({ children, requiredRole, fallbackPath = "/auth/login" }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(fallbackPath)
      return
    }

    if (requiredRole && user && user.role !== requiredRole) {
      router.push("/unauthorized")
      return
    }
  }, [isAuthenticated, user, isLoading, requiredRole, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && user && user.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}
