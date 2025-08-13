"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Check, Calendar, MapPin, Ticket, Download, Share2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/header"
import { useAppSelector } from "@/lib/hooks"
import type { Event } from "@/lib/slices/eventSlice"

// Mock event and booking data
const mockEvent: Event = {
  id: "1",
  title: "Summer Music Festival 2024",
  description: "The biggest music festival of the year featuring top artists",
  category: "music",
  date: "2024-07-15",
  time: "18:00",
  venue: {
    id: "v1",
    name: "Central Park Great Lawn",
    address: "Central Park West & 79th St",
    city: "New York",
    capacity: 50000,
  },
  price: { min: 89, max: 299 },
  image: "/placeholder.svg?height=400&width=600",
  organizer: { id: "o1", name: "MusicEvents Co" },
  tags: ["festival", "outdoor", "multi-day"],
  status: "upcoming",
}

const mockBooking = {
  id: "BK-2024-001234",
  eventId: "1",
  userId: "user1",
  seats: ["A10", "A11"],
  totalAmount: 378,
  status: "confirmed" as const,
  bookingDate: new Date().toISOString(),
  paymentId: "pay_1234567890",
}

export default function ConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)

  const eventId = params.id as string

  useEffect(() => {
    // In real app, fetch booking details
    // For now, we'll use mock data
  }, [eventId])

  const handleDownloadTickets = () => {
    // Mock download functionality
    const element = document.createElement("a")
    const file = new Blob(
      [
        `EventHub Ticket\n\nEvent: ${mockEvent.title}\nDate: ${mockEvent.date}\nTime: ${mockEvent.time}\nVenue: ${mockEvent.venue.name}\nSeats: ${mockBooking.seats.join(", ")}\nBooking ID: ${mockBooking.id}`,
      ],
      { type: "text/plain" },
    )
    element.href = URL.createObjectURL(file)
    element.download = `tickets-${mockBooking.id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I'm going to ${mockEvent.title}!`,
          text: `Just booked tickets for ${mockEvent.title} on ${mockEvent.date}`,
          url: window.location.origin + `/events/${eventId}`,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your tickets have been booked successfully. Check your email for confirmation details.
            </p>
          </div>

          {/* Booking Details */}
          <GlassCard className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold">Booking Details</h2>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Confirmed
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Booking ID</span>
                <span className="font-medium">{mockBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Booking Date</span>
                <span className="font-medium">{new Date(mockBooking.bookingDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Payment ID</span>
                <span className="font-medium">{mockBooking.paymentId}</span>
              </div>
            </div>
          </GlassCard>

          {/* Event Details */}
          <GlassCard className="mb-6">
            <div className="flex items-start space-x-4 mb-6">
              <img
                src={mockEvent.image || "/placeholder.svg"}
                alt={mockEvent.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-display font-bold mb-2">{mockEvent.title}</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(mockEvent.date).toLocaleDateString()} at {mockEvent.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {mockEvent.venue.name}, {mockEvent.venue.city}
                  </div>
                  <div className="flex items-center">
                    <Ticket className="h-4 w-4 mr-2" />
                    Seats: {mockBooking.seats.join(", ")}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Paid</span>
              <span className="text-2xl font-bold text-primary">${mockBooking.totalAmount}</span>
            </div>
          </GlassCard>

          {/* Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Button onClick={handleDownloadTickets} className="gradient-primary text-white">
              <Download className="h-4 w-4 mr-2" />
              Download Tickets
            </Button>
            <Button variant="outline" onClick={handleShare} className="bg-transparent">
              <Share2 className="h-4 w-4 mr-2" />
              Share Event
            </Button>
          </div>

          {/* Next Steps */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Check your email for detailed confirmation and ticket information</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Download the EventHub app for easy ticket access</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Arrive 30 minutes early for smooth entry</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span>Bring a valid ID that matches the booking name</span>
              </div>
            </div>
          </GlassCard>

          {/* Navigation */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              View My Bookings
            </Button>
            <Button onClick={() => router.push("/events")}>
              Browse More Events
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
