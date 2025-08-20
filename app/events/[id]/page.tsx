"use client"

import { useEffect, useState } from "react"
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

// Utility function to extract state from venueAddress
const extractStateFromAddress = (address: string): string => {
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Puducherry",
    "Chandigarh",
  ]

  for (const state of indianStates) {
    if (address.toLowerCase().includes(state.toLowerCase())) {
      return state
    }
  }
  return "Unknown Location"
}

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [event, setEvent] = useState<any | null>(null) // State to store the fetched event
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [isBooking, setIsBooking] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  // Fetch event details from the backend
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/events/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch event details")
        }
        const data = await response.json()

        // Process the response to extract or set default values
        const processedEvent = {
          id: data.id,
          title: data.title || "Untitled Event",
          description: data.description || "No description available.",
          startTime: data.startTime || "2025-01-01T00:00",
          endTime: data.endTime || "2025-01-01T01:00",
          venueAddress: data.venueAddress || "Unknown Address",
          location: extractStateFromAddress(data.venueAddress || ""),
          category: data.eventCategories || "General",
          image: "/placeholder.svg", // Default placeholder image
          rating: Math.random() * (5 - 3.5) + 3.5, // Random rating between 3.5 and 5
          attendees: Math.floor(Math.random() * 500) + 50, // Random attendees between 50 and 500
          organizer: "Unknown Organizer", // Default organizer
          maxCapacity: 1000, // Default capacity
          longDescription: data.description || "No additional details available.",
          seatSections: [], // Default empty seat sections
          tags: [data.eventCategories], // Use category as a tag
        }

        setEvent(processedEvent)
      } catch (error) {
        console.error("Error fetching event:", error)
        toast({
          title: "Error",
          description: "Failed to load event details. Please try again later.",
          variant: "destructive",
        })
        router.push("/events") // Redirect to events list if fetching fails
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [params.id, router, toast])

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
        title: event?.title,
        text: event?.description,
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

  const selectedSectionData = event?.seatSections?.find((section: any) => section.id === selectedSection)
  const totalPrice = selectedSectionData ? selectedSectionData.price * ticketQuantity : 0

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event) {
    return null // Render nothing if the event is not available
  }

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
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {new Date(event.startTime).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                {new Date(event.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {event.location}
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
                      <span className="font-semibold text-lg">{event.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <span>{event.attendees} attending</span>
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
                <p className="text-muted-foreground leading-relaxed mb-6">{event.longDescription}</p>

                <Separator className="my-6" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Event Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Organizer:</span>
                        <span>{event.organizer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Venue:</span>
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Address:</span>
                        <span className="text-right">{event.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span>{event.maxCapacity} people</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Lineup</h3>
                    <div className="space-y-2">
                      {event.lineup?.map((artist: string) => (
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
              sections={event.seatSections || []}
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
