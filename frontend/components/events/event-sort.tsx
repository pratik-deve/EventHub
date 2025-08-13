"use client"

import { ArrowUpDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EventSort() {
  const sortOptions = [
    { value: "date-asc", label: "Date (Earliest)" },
    { value: "date-desc", label: "Date (Latest)" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "price-desc", label: "Price (High to Low)" },
    { value: "popularity", label: "Most Popular" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
  ]

  return (
    <Select defaultValue="date-asc">
      <SelectTrigger className="w-48">
        <ArrowUpDown className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
