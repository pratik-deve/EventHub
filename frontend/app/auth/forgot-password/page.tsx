"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      // Mock API call - replace with actual password reset API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsSubmitted(true)
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      })
    } catch (error) {
      setError("Failed to send reset email. Please try again.")
      toast({
        title: "Error",
        description: "Failed to send reset email",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <GlassCard>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-display font-bold mb-2">Check Your Email</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
                  Try Different Email
                </Button>
                <Link href="/auth/signin">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to signin
                  </Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold gradient-primary bg-clip-text text-transparent mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${error ? "border-red-500" : ""}`}
                  placeholder="Enter your email address"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <Button type="submit" className="w-full gradient-primary text-white" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to signin
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
