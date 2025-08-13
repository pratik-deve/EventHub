"use client"

import { MapPin, Navigation, Car, Train } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Venue {
  id: string
  name: string
  address: string
  city: string
  capacity: number
}

interface VenueMapProps {
  venue: Venue
}

export function VenueMap({ venue }: VenueMapProps) {
  const handleGetDirections = () => {
    const address = encodeURIComponent(`${venue.address}, ${venue.city}`)
    window.open(`https://maps.google.com/maps?q=${address}`, "_blank")
  }

  return (
    <div className="space-y-4">
      {/* Map Placeholder */}
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900"></div>
        <div className="relative z-10 text-center">
          <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
          <div className="font-semibold">{venue.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{venue.address}</div>
        </div>
        {/* Mock map elements */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-6 right-6 w-1 h-1 bg-blue-500 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-green-500 rounded-full"></div>
      </div>

      {/* Transportation Options */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="sm" className="flex items-center justify-center bg-transparent">
          <Car className="h-4 w-4 mr-2" />
          Parking
        </Button>
        <Button variant="outline" size="sm" className="flex items-center justify-center bg-transparent">
          <Train className="h-4 w-4 mr-2" />
          Transit
        </Button>
      </div>

      <Button onClick={handleGetDirections} className="w-full bg-transparent" variant="outline">
        <Navigation className="h-4 w-4 mr-2" />
        Get Directions
      </Button>
    </div>
  )
}
