"use client"

import { EventCard } from "./event-card"
import type { Event } from "@/lib/slices/eventSlice"

interface RelatedEventsProps {
  currentEventId: string
  category: string
}

// Mock related events
const mockRelatedEvents: Event[] = [
  {
    id: "2",
    title: "Jazz Night Under the Stars",
    description: "An intimate evening of smooth jazz in a beautiful outdoor setting",
    category: "music",
    date: "2024-08-20",
    time: "19:00",
    venue: {
      id: "v2",
      name: "Riverside Amphitheater",
      address: "200 River St",
      city: "New York",
      capacity: 2000,
    },
    price: { min: 45, max: 120 },
    image: "/placeholder.svg?height=400&width=600",
    organizer: { id: "o2", name: "Jazz Events NYC" },
    tags: ["jazz", "outdoor", "intimate"],
    status: "upcoming",
  },
  {
    id: "3",
    title: "Electronic Dance Festival",
    description: "The biggest EDM festival with world-renowned DJs",
    category: "music",
    date: "2024-09-15",
    time: "20:00",
    venue: {
      id: "v3",
      name: "Convention Center",
      address: "300 Convention Blvd",
      city: "New York",
      capacity: 15000,
    },
    price: { min: 75, max: 250 },
    image: "/placeholder.svg?height=400&width=600",
    organizer: { id: "o3", name: "EDM Productions" },
    tags: ["edm", "dance", "electronic"],
    status: "upcoming",
  },
]

export function RelatedEvents({ currentEventId, category }: RelatedEventsProps) {
  // Filter out current event and show related events
  const relatedEvents = mockRelatedEvents.filter((event) => event.id !== currentEventId && event.category === category)

  if (relatedEvents.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-display font-bold mb-6">You Might Also Like</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
