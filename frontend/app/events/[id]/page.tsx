"use client"

import { TabsTrigger } from "@/components/ui/tabs"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  Share2,
  Heart,
  ArrowLeft,
  Music,
  Ticket,
  Info,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SeatMap } from "@/components/events/seat-map"
import { EventReviews } from "@/components/events/event-reviews"
import { RelatedEvents } from "@/components/events/related-events"
import { VenueMap } from "@/components/events/venue-map"
import { useAppDispatch } from "@/lib/hooks"
import { setSelectedEvent } from "@/lib/slices/eventSlice"
import type { Event } from "@/lib/slices/eventSlice"

// Mock event data - in real app, this would come from API
const mockEvent: Event = {
  id: "1",
  title: "Summer Music Festival 2024",
  description:
    "Join us for the biggest music festival of the year featuring top artists from around the world. Experience three days of non-stop music, food, and entertainment in the heart of Central Park. This year's lineup includes Grammy-winning artists, emerging talents, and special surprise performances that will make this an unforgettable experience.",
  category: "music",
  date: "2024-07-15",
  time: "18:00",
  venue: {
    id: "v1",
    name: "Central Park Great Lawn",
    address: "Central Park West & 79th St",
    city: "New York",
    capacity: 50000,
  },
  price: { min: 89, max: 299 },
  image: "/placeholder.svg?height=600&width=1200",
  organizer: { id: "o1", name: "MusicEvents Co" },
  tags: ["festival", "outdoor", "multi-day", "food-trucks", "camping"],
  status: "upcoming",
}

const mockPerformers = [
  {
    id: "p1",
    name: "The Electric Waves",
    genre: "Electronic",
    time: "18:00 - 19:30",
    stage: "Main Stage",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "p2",
    name: "Acoustic Dreams",
    genre: "Folk",
    time: "20:00 - 21:30",
    stage: "Acoustic Stage",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "p3",
    name: "Rock Revolution",
    genre: "Rock",
    time: "22:00 - 23:30",
    stage: "Main Stage",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLiked, setIsLiked] = useState(false)
  const [selectedTab, setSelectedTab] = useState("overview")

  const eventId = params.id as string

  useEffect(() => {
    // In real app, fetch event by ID
    dispatch(setSelectedEvent(mockEvent))
  }, [eventId, dispatch])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatPrice = (min: number, max: number) => {
    if (min === max) return `$${min}`
    return `$${min} - $${max}`
  }

  const handleBookNow = () => {
    router.push(`/events/${eventId}/seats`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: mockEvent.title,
          text: mockEvent.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden mb-6">
              <img
                src={mockEvent.image || "/placeholder.svg"}
                alt={mockEvent.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <Badge variant="secondary" className="mb-2">
                  {mockEvent.category}
                </Badge>
                <h1 className="text-4xl font-display font-bold mb-2">{mockEvent.title}</h1>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(mockEvent.date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {mockEvent.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {mockEvent.venue.city}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <GlassCard className="sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {formatPrice(mockEvent.price.min, mockEvent.price.max)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">per ticket</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Date</span>
                  <span className="font-medium">{formatDate(mockEvent.date)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Time</span>
                  <span className="font-medium">{mockEvent.time}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Venue</span>
                  <span className="font-medium">{mockEvent.venue.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Capacity</span>
                  <span className="font-medium">{mockEvent.venue.capacity.toLocaleString()}</span>
                </div>
              </div>

              <Button onClick={handleBookNow} className="w-full gradient-primary text-white mb-4" size="lg">
                <Ticket className="h-5 w-5 mr-2" />
                Select Seats
              </Button>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                  {isLiked ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Secure Booking
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    4.8 Rating
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lineup">Lineup</TabsTrigger>
            <TabsTrigger value="seating">Seating</TabsTrigger>
            <TabsTrigger value="venue">Venue</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <GlassCard>
                  <h2 className="text-2xl font-display font-bold mb-4">About This Event</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{mockEvent.description}</p>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">What's Included</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li className="flex items-center">
                        <Music className="h-4 w-4 mr-2 text-primary" />
                        Live performances from 20+ artists
                      </li>
                      <li className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        Access to all festival areas
                      </li>
                      <li className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        Food trucks and beverage stations
                      </li>
                      <li className="flex items-center">
                        <Info className="h-4 w-4 mr-2 text-primary" />
                        Festival merchandise discounts
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {mockEvent.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </GlassCard>
              </div>

              <div className="lg:col-span-1">
                <GlassCard>
                  <h3 className="text-lg font-semibold mb-4">Event Organizer</h3>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Music className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{mockEvent.organizer.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Event Organizer</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Professional event organizer with 10+ years of experience in music festivals and concerts.
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View Profile
                  </Button>
                </GlassCard>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lineup" className="mt-6">
            <GlassCard>
              <h2 className="text-2xl font-display font-bold mb-6">Artist Lineup</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPerformers.map((performer) => (
                  <div key={performer.id} className="text-center">
                    <img
                      src={performer.image || "/placeholder.svg"}
                      alt={performer.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="font-semibold text-lg mb-1">{performer.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{performer.genre}</p>
                    <div className="text-xs text-gray-500">
                      <div>{performer.time}</div>
                      <div>{performer.stage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="seating" className="mt-6">
            <GlassCard>
              <h2 className="text-2xl font-display font-bold mb-6">Seating Chart</h2>
              <SeatMap eventId={eventId} />
            </GlassCard>
          </TabsContent>

          <TabsContent value="venue" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <GlassCard>
                <h2 className="text-2xl font-display font-bold mb-4">Venue Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{mockEvent.venue.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {mockEvent.venue.address}, {mockEvent.venue.city}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Venue Details</h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <li>Capacity: {mockEvent.venue.capacity.toLocaleString()} people</li>
                      <li>Outdoor venue with covered areas</li>
                      <li>Accessible facilities available</li>
                      <li>Parking available on-site</li>
                      <li>Public transportation nearby</li>
                    </ul>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-lg font-semibold mb-4">Location</h3>
                <VenueMap venue={mockEvent.venue} />
              </GlassCard>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <EventReviews eventId={eventId} />
          </TabsContent>
        </Tabs>

        {/* Related Events */}
        <RelatedEvents currentEventId={eventId} category={mockEvent.category} />
      </div>

      <Footer />
    </div>
  )
}
