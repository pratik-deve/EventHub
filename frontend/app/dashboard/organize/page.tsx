"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { useAppSelector } from "@/lib/hooks"
import { useToast } from "@/hooks/use-toast"

export default function OrganizeEntryPage() {
  const { user, token } = useAppSelector((state) => state.auth)
  const [isOrganizer, setIsOrganizer] = useState(true)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Call backend to check if user is already an organizer
    const checkOrganizer = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/is-organizer`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setIsOrganizer(data.isOrganizer)
      } catch {
        setIsOrganizer(false)
      } finally {
        setLoading(false)
      }
    }
    checkOrganizer()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard>Loading...</GlassCard>
      </div>
    )
  }

  if (isOrganizer) {
    // Already organizer, redirect to event type selection
    router.replace("/dashboard/organize/type")
    return null
  }

  // Not an organizer: show premium/trial options
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="w-full max-w-lg">
        <GlassCard>
          <h2 className="text-2xl font-bold mb-4">Become an Organizer</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            To organize events, you need to become an EventHub Organizer. Choose a plan below:
          </p>
          <div className="space-y-4">
            <Button
              className="w-full gradient-primary text-white"
              onClick={async () => {
                // Dummy payment logic
                toast({ title: "Payment Successful", description: "You are now a premium organizer!" })
                // Call backend to add organizer role
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/become-organizer`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ plan: "premium" }),
                })
                router.replace("/dashboard/organize/type")
              }}
            >
              Buy Premium Organizer (₹999)
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={async () => {
                toast({ title: "Trial Activated", description: "You have 30 days free trial as organizer." })
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/become-organizer`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ plan: "trial" }),
                })
                router.replace("/dashboard/organize/type")
              }}
            >
              Start 30 Days Free Trial
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}