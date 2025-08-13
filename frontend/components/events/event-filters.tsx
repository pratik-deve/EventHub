"use client"

import { useState } from "react"
import { Calendar, MapPin, DollarSign, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setFilters } from "@/lib/slices/eventSlice"

interface EventFiltersProps {
  onClearFilters: () => void
}

export function EventFilters({ onClearFilters }: EventFiltersProps) {
  const dispatch = useAppDispatch()
  const { filters } = useAppSelector((state) => state.events)

  const [priceRange, setPriceRange] = useState([0, 1000])
  const [location, setLocation] = useState(filters.location || "")
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  })

  const categories = [
    { id: "music", name: "Music", count: 234 },
    { id: "movies", name: "Movies", count: 156 },
    { id: "sports", name: "Sports", count: 89 },
    { id: "theater", name: "Theater", count: 67 },
    { id: "comedy", name: "Comedy", count: 45 },
    { id: "other", name: "Other", count: 123 },
  ]

  const cities = ["New York", "Los Angeles", "Chicago", "San Francisco", "Austin", "Miami", "Seattle", "Boston"]

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      dispatch(setFilters({ category: categoryId }))
    } else {
      dispatch(setFilters({ category: "" }))
    }
  }

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation)
    dispatch(setFilters({ location: newLocation }))
  }

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values)
    dispatch(
      setFilters({
        priceRange: { min: values[0], max: values[1] },
      }),
    )
  }

  const handleDateRangeChange = (field: "start" | "end", value: string) => {
    const newDateRange = { ...dateRange, [field]: value }
    setDateRange(newDateRange)

    if (newDateRange.start && newDateRange.end) {
      dispatch(
        setFilters({
          dateRange: { start: newDateRange.start, end: newDateRange.end },
        }),
      )
    }
  }

  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    if (key === "search") return false // Don't show search as a filter badge
    return value && (typeof value === "string" ? value.length > 0 : true)
  })

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(([key, value]) => (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {key === "category" && value}
                {key === "location" && `📍 ${value}`}
                {key === "priceRange" && `💰 $${(value as any).min}-$${(value as any).max}`}
                {key === "dateRange" && `📅 ${(value as any).start} to ${(value as any).end}`}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    dispatch(setFilters({ [key]: key === "priceRange" || key === "dateRange" ? null : "" }))
                  }
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Categories */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Category</Label>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={filters.category === category.id}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                  />
                  <Label htmlFor={category.id} className="text-sm cursor-pointer">
                    {category.name}
                  </Label>
                </div>
                <span className="text-xs text-gray-500">{category.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <Label className="text-sm font-medium mb-3 block flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Location
          </Label>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter city or venue"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full"
            />
            <div className="flex flex-wrap gap-1">
              {cities.map((city) => (
                <Button
                  key={city}
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => handleLocationChange(city)}
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            Price Range
          </Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              max={1000}
              min={0}
              step={10}
              className="mb-4"
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}+</span>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Date Range
          </Label>
          <div className="space-y-2">
            <div>
              <Label htmlFor="start-date" className="text-xs text-gray-600 dark:text-gray-300">
                From
              </Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.start}
                onChange={(e) => handleDateRangeChange("start", e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="end-date" className="text-xs text-gray-600 dark:text-gray-300">
                To
              </Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateRangeChange("end", e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Quick Filters</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateRangeChange("start", new Date().toISOString().split("T")[0])}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                handleDateRangeChange("start", tomorrow.toISOString().split("T")[0])
              }}
            >
              Tomorrow
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const weekend = new Date()
                const daysUntilSaturday = 6 - weekend.getDay()
                weekend.setDate(weekend.getDate() + daysUntilSaturday)
                handleDateRangeChange("start", weekend.toISOString().split("T")[0])
              }}
            >
              This Weekend
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
