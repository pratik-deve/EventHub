"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { OrganizerProtectedRoute } from "@/components/organizer-protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  MapPin,
  Clock,
  Ticket,
  BarChart3,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Mock organizer data
const mockOrganizerData = {
  stats: {
    totalEvents: 12,
    totalAttendees: 1847,
    totalRevenue: 23450,
    upcomingEvents: 5,
  },
  recentEvents: [
    {
      id: "org-1",
      title: "Summer Music Festival 2024",
      date: "2024-07-15",
      time: "18:00",
      venue: "Central Park Amphitheater",
      location: "New York, NY",
      status: "published",
      attendees: 450,
      capacity: 500,
      revenue: 8250,
      ticketsSold: 450,
    },
    {
      id: "org-2",
      title: "Tech Innovation Conference",
      date: "2024-08-22",
      time: "09:00",
      venue: "Convention Center",
      location: "San Francisco, CA",
      status: "published",
      attendees: 280,
      capacity: 300,
      revenue: 12600,
      ticketsSold: 280,
    },
    {
      id: "org-3",
      title: "Food & Wine Tasting",
      date: "2024-09-10",
      time: "19:30",
      venue: "Grand Hotel Ballroom",
      location: "Chicago, IL",
      status: "draft",
      attendees: 0,
      capacity: 150,
      revenue: 0,
      ticketsSold: 0,
    },
  ],
  analytics: {
    monthlyRevenue: [
      { month: "Jan", revenue: 2400 },
      { month: "Feb", revenue: 1800 },
      { month: "Mar", revenue: 3200 },
      { month: "Apr", revenue: 2800 },
      { month: "May", revenue: 4100 },
      { month: "Jun", revenue: 3600 },
    ],
    topEvents: [
      { name: "Tech Conference", attendees: 280, revenue: 12600 },
      { name: "Music Festival", attendees: 450, revenue: 8250 },
      { name: "Wine Tasting", attendees: 120, revenue: 2400 },
    ],
  },
}

export default function OrganizerDashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <OrganizerProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">Organizer Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Welcome back, {user?.name?.split(" ")[0]}! Manage your events and track performance.
              </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-primary to-secondary">
              <Link href="/organizer/events/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                    <p className="text-2xl font-bold">{mockOrganizerData.stats.totalEvents}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Attendees</p>
                    <p className="text-2xl font-bold">{mockOrganizerData.stats.totalAttendees.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">${mockOrganizerData.stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                    <p className="text-2xl font-bold">{mockOrganizerData.stats.upcomingEvents}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">My Events</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Events</CardTitle>
                    <CardDescription>Your latest event activity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockOrganizerData.recentEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{event.title}</h4>
                            <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event.attendees}/{event.capacity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${event.revenue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{event.ticketsSold} tickets</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common organizer tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                      <Link href="/organizer/events/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Event
                      </Link>
                    </Button>
                    <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                      <Link href="/organizer/events">
                        <Calendar className="w-4 h-4 mr-2" />
                        Manage Events
                      </Link>
                    </Button>
                    <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                      <Link href="/organizer/analytics">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analytics
                      </Link>
                    </Button>
                    <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                      <Link href="/profile">
                        <Users className="w-4 h-4 mr-2" />
                        Account Settings
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-semibold">My Events</h2>
                <Button asChild>
                  <Link href="/organizer/events/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {mockOrganizerData.recentEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-serif font-semibold">{event.title}</h3>
                            <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {event.attendees}/{event.capacity} attendees
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <span className="text-sm text-muted-foreground">Revenue</span>
                                <p className="font-semibold text-lg">${event.revenue.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Tickets Sold</span>
                                <p className="font-semibold text-lg">{event.ticketsSold}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/events/${event.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/organizer/events/${event.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Ticket className="w-4 h-4 mr-2" />
                                Manage Tickets
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className="w-4 h-4 mr-2" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Cancel Event</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Revenue</CardTitle>
                    <CardDescription>Revenue trends over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockOrganizerData.analytics.monthlyRevenue.map((data, index) => (
                        <div key={data.month} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{data.month}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                style={{
                                  width: `${(data.revenue / Math.max(...mockOrganizerData.analytics.monthlyRevenue.map((d) => d.revenue))) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold w-16 text-right">
                              ${data.revenue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Events</CardTitle>
                    <CardDescription>Your most successful events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockOrganizerData.analytics.topEvents.map((event, index) => (
                        <div key={event.name} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{event.name}</p>
                            <p className="text-sm text-muted-foreground">{event.attendees} attendees</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${event.revenue.toLocaleString()}</p>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-primary rounded-full" />
                              <span className="text-xs text-muted-foreground">#{index + 1}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </OrganizerProtectedRoute>
  )
}
