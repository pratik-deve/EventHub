"use client"

import { Calendar, MapPin, Ticket, Users } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Separator } from "@/components/ui/separator"
import type { Event } from "@/lib/slices/eventSlice"
import type { Seat } from "@/lib/slices/seatSlice"

interface BookingSummaryProps {
  event: Event
  seats: Seat[]
}

export function BookingSummary({ event, seats }: BookingSummaryProps) {
  const subtotal = seats.reduce((sum, seat) => sum + seat.price, 0)
  const fees = Math.round(subtotal * 0.1) // 10% service fee
  const taxes = Math.round(subtotal * 0.08) // 8% tax
  const total = subtotal + fees + taxes

  return (
    <GlassCard>
      <h3 className="text-lg font-display font-bold mb-4">Order Summary</h3>

      {/* Event Details */}
      <div className="mb-4">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
        <h4 className="font-semibold mb-2">{event.title}</h4>
        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {event.venue.name}
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Seat Details */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Tickets</span>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4 mr-1" />
            {seats.length}
          </div>
        </div>

        <div className="space-y-2">
          {seats.map((seat) => (
            <div key={seat.id} className="flex justify-between text-sm">
              <span>
                <Ticket className="h-3 w-3 inline mr-1" />
                Seat {seat.id} ({seat.type})
              </span>
              <span>${seat.price}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Price Breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Service Fee</span>
          <span>${fees}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Taxes</span>
          <span>${taxes}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">${total}</span>
        </div>
      </div>

      {/* Terms */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-300">
          By completing this purchase, you agree to our Terms of Service and acknowledge our Privacy Policy.
        </p>
      </div>
    </GlassCard>
  )
}
