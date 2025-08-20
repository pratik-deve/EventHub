"use client"

import { useState, useMemo, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { EventCard } from "@/components/event-card"
import { SearchFilters } from "@/components/search-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, TrendingUp } from "lucide-react"
import { indianStates } from "@/public/constants/constants"


// Utility function to generate random values
const getRandomValue = (array: any[]) => array[Math.floor(Math.random() * array.length)]

const eventCategoryLabels: Record<string, string> = {
  GENERAL: "General",
  MUSIC: "Music",
  TECHNOLOGY: "Technology",
  FOOD_AND_DRINK: "Food & Drink",
  ARTS_AND_CULTURE: "Arts & Culture",
  SPORTS_AND_FITNESS: "Sports & Fitness",
  BUSINESS: "Business",
}

const getCategoryLabel = (categoryKey: string): string => {
  return eventCategoryLabels[categoryKey] || "General" // Default to "General" if the key is not found
}

const extractStateFromAddress = (address: string): string => {
  for (const state of indianStates) {
    if (address.toLowerCase().includes(state.toLowerCase())) {
      return state
    }
  }
  return "Unknown Location" // Default if no state is found
}
export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]) // State to store events fetched from the backend
  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "All",
    location: "All",
    dateRange: {},
    priceRange: [0, 500],
    sortBy: "date",
  })

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/public`)
        const data = await response.json()

        // Map backend data to include missing fields with random/default values
        const mappedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title || "Untitled Event",
          description: event.description || "No description available.",
          date: event.startTime ? event.startTime.split("T")[0] : "2025-01-01", // Extract date from startTime
          time: event.startTime ? event.startTime.split("T")[1] : "00:00", // Extract time from startTime
          venue: event.venueId ? `Venue #${event.venueId}` : "Unknown Venue",
          location: extractStateFromAddress(event.venueAddress || " "), // Default location
          price: event.price || getRandomValue([0, 50, 100, 150, 200]), // Random price if not provided
          category: getCategoryLabel(event.eventCategories), 
          rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)), // Random rating between 3.5 and 5
          attendees: getRandomValue([50, 100, 200, 500, 1000]), // Random attendees
          image: "/placeholder.svg?height=200&width=300", // Default placeholder image
          featured: Math.random() > 0.5, // Randomly mark as featured
        }))

        setEvents(mappedEvents)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      }
    }

    fetchEvents()
  }, [])

  // Filter and sort events based on user input
 const filteredEvents = useMemo(() => {
  return events
    .filter((event) => {
      // Ensure all fields have default values
      const title = event.title || ""
      const location = event.location || "Unknown Location"
      const description = event.description || ""
      const category = event.category || "General"
      const price = event.price || 0
      const date = event.date || "1970-01-01"

      // Search Query Match
      const matchesSearch =
        title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(filters.searchQuery.toLowerCase())

      // Category Match
      const matchesCategory = filters.category === "All" || category === filters.category

      // Location Match
      const matchesLocation = filters.location === "All" || location === filters.location

      // Price Match
      const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1]

      // Date Match
      let matchesDate = true
      if (filters.dateRange.from) {
        const eventDate = new Date(date)
        const fromDate = new Date(filters.dateRange.from)
        const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : fromDate
        matchesDate = eventDate >= fromDate && eventDate <= toDate
      }

      // Combine all filters
      return matchesSearch && matchesCategory && matchesLocation && matchesPrice && matchesDate
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0)
        case "price-high":
          return (b.price || 0) - (a.price || 0)
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "popularity":
          return (b.attendees || 0) - (a.attendees || 0)
        case "date":
        default:
          return new Date(a.date || "1970-01-01").getTime() - new Date(b.date || "1970-01-01").getTime()
      }
    })
}, [filters, events])


  const featuredEvents = events.filter((event) => event.featured)
  const trendingEvents = events.sort((a, b) => b.attendees - a.attendees).slice(0, 3)

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
                <SearchFilters
                  onFiltersChange={(updatedFilters) => {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      ...updatedFilters,
                    }))
                  }}
                />
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
