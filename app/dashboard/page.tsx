"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Calendar, MapPin, Clock, Star, Download, QrCode, ArrowRight, Ticket } from "lucide-react"
import Link from "next/link"

// Mock booking data
const mockBookings = {
  upcoming: [
    {
      id: "booking-1",
      eventId: "1",
      eventTitle: "Summer Music Festival 2024",
      eventDate: "2024-07-15",
      eventTime: "18:00",
      venue: "Central Park Amphitheater",
      location: "New York, NY",
      ticketType: "General Admission",
      quantity: 2,
      totalPrice: 183.98,
      bookingDate: "2024-06-01",
      status: "confirmed",
      qrCode: "QR123456789",
    },
    {
      id: "booking-2",
      eventId: "2",
      eventTitle: "Tech Innovation Conference",
      eventDate: "2024-08-22",
      eventTime: "09:00",
      venue: "Convention Center",
      location: "San Francisco, CA",
      ticketType: "Premium",
      quantity: 1,
      totalPrice: 304.99,
      bookingDate: "2024-06-15",
      status: "confirmed",
      qrCode: "QR987654321",
    },
  ],
  past: [
    {
      id: "booking-3",
      eventId: "3",
      eventTitle: "Food & Wine Tasting",
      eventDate: "2024-05-20",
      eventTime: "19:30",
      venue: "Grand Hotel Ballroom",
      location: "Chicago, IL",
      ticketType: "VIP",
      quantity: 2,
      totalPrice: 255.98,
      bookingDate: "2024-05-01",
      status: "attended",
      qrCode: "QR456789123",
      rating: 5,
    },
  ],
}

const mockRecommendedEvents = [
  {
    id: "4",
    title: "Jazz Night Under the Stars",
    date: "2024-08-10",
    location: "Brooklyn, NY",
    price: 65,
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
  },
  {
    id: "5",
    title: "Digital Marketing Summit",
    date: "2024-09-05",
    location: "San Francisco, CA",
    price: 199,
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
  },
  {
    id: "6",
    title: "Craft Beer Festival",
    date: "2024-07-28",
    location: "Chicago, IL",
    price: 45,
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("upcoming")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "attended":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">Manage your bookings and discover new events</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                    <p className="text-2xl font-bold">{mockBookings.upcoming.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                    <p className="text-2xl font-bold">
                      {mockBookings.upcoming.reduce((sum, booking) => sum + booking.quantity, 0) +
                        mockBookings.past.reduce((sum, booking) => sum + booking.quantity, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Events Attended</p>
                    <p className="text-2xl font-bold">{mockBookings.past.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
            </TabsList>

            {/* Upcoming Bookings */}
            <TabsContent value="upcoming" className="space-y-4">
              {mockBookings.upcoming.length > 0 ? (
                mockBookings.upcoming.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-serif font-semibold">{booking.eventTitle}</h3>
                            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.eventDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {booking.eventTime}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {booking.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Ticket className="w-4 h-4" />
                              {booking.quantity}x {booking.ticketType}
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Total Paid</span>
                              <span className="font-semibold text-lg">${booking.totalPrice}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button variant="outline" size="sm">
                            <QrCode className="w-4 h-4 mr-2" />
                            View Ticket
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button asChild size="sm">
                            <Link href={`/bookings/${booking.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
                    <p className="text-muted-foreground mb-6">Discover amazing events and book your next experience</p>
                    <Button asChild>
                      <Link href="/events">Browse Events</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Past Events */}
            <TabsContent value="past" className="space-y-4">
              {mockBookings.past.length > 0 ? (
                mockBookings.past.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-serif font-semibold">{booking.eventTitle}</h3>
                            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                            {booking.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{booking.rating}</span>
                              </div>
                            )}
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.eventDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {booking.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Ticket className="w-4 h-4" />
                              {booking.quantity}x {booking.ticketType}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Receipt
                          </Button>
                          <Button asChild size="sm">
                            <Link href={`/bookings/${booking.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No past events</h3>
                    <p className="text-muted-foreground">Your attended events will appear here</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Recommended Events */}
            <TabsContent value="recommended">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockRecommendedEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>

                      <h3 className="font-serif font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{event.rating}</span>
                        </div>
                        <span className="font-semibold text-primary">${event.price}</span>
                      </div>

                      <Button asChild className="w-full mt-4" size="sm">
                        <Link href={`/events/${event.id}`}>
                          View Event
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
