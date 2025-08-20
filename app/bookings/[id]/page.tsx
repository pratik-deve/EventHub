"use client"

import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Clock, Download, QrCode, ArrowLeft, User, CreditCard } from "lucide-react"
import Link from "next/link"

// Mock booking data (in real app, this would come from API based on ID)
const mockBookingDetails = {
  id: "booking-1",
  eventId: "1",
  eventTitle: "Summer Music Festival 2024",
  eventDate: "2024-07-15",
  eventTime: "18:00",
  eventEndTime: "00:00",
  venue: "Central Park Amphitheater",
  location: "New York, NY",
  address: "1234 Central Park West, New York, NY 10025",
  ticketType: "General Admission",
  quantity: 2,
  pricePerTicket: 89,
  serviceFee: 5.98,
  totalPrice: 183.98,
  bookingDate: "2024-06-01T10:30:00Z",
  status: "confirmed",
  qrCode: "QR123456789",
  confirmationNumber: "EVT-2024-001234",
  paymentMethod: "•••• 4242",
  organizer: "NYC Events Co.",
  eventImage: "/placeholder.svg?height=300&width=600",
  tickets: [
    {
      id: "ticket-1",
      holderName: "John Doe",
      seatSection: "General Admission",
      qrCode: "QR123456789-1",
    },
    {
      id: "ticket-2",
      holderName: "Jane Doe",
      seatSection: "General Admission",
      qrCode: "QR123456789-2",
    },
  ],
}

export default function BookingDetailsPage() {
  const params = useParams()

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

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold">Booking Details</h1>
              <Badge className={getStatusColor(mockBookingDetails.status)}>{mockBookingDetails.status}</Badge>
            </div>
            <p className="text-muted-foreground">Confirmation #{mockBookingDetails.confirmationNumber}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <img
                      src={mockBookingDetails.eventImage || "/placeholder.svg"}
                      alt={mockBookingDetails.eventTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-serif font-semibold mb-4">{mockBookingDetails.eventTitle}</h3>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {new Date(mockBookingDetails.eventDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {mockBookingDetails.eventTime} - {mockBookingDetails.eventEndTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{mockBookingDetails.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{mockBookingDetails.organizer}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{mockBookingDetails.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tickets */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockBookingDetails.tickets.map((ticket, index) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">Ticket #{index + 1}</h4>
                          <p className="text-sm text-muted-foreground">{ticket.holderName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{ticket.seatSection}</p>
                          <p className="text-sm text-muted-foreground">QR: {ticket.qrCode}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center p-6 bg-muted/30 rounded-lg">
                        <div className="text-center">
                          <QrCode className="w-16 h-16 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">QR Code</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download All Tickets
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <QrCode className="w-4 h-4 mr-2" />
                      Show QR Codes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Tickets ({mockBookingDetails.quantity}x)</span>
                      <span className="text-sm">
                        ${mockBookingDetails.pricePerTicket * mockBookingDetails.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Service Fee</span>
                      <span className="text-sm">${mockBookingDetails.serviceFee}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total Paid</span>
                      <span>${mockBookingDetails.totalPrice}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booked on</span>
                      <span>
                        {new Date(mockBookingDetails.bookingDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment</span>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        <span>{mockBookingDetails.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Add to Calendar
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>

              {/* Important Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium mb-1">Entry Requirements</p>
                    <p className="text-muted-foreground">
                      Please bring a valid ID and your ticket (digital or printed).
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Cancellation Policy</p>
                    <p className="text-muted-foreground">Free cancellation up to 24 hours before the event.</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Contact</p>
                    <p className="text-muted-foreground">For questions, contact the organizer or EventHub support.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
