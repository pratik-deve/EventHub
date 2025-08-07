"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { BookingContextType, BookedEvent, Event } from '@/lib/types'

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookedEvents, setBookedEvents] = useState<BookedEvent[]>([])

  useEffect(() => {
    // Load booked events from localStorage
    const savedBookings = localStorage.getItem('bookedEvents')
    if (savedBookings) {
      setBookedEvents(JSON.parse(savedBookings))
    }
  }, [])

  const bookEvent = (event: Event, ticketType: string, quantity: number, totalPrice: number): boolean => {
    const newBooking: BookedEvent = {
      id: Date.now().toString(),
      event,
      ticketType,
      quantity,
      totalPrice,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      qrCode: `QR-${Date.now()}`
    }
    
    const newBookings = [newBooking, ...bookedEvents]
    setBookedEvents(newBookings)
    localStorage.setItem('bookedEvents', JSON.stringify(newBookings))
    return true
  }

  const cancelBooking = (bookingId: string) => {
    const updatedBookings = bookedEvents.map(booking =>
      booking.id === bookingId ? { ...booking, status: 'cancelled' as const } : booking
    )
    setBookedEvents(updatedBookings)
    localStorage.setItem('bookedEvents', JSON.stringify(updatedBookings))
  }

  return (
    <BookingContext.Provider value={{ bookedEvents, bookEvent, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
