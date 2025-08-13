"use client"

import { Users, Ticket, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Separator } from "@/components/ui/separator"
import { useAppSelector } from "@/lib/hooks"
import type { Event } from "@/lib/slices/eventSlice"

interface SeatSelectionSummaryProps {
  event: Event
  onContinue: () => void
  onClear: () => void
}

export function SeatSelectionSummary({ event, onContinue, onClear }: SeatSelectionSummaryProps) {
  const { selectedSeats, totalPrice, seats } = useAppSelector((state) => state.seats)

  const selectedSeatDetails = seats.filter((seat) => selectedSeats.includes(seat.id))
  const fees = Math.round(totalPrice * 0.1) // 10% service fee
  const finalTotal = totalPrice + fees

  if (selectedSeats.length === 0) {
    return (
      <GlassCard>
        <div className="text-center py-8">
          <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No Seats Selected</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Select seats from the map to see your booking summary
          </p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <h3 className="text-lg font-display font-bold mb-4">Booking Summary</h3>

      {/* Event Info */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          {new Date(event.date).toLocaleDateString()} • {event.time}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300">{event.venue.name}</p>
      </div>

      <Separator className="my-4" />

      {/* Selected Seats */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Selected Seats</span>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4 mr-1" />
            {selectedSeats.length}
          </div>
        </div>

        <div className="space-y-2">
          {selectedSeatDetails.map((seat) => (
            <div key={seat.id} className="flex justify-between text-sm">
              <span>
                Seat {seat.id} ({seat.type})
              </span>
              <span>${seat.price}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Pricing Breakdown */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${totalPrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Service Fee</span>
          <span>${fees}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span className="text-primary">${finalTotal}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button onClick={onContinue} className="w-full gradient-primary text-white">
          <DollarSign className="h-4 w-4 mr-2" />
          Continue to Checkout
        </Button>
        <Button onClick={onClear} variant="outline" className="w-full bg-transparent">
          Clear Selection
        </Button>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          Seats are held for 10 minutes. Complete your booking to secure them.
        </p>
      </div>
    </GlassCard>
  )
}
