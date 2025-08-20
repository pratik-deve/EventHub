"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users } from "lucide-react"

interface SeatSection {
  id: string
  name: string
  price: number
  available: number
  total: number
  color: string
}

interface SeatSelectionProps {
  sections: SeatSection[]
  onSectionSelect: (sectionId: string) => void
  selectedSection: string | null
}

export function SeatSelection({ sections, onSectionSelect, selectedSection }: SeatSelectionProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Select Your Seats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stage Indicator */}
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg py-3 px-6 mb-2">
            <span className="text-sm font-medium">🎭 STAGE</span>
          </div>
          <p className="text-xs text-muted-foreground">Not to scale</p>
        </div>

        {/* Seat Sections */}
        <div className="space-y-3">
          {sections.map((section) => {
            const isSelected = selectedSection === section.id
            const isHovered = hoveredSection === section.id
            const availabilityPercentage = (section.available / section.total) * 100

            return (
              <div
                key={section.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : isHovered
                      ? "border-primary/50 bg-primary/2"
                      : "border-border hover:border-primary/30"
                }`}
                onClick={() => onSectionSelect(section.id)}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded ${section.color} ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}`}
                    />
                    <div>
                      <span className="font-medium text-base">{section.name}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-primary ml-2 inline" />}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">${section.price}</div>
                    <div className="text-xs text-muted-foreground">per ticket</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {section.available} of {section.total} available
                    </span>
                    <Badge
                      variant={
                        availabilityPercentage > 50
                          ? "default"
                          : availabilityPercentage > 20
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {availabilityPercentage > 50
                        ? "Good availability"
                        : availabilityPercentage > 20
                          ? "Limited seats"
                          : "Almost sold out"}
                    </Badge>
                  </div>

                  {/* Availability Bar */}
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        availabilityPercentage > 50
                          ? "bg-green-500"
                          : availabilityPercentage > 20
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${availabilityPercentage}%` }}
                    />
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-primary/20">
                    <p className="text-sm text-primary font-medium">✓ Selected - Choose quantity on the right</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Seat availability:</p>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Good</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>Limited</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span>Almost sold out</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
