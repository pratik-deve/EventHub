"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { useWallet } from "@/contexts/wallet-context"
import { useBooking } from "@/contexts/booking-context"
import { useToast } from "@/hooks/use-toast"
import { Calendar, MapPin, Star, Users, Heart, Share2, Clock, Ticket, Info, Music, Car, Utensils, Wifi, ArrowLeft, Plus, Minus } from 'lucide-react'
import Link from "next/link"

const eventData = {
  id: "1",
  title: "Summer Music Festival 2024",
  images: [
    "/placeholder.svg?height=500&width=800",
    "/placeholder.svg?height=500&width=800",
    "/placeholder.svg?height=500&width=800",
    "/placeholder.svg?height=500&width=800"
  ],
  date: "July 15-17, 2024",
  time: "6:00 PM - 2:00 AM",
  location: "Central Park, New York",
  venue: "Great Lawn",
  price: 89,
  originalPrice: 120,
  category: "Music",
  rating: 4.8,
  reviewCount: 324,
  attendees: 2500,
  description: "Join us for the most spectacular summer music festival of 2024! Experience three days of incredible music, amazing food, and unforgettable memories. Featuring top artists from around the world across multiple stages.",
  longDescription: "The Summer Music Festival 2024 is a three-day celebration of music, culture, and community. Set in the heart of Central Park, this festival brings together music lovers from all walks of life to enjoy performances from world-renowned artists, emerging talents, and local favorites. With multiple stages, diverse food options, and interactive experiences, this festival promises to be an unforgettable experience for all attendees.",
  tags: ["Outdoor", "Multi-day", "Food & Drinks", "Camping", "All Ages"],
  organizer: {
    name: "MusicFest Productions",
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.9,
    eventsCount: 45
  },
  lineup: [
    { name: "The Electric Waves", time: "8:00 PM", stage: "Main Stage" },
    { name: "Luna & The Moonbeams", time: "9:30 PM", stage: "Acoustic Stage" },
    { name: "DJ Neon Nights", time: "11:00 PM", stage: "Electronic Stage" },
    { name: "Rock Legends", time: "12:30 AM", stage: "Main Stage" }
  ],
  amenities: [
    { icon: Music, name: "Multiple Stages" },
    { icon: Utensils, name: "Food & Beverages" },
    { icon: Car, name: "Parking Available" },
    { icon: Wifi, name: "Free WiFi" }
  ],
  ticketTypes: [
    {
      name: "General Admission",
      price: 89,
      originalPrice: 120,
      description: "Access to all stages and general festival areas",
      features: ["3-day access", "All stages", "Food court access"]
    },
    {
      name: "VIP Experience",
      price: 199,
      originalPrice: 250,
      description: "Premium experience with exclusive perks",
      features: ["3-day access", "VIP viewing areas", "Complimentary drinks", "Express entry"]
    },
    {
      name: "Backstage Pass",
      price: 399,
      originalPrice: 500,
      description: "Ultimate festival experience with artist meet & greets",
      features: ["All VIP features", "Backstage access", "Artist meet & greets", "Exclusive merchandise"]
    }
  ]
}

