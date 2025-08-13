"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/layout/header"
import { InteractiveSeatMap } from "@/components/booking/interactive-seat-map"
import { SeatSelectionSummary } from "@/components/booking/seat-selection-summary"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setSeats, clearSelection, holdSeats } from "@/lib/slices/seatSlice"
import type { Event } from "@/lib/slices/eventSlice"
import type { Seat } from "@/lib/slices/seatSlice"

// Mock event data
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

// Generate seat data
const generateSeatData = (): Seat[] => {
  const seats: Seat[] = []
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
  const seatsPerRow = 20

  rows.forEach((row, rowIndex) => {
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      const seatId = `${row}${seatNum}`
      let type: "regular" | "vip" | "premium" = "regular"
      let price = 89

      // VIP seats (first 3 rows, center seats)
      if (rowIndex < 3 && seatNum >= 6 && seatNum <= 15) {
        type = "vip"
        price = 299
      }
      // Premium seats (rows D-F, center seats)
      else if (rowIndex >= 3 && rowIndex < 6 && seatNum >= 4 && seatNum <= 17) {
        type = "premium"
        price = 189
      }

      let status: "available" | "held" | "booked" | "unavailable" = "available"
      const random = Math.random()
      if (random < 0.15) {
        status = "booked"
      } else if (random < 0.2) {
        status = "held"
      } else if (random < 0.25) {
        status = "unavailable"
      }

      seats.push({
        id: seatId,
        row,
        number: seatNum,
        type,
        price,
        status,
      })
    }
  })

  return seats
}

export default function SeatSelectionPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { selectedSeats, totalPrice, seats } = useAppSelector((state) => state.seats)
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [showTimeWarning, setShowTimeWarning] = useState(false)

  const eventId = params.id as string

  useEffect(() => {
    // Initialize seats data
    dispatch(setSeats(generateSeatData()))
  }, [dispatch])

  // Timer countdown
  useEffect(() => {
    if (selectedSeats.length === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired, clear selection
          dispatch(clearSelection())
          setShowTimeWarning(false)
          return 0
        }
        if (prev <= 120 && !showTimeWarning) {
          setShowTimeWarning(true)
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [selectedSeats.length, showTimeWarning, dispatch])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleContinueToCheckout = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/events/${eventId}/checkout`)
      return
    }

    // Hold the selected seats
    dispatch(holdSeats(selectedSeats))
    router.push(`/events/${eventId}/checkout`)
  }

  const handleBackToEvent = () => {
    dispatch(clearSelection())
    router.push(`/events/${eventId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={handleBackToEvent}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Event
          </Button>

          {selectedSeats.length > 0 && (
            <div className="flex items-center space-x-4">
              {showTimeWarning && (
                <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-orange-700 dark:text-orange-300">
                    Hurry! Your seats will be released in {formatTime(timeLeft)}
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>Time remaining: {formatTime(timeLeft)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Event Info */}
        <GlassCard className="mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={mockEvent.image || "/placeholder.svg"}
              alt={mockEvent.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold mb-2">{mockEvent.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <span>{new Date(mockEvent.date).toLocaleDateString()}</span>
                <span>{mockEvent.time}</span>
                <span>{mockEvent.venue.name}</span>
              </div>
            </div>
            <Badge variant="secondary">{mockEvent.category}</Badge>
          </div>
        </GlassCard>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-3">
            <GlassCard>
              <div className="mb-6">
                <h2 className="text-xl font-display font-bold mb-2">Select Your Seats</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Click on available seats to select them. You can select up to 8 seats.
                </p>
              </div>

              <InteractiveSeatMap eventId={eventId} />

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Selection Tips:</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Click seats to select/deselect them</li>
                  <li>• You have 10 minutes to complete your booking once you select seats</li>
                  <li>• Maximum 8 seats per transaction</li>
                  <li>• Seats are held temporarily during selection</li>
                </ul>
              </div>
            </GlassCard>
          </div>

          {/* Selection Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <SeatSelectionSummary
                event={mockEvent}
                onContinue={handleContinueToCheckout}
                onClear={() => dispatch(clearSelection())}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
