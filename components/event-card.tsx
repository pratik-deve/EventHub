"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, MapPin, Star, Users, Heart, Share2 } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  location: string
  price: number
  category: string
  rating: number
  attendees: number
  image: string
  featured: boolean
}

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const { toast } = useToast()

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited(!isFavorited)
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited
        ? `${event.title} has been removed from your favorites.`
        : `${event.title} has been added to your favorites.`,
    })
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: `/events/${event.id}`,
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/events/${event.id}`)
      toast({
        title: "Link copied!",
        description: "Event link has been copied to your clipboard.",
      })
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {event.featured && <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">Featured</Badge>}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-background/90 backdrop-blur-sm hover:bg-background"
            onClick={handleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-background/90 backdrop-blur-sm hover:bg-background"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Category Tag */}
        <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
          {event.category}
        </div>

        <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
          ${event.price}
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="w-4 h-4" />
          {new Date(event.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}{" "}
          • {event.time}
        </div>

        <h3 className="font-serif font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          {event.location}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{event.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{event.attendees}</span>
            </div>
          </div>

          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <Link href={`/events/${event.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}