"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { Header } from "@/components/layout/header"
import { BookingSummary } from "@/components/booking/booking-summary"
import { PaymentForm } from "@/components/booking/payment-form"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { createBooking } from "@/lib/slices/bookingSlice"
import { clearSelection } from "@/lib/slices/seatSlice"
import { useToast } from "@/hooks/use-toast"
import type { Event } from "@/lib/slices/eventSlice"

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

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const { selectedSeats, totalPrice, seats } = useAppSelector((state) => state.seats)
  const { user } = useAppSelector((state) => state.auth)
  const { isLoading } = useAppSelector((state) => state.bookings)

  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [contactInfo, setContactInfo] = useState({
    email: user?.email || "",
    phone: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const eventId = params.id as string

  // Redirect if no seats selected
  useEffect(() => {
    if (selectedSeats.length === 0) {
      router.push(`/events/${eventId}/seats`)
    }
  }, [selectedSeats.length, eventId, router])

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired, redirect back to seat selection
          dispatch(clearSelection())
          router.push(`/events/${eventId}/seats`)
          toast({
            title: "Session expired",
            description: "Your seat selection has expired. Please select seats again.",
            variant: "destructive",
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [dispatch, eventId, router, toast])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const selectedSeatDetails = seats.filter((seat) => selectedSeats.includes(seat.id))

  const handleCompleteBooking = async (paymentData: any) => {
    setIsProcessing(true)

    try {
      // Create booking
      const bookingData = {
        eventId,
        userId: user!.id,
        seats: selectedSeats,
        totalAmount: totalPrice,
      }

      await dispatch(createBooking(bookingData)).unwrap()

      // Clear selection
      dispatch(clearSelection())

      // Redirect to confirmation
      router.push(`/events/${eventId}/confirmation`)

      toast({
        title: "Booking confirmed!",
        description: "Your tickets have been booked successfully.",
      })
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (selectedSeats.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.push(`/events/${eventId}/seats`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Seat Selection
          </Button>

          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Time remaining: {formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <GlassCard>
              <h2 className="text-xl font-display font-bold mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Payment Information */}
            <GlassCard>
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="h-5 w-5" />
                <h2 className="text-xl font-display font-bold">Payment Information</h2>
              </div>
              <PaymentForm onSubmit={handleCompleteBooking} isLoading={isProcessing} />
            </GlassCard>

            {/* Security Notice */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Shield className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingSummary event={mockEvent} seats={selectedSeatDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
