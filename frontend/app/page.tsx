"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin, ArrowRight, Music, Film, Trophy, Theater, Mic, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/ui/glass-card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EventCard } from "@/components/events/event-card"
import { CategoryCard } from "@/components/events/category-card"
import { TrendingCarousel } from "@/components/events/trending-carousel"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchEvents } from "@/lib/slices/eventSlice"
import type { Event } from "@/lib/slices/eventSlice"

// Mock data for demonstration
const mockTrendingEvents: Event[] = [
  {
    id: "1",
    title: "Summer Music Festival 2024",
    description: "The biggest music festival of the year featuring top artists",
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
    description: "Watch all Marvel movies in chronological order",
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
    description: "The ultimate showdown between top teams",
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
]

const categories = [
  {
    id: "music",
    name: "Music",
    icon: Music,
    description: "Concerts, festivals, and live performances",
    color: "from-purple-500 to-pink-500",
    count: 234,
  },
  {
    id: "movies",
    name: "Movies",
    icon: Film,
    description: "Cinema screenings and film festivals",
    color: "from-blue-500 to-cyan-500",
    count: 156,
  },
  {
    id: "sports",
    name: "Sports",
    icon: Trophy,
    description: "Games, matches, and tournaments",
    color: "from-green-500 to-emerald-500",
    count: 89,
  },
  {
    id: "theater",
    name: "Theater",
    icon: Theater,
    description: "Plays, musicals, and performances",
    color: "from-red-500 to-orange-500",
    count: 67,
  },
  {
    id: "comedy",
    name: "Comedy",
    icon: Mic,
    description: "Stand-up shows and comedy nights",
    color: "from-yellow-500 to-amber-500",
    count: 45,
  },
  {
    id: "other",
    name: "Other",
    icon: Users,
    description: "Workshops, conferences, and more",
    color: "from-gray-500 to-slate-500",
    count: 123,
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchLocation, setSearchLocation] = useState("")
  const dispatch = useAppDispatch()
  const { featuredEvents, isLoading } = useAppSelector((state) => state.events)

  useEffect(() => {
    // Fetch featured events on component mount
    dispatch(fetchEvents({ page: 1, filters: {} }))
  }, [dispatch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Navigate to search results page with query parameters
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (searchLocation) params.set("location", searchLocation)
    window.location.href = `/events?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 dark:from-purple-900/30 dark:to-blue-900/30" />
        <div className="relative container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-fade-in">
              Discover Amazing <span className="gradient-primary bg-clip-text">Events</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
              Find and book tickets for concerts, movies, sports events, and unforgettable experiences in your city.
            </p>

            {/* Search Form */}
            <GlassCard className="max-w-3xl mx-auto">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search events, artists, venues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <Button type="submit" size="lg" className="gradient-primary text-white h-12 px-8">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </form>
            </GlassCard>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <div className="text-gray-600 dark:text-gray-300">Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-gray-600 dark:text-gray-300">Venues</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">1M+</div>
                <div className="text-gray-600 dark:text-gray-300">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-gray-600 dark:text-gray-300">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Events Carousel */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Trending Events</h2>
              <p className="text-gray-600 dark:text-gray-300">Don't miss out on these popular events</p>
            </div>
            <Button variant="outline" className="hidden md:flex bg-transparent">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <TrendingCarousel events={mockTrendingEvents} />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Browse by Category</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore events across different categories and find exactly what you're looking for
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Featured Events</h2>
              <p className="text-gray-600 dark:text-gray-300">Hand-picked events just for you</p>
            </div>
            <Button variant="outline" className="hidden md:flex bg-transparent">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTrendingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Never Miss an Event</h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter and get notified about the latest events in your area
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
