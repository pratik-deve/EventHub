"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Calendar, MapPin, Star, Users, Filter, Heart, Share2, SlidersHorizontal, Grid3X3, List } from 'lucide-react'
import Link from "next/link"

const events = [
  {
    id: 1,
    title: "Summer Music Festival 2024",
    image: "/placeholder.svg?height=300&width=400",
    date: "July 15-17, 2024",
    time: "6:00 PM",
    location: "Central Park, New York",
    venue: "Great Lawn",
    price: 89,
    originalPrice: 120,
    category: "Music",
    rating: 4.8,
    attendees: 2500,
    description: "The biggest summer music festival featuring top artists",
    tags: ["Outdoor", "Multi-day", "Food & Drinks"]
  },
  {
    id: 2,
    title: "Tech Innovation Summit",
    image: "/placeholder.svg?height=300&width=400",
    date: "August 22, 2024",
    time: "9:00 AM",
    location: "San Francisco, CA",
    venue: "Moscone Center",
    price: 299,
    originalPrice: 399,
    category: "Conference",
    rating: 4.9,
    attendees: 1200,
    description: "Leading tech innovators share insights on future technology",
    tags: ["Networking", "Professional", "Innovation"]
  },
  {
    id: 3,
    title: "Broadway Musical Night",
    image: "/placeholder.svg?height=300&width=400",
    date: "September 5, 2024",
    time: "8:00 PM",
    location: "New York, NY",
    venue: "Broadway Theater",
    price: 125,
    originalPrice: 150,
    category: "Theater",
    rating: 4.7,
    attendees: 800,
    description: "An enchanting evening of Broadway's greatest hits",
    tags: ["Musical", "Live Performance", "Classic"]
  },
  {
    id: 4,
    title: "Food & Wine Festival",
    image: "/placeholder.svg?height=300&width=400",
    date: "October 12, 2024",
    time: "12:00 PM",
    location: "Napa Valley, CA",
    venue: "Vineyard Grounds",
    price: 75,
    originalPrice: 95,
    category: "Food",
    rating: 4.6,
    attendees: 1500,
    description: "Taste the finest wines and gourmet cuisine",
    tags: ["Tasting", "Outdoor", "Gourmet"]
  },
  {
    id: 5,
    title: "Comedy Night Live",
    image: "/placeholder.svg?height=300&width=400",
    date: "November 8, 2024",
    time: "7:30 PM",
    location: "Los Angeles, CA",
    venue: "Comedy Store",
    price: 45,
    originalPrice: 60,
    category: "Comedy",
    rating: 4.5,
    attendees: 300,
    description: "Laugh out loud with top comedians",
    tags: ["Stand-up", "Entertainment", "Night Out"]
  },
  {
    id: 6,
    title: "Art Gallery Opening",
    image: "/placeholder.svg?height=300&width=400",
    date: "December 3, 2024",
    time: "6:00 PM",
    location: "Chicago, IL",
    venue: "Modern Art Museum",
    price: 25,
    originalPrice: 35,
    category: "Art",
    rating: 4.4,
    attendees: 200,
    description: "Exclusive preview of contemporary art collection",
    tags: ["Exhibition", "Culture", "Exclusive"]
  }
]

const categories = ["All", "Music", "Theater", "Conference", "Sports", "Comedy", "Art", "Food"]
const locations = ["All Locations", "New York", "Los Angeles", "San Francisco", "Chicago", "Miami"]
const sortOptions = ["Relevance", "Date", "Price: Low to High", "Price: High to Low", "Rating"]

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [sortBy, setSortBy] = useState("Relevance")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                EventHub
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search events, artists, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
              
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="p-6 mb-6">
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    step={10}
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 6).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Events</h1>
            <p className="text-gray-600">{events.length} events found</p>
          </div>
        </div>

        {/* Events Grid/List */}
        <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {events.map((event) => (
            <Card key={event.id} className={`overflow-hidden hover:shadow-xl transition-all duration-300 group ${
              viewMode === "list" ? "flex flex-row" : ""
            }`}>
              <div className={`relative ${viewMode === "list" ? "w-64 flex-shrink-0" : ""}`}>
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                    viewMode === "list" ? "w-full h-full" : "w-full h-48"
                  }`}
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-purple-600 hover:bg-purple-700">
                    {event.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/90 hover:bg-white">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/90 hover:bg-white">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                {event.originalPrice > event.price && (
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="destructive" className="bg-red-500">
                      {Math.round(((event.originalPrice - event.price) / event.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.venue}, {event.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendees.toLocaleString()} attending
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {event.rating}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="p-6 pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-purple-600">
                      ${event.price}
                    </div>
                    {event.originalPrice > event.price && (
                      <div className="text-sm text-gray-500 line-through">
                        ${event.originalPrice}
                      </div>
                    )}
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Book Now
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Events
          </Button>
        </div>
      </div>
    </div>
  )
}
