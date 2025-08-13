"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import type { Seat } from "@/lib/slices/seatSlice"

interface SeatMapProps {
  eventId: string
}

// Mock seat data
const generateSeatMap = (): Seat[] => {
  const seats: Seat[] = []
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
  const seatsPerRow = 20

  rows.forEach((row, rowIndex) => {
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      const seatId = `${row}${seatNum}`
      let type: "regular" | "vip" | "premium" = "regular"
      let price = 89
      let status: "available" | "held" | "booked" | "unavailable" = "available"

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

      // Randomly set some seats as booked or held
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

export function SeatMap({ eventId }: SeatMapProps) {
  const [seats] = useState<Seat[]>(generateSeatMap())
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null)

  const getSeatColor = (seat: Seat) => {
    if (seat.status === "booked") return "bg-red-500"
    if (seat.status === "held") return "bg-yellow-500"
    if (seat.status === "unavailable") return "bg-gray-400"

    switch (seat.type) {
      case "vip":
        return "bg-purple-500 hover:bg-purple-600"
      case "premium":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-green-500 hover:bg-green-600"
    }
  }

  const getSeatPrice = (type: "regular" | "vip" | "premium") => {
    switch (type) {
      case "vip":
        return "$299"
      case "premium":
        return "$189"
      default:
        return "$89"
    }
  }

  const groupedSeats = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = []
      acc[seat.row].push(seat)
      return acc
    },
    {} as Record<string, Seat[]>,
  )

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">Regular ($89)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm">Premium ($189)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-sm">VIP ($299)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm">Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm">Held</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span className="text-sm">Unavailable</span>
        </div>
      </div>

      {/* Stage */}
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg mb-8">
          <span className="font-semibold">STAGE</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="overflow-x-auto">
        <div className="min-w-max space-y-2">
          {Object.entries(groupedSeats).map(([row, rowSeats]) => (
            <div key={row} className="flex items-center justify-center space-x-1">
              <div className="w-8 text-center font-medium text-sm">{row}</div>
              <div className="flex space-x-1">
                {rowSeats.map((seat) => (
                  <button
                    key={seat.id}
                    className={`w-6 h-6 rounded text-xs font-medium text-white transition-all duration-200 ${getSeatColor(
                      seat,
                    )} ${seat.status === "available" ? "cursor-pointer" : "cursor-not-allowed"}`}
                    onMouseEnter={() => setHoveredSeat(seat.id)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    disabled={seat.status !== "available"}
                    title={`Seat ${seat.id} - ${seat.type} - $${seat.price}`}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
              <div className="w-8 text-center font-medium text-sm">{row}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Info */}
      {hoveredSeat && (
        <GlassCard className="text-center">
          <div className="text-lg font-semibold mb-2">Seat {hoveredSeat}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {seats.find((s) => s.id === hoveredSeat)?.type} seat - ${seats.find((s) => s.id === hoveredSeat)?.price}
          </div>
        </GlassCard>
      )}

      {/* Action Button */}
      <div className="text-center">
        <Button className="gradient-primary text-white" size="lg">
          Select Seats to Continue
        </Button>
      </div>
    </div>
  )
}
