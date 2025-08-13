"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { selectSeat, deselectSeat } from "@/lib/slices/seatSlice"
import { useToast } from "@/hooks/use-toast"

interface InteractiveSeatMapProps {
  eventId: string
}

export function InteractiveSeatMap({ eventId }: InteractiveSeatMapProps) {
  const dispatch = useAppDispatch()
  const { seats, selectedSeats } = useAppSelector((state) => state.seats)
  const { toast } = useToast()
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null)

  const maxSeats = 8

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId)
    if (!seat || seat.status !== "available") return

    if (selectedSeats.includes(seatId)) {
      dispatch(deselectSeat(seatId))
    } else {
      if (selectedSeats.length >= maxSeats) {
        toast({
          title: "Maximum seats reached",
          description: `You can only select up to ${maxSeats} seats per booking.`,
          variant: "destructive",
        })
        return
      }
      dispatch(selectSeat(seatId))
    }
  }

  const getSeatColor = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId)
    if (!seat) return "bg-gray-400"

    if (selectedSeats.includes(seatId)) {
      return "bg-orange-500 ring-2 ring-orange-300"
    }

    if (seat.status === "booked") return "bg-red-500 cursor-not-allowed"
    if (seat.status === "held") return "bg-yellow-500 cursor-not-allowed"
    if (seat.status === "unavailable") return "bg-gray-400 cursor-not-allowed"

    switch (seat.type) {
      case "vip":
        return "bg-purple-500 hover:bg-purple-600 cursor-pointer"
      case "premium":
        return "bg-blue-500 hover:bg-blue-600 cursor-pointer"
      default:
        return "bg-green-500 hover:bg-green-600 cursor-pointer"
    }
  }

  const groupedSeats = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = []
      acc[seat.row].push(seat)
      return acc
    },
    {} as Record<string, typeof seats>,
  )

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Regular ($89)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Premium ($189)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>VIP ($299)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-500 rounded ring-2 ring-orange-300"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Held</span>
        </div>
      </div>

      {/* Stage */}
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-lg mb-8">
          <span className="font-semibold text-lg">STAGE</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="overflow-x-auto">
        <div className="min-w-max space-y-3">
          {Object.entries(groupedSeats).map(([row, rowSeats]) => (
            <div key={row} className="flex items-center justify-center space-x-2">
              <div className="w-8 text-center font-bold text-lg">{row}</div>
              <div className="flex space-x-1">
                {rowSeats.map((seat) => (
                  <button
                    key={seat.id}
                    className={`w-8 h-8 rounded text-xs font-bold text-white transition-all duration-200 ${getSeatColor(
                      seat.id,
                    )}`}
                    onClick={() => handleSeatClick(seat.id)}
                    onMouseEnter={() => setHoveredSeat(seat.id)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    disabled={seat.status !== "available"}
                    title={`Seat ${seat.id} - ${seat.type} - $${seat.price} - ${seat.status}`}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
              <div className="w-8 text-center font-bold text-lg">{row}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Info */}
      {hoveredSeat && (
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          {(() => {
            const seat = seats.find((s) => s.id === hoveredSeat)
            if (!seat) return null
            return (
              <div>
                <div className="font-semibold text-lg">Seat {seat.id}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {seat.type.charAt(0).toUpperCase() + seat.type.slice(1)} seat - ${seat.price}
                </div>
                {selectedSeats.includes(seat.id) && (
                  <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">Selected</div>
                )}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
