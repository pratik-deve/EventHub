"use client"

import { getUserProfile } from "@/api/userApi"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {

  name: string
  email: string
  avatar?: string
  isOrganizer: boolean
  subscriptionStatus: "none" | "trial" | "monthly" | "yearly"
  subscriptionExpiry?: string
  trialStarted?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (login: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
  signInWithGoogle: () => Promise<void>
  becomeOrganizer: (plan: "trial" | "monthly" | "yearly") => Promise<void>
  updateSubscription: (plan: "monthly" | "yearly") => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
      const checkAuth = async () => {
        try {
          const token = sessionStorage.getItem("auth_token");
          if (token) {
            
           const res = await getUserProfile();

            if (res.ok) {
              const userData = await res.json();
              const user: User = {
                name: userData.username,
                email: userData.email,
                avatar: "/placeholder.svg?height=40&width=40",
                isOrganizer: userData.role?.some((r: { authority: string }) => r.authority === "ORGANIZER") || false,
                subscriptionStatus: "none", // you can map from backend if available
              };
              setUser(user);
            } else {
              // Token invalid → clear session
              sessionStorage.removeItem("auth_token");
              setUser(null);
            }
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          sessionStorage.removeItem("auth_token");
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, []);

  const signIn = async (login: string, password: string) => {
    setIsLoading(true)
    try {
      
     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login,
          password,
        }),
      })

      
      const data = await response.json()
      
      const userData: User = {
        name: data.username,
        email: data.email,
        avatar: "/placeholder.svg?height=40&width=40",
        isOrganizer: data.role?.some((r: { authority: string }) => r.authority === "ORGANIZER") || false,
        subscriptionStatus: "none",
      }

      

        sessionStorage.setItem("auth_token", data.authToken);

        // user info only in Redux/Context
        setUser(userData);
    } catch (error) {
      throw new Error("Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email,
          password,
        }),
      })


      const data = await response.json(); 
      // Mock user data
      const userData: User = {
    
        name: name,
        email: email,
        avatar: "/placeholder.svg?height=40&width=40",
        isOrganizer: false,
        subscriptionStatus: "none",
      }

      // Store auth data
      sessionStorage.setItem("auth_token", data.authToken);

        // user info only in Redux/Context
        setUser(userData);
    } catch (error) {
      throw new Error("Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  
const signInWithGoogle = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      setIsLoading(true);

      const popup = window.open(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_GOOGLE}`,
        "GoogleLogin",
        "width=600,height=600"
      );

      const listener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return; // security check

        if (event.data.type === "OAUTH_LOGIN_SUCCESS") {

           sessionStorage.setItem("auth_token", event.data.token as string);
           setUser(event.data.user);

          window.removeEventListener("message", listener);
          popup?.close();
          resolve(event.data.user); // ✅ resolve promise
        }
      };

      window.addEventListener("message", listener);
    } catch (error) {
      reject(error);
    } finally {
      setIsLoading(false);
    }
  });
};



  const becomeOrganizer = async (plan: "trial" | "monthly" | "yearly") => {
    if (!user) throw new Error("User not authenticated")

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const updatedUser: User = {
        ...user,
        isOrganizer: true,
        subscriptionStatus: plan,
        subscriptionExpiry:
          plan === "trial"
            ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days
            : new Date(Date.now() + (plan === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
        trialStarted: plan === "trial" ? new Date().toISOString() : undefined,
      }

      localStorage.setItem("user_data", JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      throw new Error("Failed to upgrade to organizer")
    } finally {
      setIsLoading(false)
    }
  }

  const updateSubscription = async (plan: "monthly" | "yearly") => {
    if (!user) throw new Error("User not authenticated")

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const updatedUser: User = {
        ...user,
        subscriptionStatus: plan,
        subscriptionExpiry: new Date(Date.now() + (plan === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
      }

      localStorage.setItem("user_data", JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      throw new Error("Failed to update subscription")
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        becomeOrganizer,
        updateSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
