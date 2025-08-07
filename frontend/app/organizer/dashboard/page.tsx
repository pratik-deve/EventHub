"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { Calendar, Users, DollarSign, TrendingUp, Plus, Eye, Edit, Trash2, BarChart3, Star, Award, Zap } from 'lucide-react'

// Mock data for organizer events
const organizerEvents = [
  {
    id: "org-1",
    title: "Summer Music Festival 2024",
    status: "published",
    date: "2024-07-15",
    ticketsSold: 1250,
    totalTickets: 2500,
    revenue: 125000,
    views: 15420,
    rating: 4.8
  },
  {
    id: "org-2", 
    title: "Tech Innovation Summit",
    status: "published",
    date: "2024-08-22",
    ticketsSold: 890,
    totalTickets: 1200,
    revenue: 267000,
    views: 8930,
    rating: 4.9
  },
  {
    id: "org-3",
    title: "Food & Wine Experience",
    status: "draft",
    date: "2024-09-10",
    ticketsSold: 0,
    totalTickets: 500,
    revenue: 0,
    views: 0,
    rating: 0
  }
]

export default function OrganizerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }
    if (!user.isOrganizer) {
      router.push('/')
      return
    }
  }, [user, router])

  if (!user || !user.isOrganizer) {
    return null
  }

  const totalRevenue = organizerEvents.reduce((sum, event) => sum + event.revenue, 0)
  const totalTicketsSold = organizerEvents.reduce((sum, event) => sum + event.ticketsSold, 0)
  const totalViews = organizerEvents.reduce((sum, event) => sum + event.views, 0)
  const avgRating = organizerEvents.filter(e => e.rating > 0).reduce((sum, event) => sum + event.rating, 0) / organizerEvents.filter(e => e.rating > 0).length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Organizer Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user.organizerProfile?.companyName || user.name}! 🎉
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/organizer/analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Link>
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" asChild>
                <Link href="/organizer/create-event">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-bl-full opacity-10"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-bl-full opacity-10"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {totalTicketsSold.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-blue-600">+8.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-bl-full opacity-10"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {totalViews.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-purple-600">+15.3%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-bl-full opacity-10"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {avgRating.toFixed(1)}★
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-yellow-600">+0.2</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Achievement Badges */}
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1">
                  <Zap className="w-3 h-3 mr-1" />
                  Rising Star
                </Badge>
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Revenue Milestone
                </Badge>
                <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1">
                  <Users className="w-3 h-3 mr-1" />
                  Crowd Favorite
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Events Management */}
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="events">My Events</TabsTrigger>
              <TabsTrigger value="analytics">Quick Analytics</TabsTrigger>
              <TabsTrigger value="profile">Organizer Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="events" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Event Management</h3>
                <Button size="sm" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </div>
              
              <div className="grid gap-4">
                {organizerEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-semibold group-hover:text-purple-600 transition-colors">
                            {event.title}
                          </h4>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Date</div>
                          <div className="font-medium">{new Date(event.date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Tickets Sold</div>
                          <div className="font-medium">
                            {event.ticketsSold}/{event.totalTickets}
                            <span className="text-xs text-green-600 ml-1">
                              ({Math.round((event.ticketsSold / event.totalTickets) * 100)}%)
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Revenue</div>
                          <div className="font-medium text-green-600">${event.revenue.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Views</div>
                          <div className="font-medium">{event.views.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      {event.status === 'published' && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Monthly revenue over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      📈 Revenue chart would go here
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Sales</CardTitle>
                    <CardDescription>Tickets sold by event</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      📊 Sales chart would go here
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Organizer Profile</CardTitle>
                  <CardDescription>Manage your organizer information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Company Name</label>
                      <div className="text-lg">{user.organizerProfile?.companyName}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Verification Status</label>
                      <div className="flex items-center gap-2">
                        {user.organizerProfile?.verified ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            ✓ Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pending Verification</Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Events Created</label>
                      <div className="text-lg font-semibold text-purple-600">
                        {user.organizerProfile?.eventsCreated || 0}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Average Rating</label>
                      <div className="text-lg font-semibold text-yellow-600">
                        {user.organizerProfile?.rating || 0}★
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-muted-foreground mt-1">
                      {user.organizerProfile?.description}
                    </p>
                  </div>
                  
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
