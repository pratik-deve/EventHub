"use client"

import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"

const eventTypes = [
  { label: "Movies & Music", value: "movies-music" },
  { label: "Live Shows", value: "live-shows" },
  { label: "Sports", value: "sports" },
  { label: "Workshops", value: "workshops" },
  { label: "Other", value: "other" },
]

export default function EventTypeSelectionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="w-full max-w-lg">
        <GlassCard>
          <h2 className="text-2xl font-bold mb-6">What type of event do you want to organize?</h2>
          <div className="grid gap-4">
            {eventTypes.map((type) => (
              <Button
                key={type.value}
                className="w-full"
                onClick={() => router.push(`/dashboard/organize/create?type=${type.value}`)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}