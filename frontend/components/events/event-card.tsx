import Link from "next/link"
import { Calendar, MapPin, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"
import type { Event } from "@/lib/slices/eventSlice"

interface EventCardProps {
  event: Event
  variant?: "default" | "compact"
}

export function EventCard({ event, variant = "default" }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatPrice = (min: number, max: number) => {
    if (min === max) return `$${min}`
    return `$${min} - $${max}`
  }

  if (variant === "compact") {
    return (
      <GlassCard hover className="p-4">
        <div className="flex space-x-4">
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg truncate pr-2">{event.title}</h3>
              <Badge variant="secondary" className="flex-shrink-0">
                {event.category}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(event.date)} at {event.time}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {event.venue.name}, {event.venue.city}
            </div>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-primary">{formatPrice(event.price.min, event.price.max)}</div>
              <Button size="sm" asChild className="gradient-primary text-white">
                <Link href={`/events/${event.id}`}>Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard hover className="overflow-hidden">
      <div className="relative">
        <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-48 object-cover" />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-900">
            {event.category}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs font-medium text-gray-900">4.8</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-display font-semibold text-xl mb-2 line-clamp-2">{event.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(event.date)} at {event.time}
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4 mr-2" />
            {event.venue.name}, {event.venue.city}
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4 mr-2" />
            {event.venue.capacity.toLocaleString()} capacity
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">{formatPrice(event.price.min, event.price.max)}</div>
            <div className="text-xs text-gray-500">per ticket</div>
          </div>
          <Button asChild className="gradient-primary text-white">
            <Link href={`/events/${event.id}`}>Book Now</Link>
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
