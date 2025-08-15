"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Lock, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch } from "@/lib/hooks"
import { setCredentials, clearError } from "@/lib/slices/authSlice"

export default function SigninPage() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ login?: string; password?: string }>({})

  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useAppDispatch()

  const validateForm = () => {
    const newErrors: { login?: string; password?: string } = {}

    if (!login) {
      newErrors.login = "Username or Email is required"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())

    if (!validateForm()) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login,
          password,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Signin failed")
      }

      const data = await response.json()

      // Set user as authenticated and store user object
      // dispatch(setCredentials({
      //   user: {
      //     // id: data.user.id,
      //     // email: data.user.email,
      //     name: login
      //     // role: data.user.role,
      //     // avatar: data.user.avatar,
      //   },
      //   token: data.token,
      // }))

      dispatch(setCredentials({
        user: {
          username: login, 
          role: 'user'
        },      // or keep as null/undefined for now
        token: data.token,
      }))

      toast({
        title: "Signin successful",
        description: "Welcome back!",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Signin failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const handleOAuthSignin = (provider: string) => {
    toast({
      title: "OAuth signin",
      description: `${provider} signin will be implemented with backend integration`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold gradient-primary bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Sign in to your EventHub account</p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username or Email Field */}
            <div className="space-y-2">
              <Label htmlFor="login" className="text-sm font-medium">
                Username or Email
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="login"
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className={`pl-10 ${errors.login ? "border-red-500" : ""}`}
                  placeholder="Enter your username or email"
                />
              </div>
              {errors.login && <p className="text-sm text-red-500">{errors.login}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full gradient-primary text-white">
              Sign In
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={() => handleOAuthSignin("Google")} className="w-full">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
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
                Google
              </Button>
              <Button type="button" variant="outline" onClick={() => handleOAuthSignin("GitHub")} className="w-full">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}