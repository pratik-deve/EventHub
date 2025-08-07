"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Search, Calendar, MapPin, Star, Users, Filter, Heart, Share2, Ticket } from 'lucide-react'
import Link from "next/link"

const featuredEvents = [
  {
    id: "1",
    title: "Summer Music Festival 2024",
    image: "/placeholder.svg?height=400&width=600",
    date: "July 15-17, 2024",
    location: "Central Park, New York",
    price: 89,
    category: "Music",
    rating: 4.8,
    attendees: 2500,
    description: "The biggest summer music festival featuring top artists from around the world"
  },
  {
    id: "2",
    title: "Tech Innovation Summit",
    image: "/placeholder.svg?height=400&width=600",
    date: "August 22, 2024",
    location: "Convention Center, San Francisco",
    price: 299,
    category: "Conference",
    rating: 4.9,
    attendees: 1200,
    description: "Leading tech innovators share insights on the future of technology"
  },
  {
    id: "3",
    title: "Broadway Musical Night",
    image: "/placeholder.svg?height=400&width=600",
    date: "September 5, 2024",
    location: "Broadway Theater, NYC",
    price: 125,
    category: "Theater",
    rating: 4.7,
    attendees: 800,
    description: "An enchanting evening of Broadway's greatest hits performed live"
  }
]

const categories = ["All", "Music", "Theater", "Conference", "Sports", "Comedy", "Art"]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 dark:from-purple-950 dark:via-purple-900 dark:to-pink-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Events & Shows
              </span>
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              Book tickets for concerts, theater shows, conferences, and more. 
              Your next unforgettable experience is just a click away.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-background rounded-full p-2 shadow-2xl">
              <div className="flex items-center">
                <div className="flex-1 flex items-center px-4">
                  <Search className="w-5 h-5 text-muted-foreground mr-3" />
                  <Input
                    placeholder="Search events, artists, venues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 focus-visible:ring-0 placeholder:text-muted-foreground"
                  />
                </div>
                <Button className="rounded-full px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
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
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't miss out on these incredible events happening near you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendees.toLocaleString()} attending
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {event.rating}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-6 pt-0 flex items-center justify-between">
                  <div className="text-2xl font-bold text-purple-600">
                    ${event.price}
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" asChild>
                    <Link href={`/event/${event.id}`}>Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-purple-100">Events Hosted</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2M+</div>
              <div className="text-purple-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-purple-100">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9★</div>
              <div className="text-purple-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EventHub</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your premier destination for discovering and booking amazing events and shows.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/events" className="hover:text-foreground transition-colors">Browse Events</Link></li>
                <li><Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link></li>
                <li><Link href="/venues" className="hover:text-foreground transition-colors">Venues</Link></li>
                <li><Link href="/organizers" className="hover:text-foreground transition-colors">For Organizers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="/refunds" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Stay Updated</h4>
              <p className="text-muted-foreground text-sm mb-4">
                Get notified about new events and exclusive offers.
              </p>
              <div className="flex">
                <Input 
                  placeholder="Enter your email" 
                  className="rounded-r-none"
                />
                <Button className="rounded-l-none bg-purple-600 hover:bg-purple-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 EventHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
