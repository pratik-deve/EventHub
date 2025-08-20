"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { EventCard } from "@/components/event-card"
import { SearchFilters } from "@/components/search-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, TrendingUp } from "lucide-react"

// Mock event data
const mockEvents = [
  {
    id: "1",
    title: "Summer Music Festival 2024",
    description: "Join us for an unforgettable night of music featuring top artists from around the world.",
    date: "2024-07-15",
    time: "18:00",
    venue: "Central Park Amphitheater",
    location: "New York, NY",
    price: 89,
    category: "Music",
    rating: 4.8,
    attendees: 2500,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
  },
  {
    id: "2",
    title: "Tech Innovation Conference",
    description: "Discover the latest trends in technology and network with industry leaders.",
    date: "2024-08-22",
    time: "09:00",
    venue: "Convention Center",
    location: "San Francisco, CA",
    price: 299,
    category: "Technology",
    rating: 4.9,
    attendees: 1200,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
  {
    id: "3",
    title: "Food & Wine Tasting",
    description: "Experience exquisite cuisine and fine wines from renowned chefs and sommeliers.",
    date: "2024-06-30",
    time: "19:30",
    venue: "Grand Hotel Ballroom",
    location: "Chicago, IL",
    price: 125,
    category: "Food & Drink",
    rating: 4.7,
    attendees: 300,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
  },
  {
    id: "4",
    title: "Art Gallery Opening",
    description: "Celebrate contemporary art with an exclusive gallery opening featuring emerging artists.",
    date: "2024-07-08",
    time: "18:00",
    venue: "Modern Art Museum",
    location: "Los Angeles, CA",
    price: 45,
    category: "Arts & Culture",
    rating: 4.6,
    attendees: 150,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
  {
    id: "5",
    title: "Marathon Training Workshop",
    description: "Professional training session for marathon preparation with expert coaches.",
    date: "2024-07-20",
    time: "07:00",
    venue: "City Sports Complex",
    location: "Boston, MA",
    price: 75,
    category: "Sports & Fitness",
    rating: 4.5,
    attendees: 80,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
  {
    id: "6",
    title: "Business Networking Mixer",
    description: "Connect with professionals and entrepreneurs in a relaxed networking environment.",
    date: "2024-08-05",
    time: "18:30",
    venue: "Rooftop Lounge",
    location: "Miami, FL",
    price: 35,
    category: "Business",
    rating: 4.4,
    attendees: 200,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
  {
    id: "7",
    title: "Jazz Night Under the Stars",
    description: "An intimate evening of smooth jazz in a beautiful outdoor setting.",
    date: "2024-08-10",
    time: "20:00",
    venue: "Riverside Park",
    location: "New York, NY",
    price: 65,
    category: "Music",
    rating: 4.7,
    attendees: 400,
    image: "/placeholder.svg?height=200&width=300",
    featured: true,
  },
  {
    id: "8",
    title: "Digital Marketing Summit",
    description: "Learn the latest digital marketing strategies from industry experts.",
    date: "2024-09-05",
    time: "09:00",
    venue: "Tech Hub",
    location: "San Francisco, CA",
    price: 199,
    category: "Technology",
    rating: 4.8,
    attendees: 800,
    image: "/placeholder.svg?height=200&width=300",
    featured: false,
  },
]

export default function EventsPage() {
  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "All",
    location: "All",
    dateRange: {},
    priceRange: [0, 500],
    sortBy: "date",
  })

  const filteredEvents = useMemo(() => {
    return mockEvents
      .filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
        const matchesCategory = filters.category === "All" || event.category === filters.category
        const matchesLocation = filters.location === "All" || event.location === filters.location
        const matchesPrice = event.price >= filters.priceRange[0] && event.price <= filters.priceRange[1]

        let matchesDate = true
        if (filters.dateRange.from) {
          const eventDate = new Date(event.date)
          const fromDate = new Date(filters.dateRange.from)
          const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : fromDate
          matchesDate = eventDate >= fromDate && eventDate <= toDate
        }

        return matchesSearch && matchesCategory && matchesLocation && matchesPrice && matchesDate
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "price-low":
            return a.price - b.price
          case "price-high":
            return b.price - a.price
          case "rating":
            return b.rating - a.rating
          case "popularity":
            return b.attendees - a.attendees
          case "date":
          default:
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        }
      })
  }, [filters])

  const featuredEvents = mockEvents.filter((event) => event.featured)
  const trendingEvents = mockEvents.sort((a, b) => b.attendees - a.attendees).slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">Discover Amazing Events</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find your next unforgettable experience from concerts to conferences, workshops to festivals.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <SearchFilters onFiltersChange={setFilters} />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Events Section */}
        {filters.searchQuery === "" && filters.category === "All" && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-serif font-bold">Featured Events</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Trending Events Section */}
        {filters.searchQuery === "" && filters.category === "All" && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-serif font-bold">Trending Now</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {trendingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* All Events Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif font-semibold">
              {filters.searchQuery || filters.category !== "All" || filters.location !== "All"
                ? `${filteredEvents.length} Events Found`
                : "All Events"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or browse our featured events.
                </p>
                <Button
                  onClick={() =>
                    setFilters({
                      searchQuery: "",
                      category: "All",
                      location: "All",
                      dateRange: {},
                      priceRange: [0, 500],
                      sortBy: "date",
                    })
                  }
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
