"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SeatSelection } from "@/components/seat-selection"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Calendar, MapPin, Clock, Star, Users, Share2, Heart, ArrowLeft, Ticket, CreditCard } from "lucide-react"
import Link from "next/link"

// Mock event data (in real app, this would come from API)
const mockEvent = {
  id: "1",
  title: "Summer Music Festival 2024",
  description:
    "Join us for an unforgettable night of music featuring top artists from around the world. Experience live performances, food trucks, and an amazing atmosphere under the stars.",
  longDescription:
    "The Summer Music Festival 2024 promises to be the event of the year! Featuring headliners from multiple genres including rock, pop, electronic, and indie music. Our festival spans across three stages with continuous performances from 6 PM to midnight. Food vendors will offer everything from gourmet burgers to vegan options, and our craft beer garden will feature local breweries. VIP packages include backstage access and premium seating areas.",
  date: "2024-07-15",
  time: "18:00",
  endTime: "00:00",
  venue: "Central Park Amphitheater",
  location: "New York, NY",
  address: "1234 Central Park West, New York, NY 10025",
  price: 89,
  category: "Music",
  rating: 4.8,
  attendees: 2500,
  maxCapacity: 3000,
  image: "/placeholder.svg?height=400&width=800",
  organizer: "NYC Events Co.",
  tags: ["Music", "Festival", "Outdoor", "Food & Drinks"],
  lineup: ["The Electric Waves", "Midnight Serenade", "DJ Cosmic", "Indie Collective"],
}

// Mock seat data
const seatSections = [
  { id: "vip", name: "VIP Section", price: 150, available: 45, total: 50, color: "bg-accent" },
  { id: "premium", name: "Premium", price: 120, available: 120, total: 150, color: "bg-secondary" },
  { id: "general", name: "General Admission", price: 89, available: 800, total: 1000, color: "bg-primary" },
  { id: "lawn", name: "Lawn Seating", price: 65, available: 1500, total: 1800, color: "bg-muted" },
]

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [isBooking, setIsBooking] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited
        ? "Event has been removed from your favorites."
        : "Event has been added to your favorites.",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockEvent.title,
        text: mockEvent.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Event link has been copied to your clipboard.",
      })
    }
  }

  const handleBookTicket = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book tickets.",
        variant: "destructive",
      })
      router.push("/signin")
      return
    }

    if (!selectedSection) {
      toast({
        title: "Select a section",
        description: "Please choose a seating section to continue.",
        variant: "destructive",
      })
      return
    }

    setIsBooking(true)
    try {
      // Simulate booking process with progress
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Booking successful! 🎉",
        description: `Your ${ticketQuantity} ticket(s) have been booked successfully.`,
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsBooking(false)
    }
  }

  const selectedSectionData = seatSections.find((section) => section.id === selectedSection)
  const totalPrice = selectedSectionData ? selectedSectionData.price * ticketQuantity : 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </Button>
      </div>

      {/* Event Header */}
      <section className="relative">
        <div className="aspect-video md:aspect-[3/1] overflow-hidden">
          <img
            src={mockEvent.image || "/placeholder.svg"}
            alt={mockEvent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {mockEvent.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">{mockEvent.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {new Date(mockEvent.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {mockEvent.time} - {mockEvent.endTime}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {mockEvent.location}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-lg">{mockEvent.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <span>{mockEvent.attendees} attending</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleFavorite}
                      className={isFavorited ? "text-red-500 border-red-500" : ""}
                    >
                      <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h2 className="text-2xl font-serif font-semibold mb-4">About This Event</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{mockEvent.longDescription}</p>

                <Separator className="my-6" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Event Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Organizer:</span>
                        <span>{mockEvent.organizer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Venue:</span>
                        <span>{mockEvent.venue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Address:</span>
                        <span className="text-right">{mockEvent.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span>{mockEvent.maxCapacity} people</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Lineup</h3>
                    <div className="space-y-2">
                      {mockEvent.lineup.map((artist, index) => (
                        <div key={artist} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">{artist}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seat Selection */}
            <SeatSelection
              sections={seatSections}
              onSectionSelect={setSelectedSection}
              selectedSection={selectedSection}
            />
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-semibold mb-6 flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Book Your Tickets
                </h3>

                {/* Quantity Selection */}
                {selectedSection && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <select
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(Number(e.target.value))}
                      className="w-full p-3 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} ticket{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Price Summary */}
                {selectedSection && (
                  <div className="bg-muted/50 p-4 rounded-lg mb-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">
                          {selectedSectionData?.name} ({ticketQuantity}x)
                        </span>
                        <span className="text-sm font-medium">${selectedSectionData?.price! * ticketQuantity}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Service fee</span>
                        <span>$5.99</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Processing fee</span>
                        <span>$2.50</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center font-semibold text-lg">
                        <span>Total</span>
                        <span>${totalPrice + 8.49}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleBookTicket}
                  disabled={!selectedSection || isBooking}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  size="lg"
                >
                  {isBooking ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Book Tickets - ${totalPrice + 8.49}
                    </div>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  🔒 Secure checkout • Free cancellation up to 24 hours before the event
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