export default function EventDetailPage() {
  const { user } = useAuth()
  const { balance, deductFunds } = useWallet()
  const { bookEvent } = useBooking()
  const { toast } = useToast()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedTicket, setSelectedTicket] = useState(eventData.ticketTypes[0])
  const [quantity, setQuantity] = useState(1)
  const [showBookingModal, setShowBookingModal] = useState(false)

  const totalPrice = selectedTicket.price * quantity
  const serviceFee = Math.round(totalPrice * 0.1)
  const finalTotal = totalPrice + serviceFee

  const handleBooking = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book tickets.",
        variant: "destructive",
      })
      router.push('/auth/signin')
      return
    }

    if (balance < finalTotal) {
      toast({
        title: "Insufficient funds",
        description: "Please add funds to your wallet to complete this booking.",
        variant: "destructive",
      })
      router.push('/wallet')
      return
    }

    const success = deductFunds(finalTotal, `Ticket booking: ${eventData.title}`)
    if (success) {
      bookEvent(eventData, selectedTicket.name, quantity, finalTotal)
      setShowBookingModal(false)
      toast({
        title: "Booking confirmed!",
        description: "Your tickets have been booked successfully.",
      })
      router.push('/bookings')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Back Button */}
            <Link href="/events">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </Link>

            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={eventData.images[selectedImage] || "/placeholder.svg"}
                  alt={eventData.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-purple-600 hover:bg-purple-700">
                    {eventData.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button size="icon" variant="secondary" className="w-10 h-10 bg-white/90 hover:bg-white">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="w-10 h-10 bg-white/90 hover:bg-white">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 overflow-x-auto">
                {eventData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-purple-600" : "border-border"
                    }`}
                  >
                    <img src={image || "/placeholder.svg"} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Event Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{eventData.title}</h1>
                  {eventData.originalPrice > eventData.price && (
                    <Badge variant="destructive" className="bg-red-500">
                      {Math.round(((eventData.originalPrice - eventData.price) / eventData.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{eventData.rating}</span>
                    <span>({eventData.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{eventData.attendees.toLocaleString()} attending</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium">{eventData.date}</div>
                      <div className="text-sm text-muted-foreground">{eventData.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium">{eventData.venue}</div>
                      <div className="text-sm text-muted-foreground">{eventData.location}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {eventData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {eventData.description}
                </p>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="lineup">Lineup</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">About This Event</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {eventData.longDescription}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Organizer</h3>
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={eventData.organizer.image || "/placeholder.svg"} />
                        <AvatarFallback>MP</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{eventData.organizer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {eventData.organizer.eventsCount} events • {eventData.organizer.rating}★ rating
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Follow
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="lineup" className="space-y-4">
                  <h3 className="text-xl font-semibold">Artist Lineup</h3>
                  <div className="space-y-3">
                    {eventData.lineup.map((artist, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium">{artist.name}</div>
                          <div className="text-sm text-muted-foreground">{artist.stage}</div>
                        </div>
                        <div className="text-sm font-medium text-purple-600">
                          {artist.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="amenities" className="space-y-4">
                  <h3 className="text-xl font-semibold">Amenities & Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {eventData.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                        <amenity.icon className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-4">
                  <h3 className="text-xl font-semibold">Reviews</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>U{review}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">User {review}</div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">2 days ago</div>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Amazing event! Great organization and fantastic lineup. Would definitely attend again.
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Book Tickets</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      ${eventData.price}
                    </div>
                    {eventData.originalPrice > eventData.price && (
                      <div className="text-sm text-muted-foreground line-through">
                        ${eventData.originalPrice}
                      </div>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ticket Type</label>
                  <Select 
                    value={selectedTicket.name} 
                    onValueChange={(value) => {
                      const ticket = eventData.ticketTypes.find(t => t.name === value)
                      if (ticket) setSelectedTicket(ticket)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventData.ticketTypes.map((ticket) => (
                        <SelectItem key={ticket.name} value={ticket.name}>
                          <div className="flex items-center justify-between w-full">
                            <span>{ticket.name}</span>
                            <span className="ml-2 font-medium">${ticket.price}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium mb-1">{selectedTicket.description}</div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {selectedTicket.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span>Subtotal ({quantity} ticket{quantity > 1 ? 's' : ''})</span>
                    <span className="font-medium">${totalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Service Fee</span>
                    <span className="font-medium">${serviceFee}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>${finalTotal}</span>
                  </div>
                </div>

                {user && (
                  <div className="text-sm text-muted-foreground">
                    Wallet Balance: ${balance.toFixed(2)}
                  </div>
                )}

                <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Book Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Complete Your Booking</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="font-medium">{eventData.title}</div>
                        <div className="text-sm text-muted-foreground">{eventData.date}</div>
                        <div className="text-sm text-muted-foreground">{selectedTicket.name} × {quantity}</div>
                        <div className="font-bold text-lg text-purple-600 mt-2">
                          Total: ${finalTotal}
                        </div>
                      </div>
                      
                      {user && balance < finalTotal && (
                        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                          <p className="text-sm text-red-800 dark:text-red-200">
                            Insufficient wallet balance. Please add funds to continue.
                          </p>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={handleBooking}
                      >
                        {user ? 'Confirm Booking' : 'Sign In to Book'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Info className="w-4 h-4" />
                    <span>Free cancellation up to 24 hours before</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
