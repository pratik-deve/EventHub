"use client"

import { useState } from "react"
import { Star, ThumbsUp, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"

interface Review {
  id: string
  user: {
    name: string
    avatar?: string
    verified: boolean
  }
  rating: number
  date: string
  title: string
  content: string
  helpful: number
  replies: number
}

interface EventReviewsProps {
  eventId: string
}

const mockReviews: Review[] = [
  {
    id: "r1",
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    rating: 5,
    date: "2024-06-01",
    title: "Amazing experience!",
    content:
      "This was absolutely incredible! The lineup was fantastic, the venue was perfect, and the organization was top-notch. Can't wait for next year!",
    helpful: 24,
    replies: 3,
  },
  {
    id: "r2",
    user: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
    rating: 4,
    date: "2024-05-28",
    title: "Great festival, minor issues",
    content:
      "Overall a great experience. The music was fantastic and the atmosphere was electric. Only complaint was the long lines for food, but that's expected at large events.",
    helpful: 18,
    replies: 1,
  },
  {
    id: "r3",
    user: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    rating: 5,
    date: "2024-05-25",
    title: "Best festival I've been to",
    content:
      "The sound quality was exceptional, the artists were incredible, and the venue was beautiful. Highly recommend to anyone who loves music festivals!",
    helpful: 31,
    replies: 5,
  },
]

export function EventReviews({ eventId }: EventReviewsProps) {
  const [reviews] = useState<Review[]>(mockReviews)

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
  }))

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <GlassCard>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-2">{renderStars(Math.round(averageRating))}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Based on {reviews.length} reviews</div>
          </div>

          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <GlassCard key={review.id}>
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">{review.user.name}</span>
                  {review.user.verified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                </div>

                <h4 className="font-semibold mb-2">{review.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{review.content}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-primary">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-primary">
                    <MessageCircle className="h-4 w-4" />
                    <span>Reply ({review.replies})</span>
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Reviews</Button>
      </div>
    </div>
  )
}
