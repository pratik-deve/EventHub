"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { useBooking } from "@/contexts/booking-context"
import { Calendar, MapPin, Clock, Ticket, QrCode, Download, X } from 'lucide-react'

export default function BookingsPage() {
  const { user } = useAuth()
  const { bookedEvents, cancelBooking } = useBooking()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const upcomingEvents = bookedEvents.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.event.date) > new Date()
  )
  
  const pastEvents = bookedEvents.filter(booking => 
    booking.status === 'completed' || new Date(booking.event.date) < new Date()
  )
  
  const cancelledEvents = bookedEvents.filter(booking => booking.status === 'cancelled')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="overflow-hidden">
      <div className="flex">
        <div className="w-32 h-32 flex-shrink-0">
          <img
            src={booking.event.image || "/placeholder.svg"}
            alt={booking.event.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-4">
          <CardHeader className="p-0 pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg line-clamp-1">
                {booking.event.title}
              </CardTitle>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              {booking.event.date} at {booking.event.time}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {booking.event.venue}, {booking.event.location}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Ticket className="w-4 h-4 mr-2" />
              {booking.ticketType} × {booking.quantity}
            </div>
            
            
              {booking.ticketType} × {booking.quantity}
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-lg font-bold text-purple-600">
                ${booking.totalPrice}
              </div>
              <div className="flex gap-2">
                {booking.status === 'confirmed' && (
                  <>
                    <Button size="sm" variant="outline">
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Code
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => cancelBooking(booking.id)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
                {booking.status === 'completed' && (
                  <Button size="sm" variant="outline">
                    Write Review
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              Manage your event tickets and bookings
            </p>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past Events ({pastEvents.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledEvents.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any upcoming events. Start exploring!
                  </p>
                  <Button asChild>
                    <a href="/events">Browse Events</a>
                  </Button>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-4">
              {pastEvents.length > 0 ? (
                pastEvents.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card className="p-8 text-center">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No past events</h3>
                  <p className="text-muted-foreground">
                    Your attended events will appear here.
                  </p>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="cancelled" className="space-y-4">
              {cancelledEvents.length > 0 ? (
                cancelledEvents.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card className="p-8 text-center">
                  <X className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No cancelled bookings</h3>
                  <p className="text-muted-foreground">
                    Your cancelled bookings will appear here.
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
