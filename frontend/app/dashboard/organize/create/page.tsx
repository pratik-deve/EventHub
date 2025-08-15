"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function OrganizeEventPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venueName: "",
    venueAddress: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          dateTime: `${form.date}T${form.time}`,
          venue: {
            name: form.venueName,
            address: form.venueAddress,
          },
        }),
      })
      if (!response.ok) throw new Error("Failed to create event")
      toast({ title: "Event Created!", description: "Your event has been organized." })
      router.push("/dashboard")
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="w-full max-w-lg">
        <GlassCard>
          <h2 className="text-2xl font-bold mb-6">Organize a New Event</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" value={form.title} onChange={e => handleChange("title", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={e => handleChange("description", e.target.value)} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={form.date} onChange={e => handleChange("date", e.target.value)} required />
              </div>
              <div className="flex-1">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={form.time} onChange={e => handleChange("time", e.target.value)} required />
              </div>
            </div>
            <div>
              <Label htmlFor="venueName">Venue Name</Label>
              <Input id="venueName" value={form.venueName} onChange={e => handleChange("venueName", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="venueAddress">Venue Address</Label>
              <Input id="venueAddress" value={form.venueAddress} onChange={e => handleChange("venueAddress", e.target.value)} required />
            </div>
            <Button type="submit" className="w-full gradient-primary text-white" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}