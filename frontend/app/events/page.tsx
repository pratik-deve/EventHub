"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EventCard } from "@/components/events/event-card"
import { EventFilters } from "@/components/events/event-filters"
import { EventSort } from "@/components/events/event-sort"
import { Pagination } from "@/components/ui/pagination"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setFilters, clearFilters } from "@/lib/slices/eventSlice"
import type { Event } from "@/lib/slices/eventSlice"

// Mock events data for demonstration
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Summer Music Festival 2024",
    description: "The biggest music festival of the year featuring top artists from around the world",
    category: "music",
    date: "2024-07-15",
    time: "18:00",
    venue: {
      id: "v1",
      name: "Central Park",
      address: "Central Park West",
      city: "New York",
      capacity: 50000,
    },
    price: { min: 89, max: 299 },
    image: "/placeholder.svg?height=400&width=600",
    organizer: { id: "o1", name: "MusicEvents Co" },
    tags: ["festival", "outdoor", "multi-day"],
    status: "upcoming",
  },
  {
    id: "2",
    title: "Marvel Movie Marathon",
    description: "Watch all Marvel movies in chronological order with fellow fans",
    category: "movies",
    date: "2024-06-20",
    time: "10:00",
    venue: {
      id: "v2",
      name: "Grand Cinema",
      address: "123 Movie St",
      city: "Los Angeles",
      capacity: 500,
    },
    price: { min: 25, max: 45 },
    image: "/placeholder.svg?height=400&width=600",
    organizer: { id: "o2", name: "Cinema Events" },
    tags: ["marathon", "superhero", "all-day"],
    status: "upcoming",
  },
  {
    id: "3",
    title: "Championship Finals",
    description: "The ultimate showdown between the top teams of the season",
    category: "sports",
    date: "2024-08-10",
    time: "19:30",
    venue: {
      id: "v3",
      name: "Sports Arena",
      address: "456 Stadium Ave",
      city: "Chicago",
      capacity: 25000,
    },
    price: { min: 150, max: 500 },
    image: "/placeholder.svg?height=400&width=600",
    organizer: { id: "o3", name: "Sports League" },
    tags: ["championship", "finals", "premium"],
    status: "upcoming",
  },
  {
    id: "4",
    title: "Broadway Musical Night",
    description: "An evening of classic Broadway performances by talented local artists",
    category: "theater",
    date: "2024-06-25",
    time: "20:00",
    venue: {
      id: "v4",
      name: "Theater District",
      address: "789 Broadway",
      city: "New York",
      capacity: 1200,
    },
    price: { min: 75, max: 200 },
    image: "/placeholder.svg?height=400&width=600",
    organizer: { id: "o4", name: "Broadway Productions" },
    tags: ["musical", "broadway", "evening"],
    status: "upcoming",
  },
  {
    id: "5",
    title: "Stand-Up Comedy Night",
    description: "Laugh out loud with the best comedians in the city",
    category: "comedy",
    date: "2024-06-30",
    time: "21:00",
    venue: {
      id: "v5",
      name: "Comedy Club",
      address: "321 Laugh Lane",
      city: "San Francisco",
      capacity: 300,
    },
    price: { min: 30, max: 60 },
    image: "/placeholder.svg?height=400&width=600",
    organizer: { id: "o5", name: "Comedy Central" },
    tags: ["comedy", "stand-up", "nightlife"],
    status: "upcoming",
  },
  {
    id: "6",
    title: "Tech Conference 2024",
    description: "Learn about the latest trends in technology and innovation",
    category: "other",
    date: "2024-09-15",
    time: "09:00",
    venue: {
      id: "v6",
      name: "Convention Center",
      address: "555 Tech Blvd",
      city: "Austin",
      capacity: 2000,
    },
    price: { min: 200, max: 500 },
    image: "/placeholder.svg?height=400&width=600",
    organizer: { id: "o6", name: "Tech Events Inc" },
    tags: ["conference", "technology", "networking"],
    status: "upcoming",
  },
]

function EventsPageContent() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents)
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 9

  const dispatch = useAppDispatch()
  const { events, filters, isLoading, pagination } = useAppSelector((state) => state.events)

  // Initialize filters from URL params
  useEffect(() => {
    const initialFilters = {
      search: searchParams.get("q") || "",
      category: searchParams.get("category") || "",
      location: searchParams.get("location") || "",
    }
    dispatch(setFilters(initialFilters))
    setSearchQuery(initialFilters.search)
  }, [searchParams, dispatch])

  // Filter events based on current filters
  useEffect(() => {
    let filtered = mockEvents

    if (filters.search) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
          event.description.toLowerCase().includes(filters.search!.toLowerCase()) ||
          event.venue.city.toLowerCase().includes(filters.search!.toLowerCase()),
      )
    }

    if (filters.category) {
      filtered = filtered.filter((event) => event.category === filters.category)
    }

    if (filters.location) {
      filtered = filtered.filter((event) => event.venue.city.toLowerCase().includes(filters.location!.toLowerCase()))
    }

    if (filters.priceRange) {
      filtered = filtered.filter(
        (event) => event.price.min >= filters.priceRange!.min && event.price.max <= filters.priceRange!.max,
      )
    }

    if (filters.dateRange) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date)
        const startDate = new Date(filters.dateRange!.start)
        const endDate = new Date(filters.dateRange!.end)
        return eventDate >= startDate && eventDate <= endDate
      })
    }

    setFilteredEvents(filtered)
    setCurrentPage(1)
  }, [filters])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setFilters({ search: searchQuery }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
    setSearchQuery("")
  }

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)
  const startIndex = (currentPage - 1) * eventsPerPage
  const currentEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage)

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-4">
            Discover <span className="gradient-primary bg-clip-text text-transparent">Events</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Find amazing events happening near you. {filteredEvents.length} events found.
          </p>
        </div>

        {/* Search Bar */}
        <GlassCard className="mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events, artists, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button type="submit" className="gradient-primary text-white h-12 px-6">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </GlassCard>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="lg:sticky lg:top-24">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full justify-between"
                >
                  <span className="flex items-center">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </span>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Filters */}
              <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
                <EventFilters onClearFilters={handleClearFilters} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Showing {startIndex + 1}-{Math.min(startIndex + eventsPerPage, filteredEvents.length)} of{" "}
                  {filteredEvents.length} events
                </span>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    Clear all filters
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <EventSort />
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Events Grid/List */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : currentEvents.length > 0 ? (
              <>
                <div
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
                >
                  {currentEvents.map((event) => (
                    <EventCard key={event.id} event={event} variant={viewMode === "list" ? "compact" : "default"} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-xl font-semibold mb-2">No events found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Try adjusting your search criteria or filters</p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventsPageContent />
    </Suspense>
  )
}
