"use client"

import { useState } from "react"
import { useAppSelector } from "@/lib/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Clock, Download, Star, Settings, Ticket, Heart } from "lucide-react"
import { AuthGuard } from "@/components/auth/auth-guard"
import Link from "next/link"


// Mock data for user bookings and favorites
const mockBookings = [
  {
    id: "1",
    eventId: "1",
    eventTitle: "Summer Music Festival 2024",
    eventImage: "/placeholder.svg?height=100&width=150",
    venue: "Central Park",
    date: "2024-07-15",
    time: "18:00",
    seats: ["A12", "A13"],
    totalAmount: 150,
    status: "confirmed",
    bookingDate: "2024-06-01",
  },
  {
    id: "2",
    eventId: "2",
    eventTitle: "Broadway Show - Hamilton",
    eventImage: "/placeholder.svg?height=100&width=150",
    venue: "Richard Rodgers Theatre",
    date: "2024-08-20",
    time: "20:00",
    seats: ["Orchestra-15A", "Orchestra-15B"],
    totalAmount: 280,
    status: "confirmed",
    bookingDate: "2024-06-15",
  },
  {
    id: "3",
    eventId: "3",
    eventTitle: "Tech Conference 2024",
    eventImage: "/placeholder.svg?height=100&width=150",
    venue: "Convention Center",
    date: "2024-05-10",
    time: "09:00",
    seats: ["General-001"],
    totalAmount: 99,
    status: "completed",
    bookingDate: "2024-04-01",
  },
]

const mockFavorites = [
  {
    id: "4",
    title: "Jazz Night at Blue Note",
    image: "/placeholder.svg?height=200&width=300",
    venue: "Blue Note NYC",
    date: "2024-09-15",
    price: 45,
    category: "Music",
  },
  {
    id: "5",
    title: "Comedy Show - Stand Up Special",
    image: "/placeholder.svg?height=200&width=300",
    venue: "Comedy Cellar",
    date: "2024-08-30",
    price: 35,
    category: "Comedy",
  },
]

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("overview")

  const upcomingBookings = mockBookings.filter(
    (booking) => new Date(booking.date) > new Date() && booking.status === "confirmed",
  )
  const pastBookings = mockBookings.filter(
    (booking) => new Date(booking.date) <= new Date() || booking.status === "completed",
  )

  const handleSignOut = () => {
    // Clear any auth tokens or user info here if needed
    localStorage.clear()
    window.location.href = "/"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
     <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="text-lg font-semibold">{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.name || "User"}!
                </h1>
                <p className="text-gray-600 dark:text-gray-300">Manage your bookings and discover new events</p>
              </div>
              {/* Home and Sign Out Buttons */}
              <div className="flex gap-2">
                <Link href="/" className="inline-block">
                  <Button variant="outline">Home</Button>
                </Link>
                <Button variant="destructive" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
            <div className="flex justify-end mb-4">
              <Link href="/dashboard/organize">
                <Button className="gradient-primary text-white">
                  Organize Event
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                      <p className="text-2xl font-bold">{mockBookings.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                      <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
                      <p className="text-2xl font-bold">{mockFavorites.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Points</p>
                      <p className="text-2xl font-bold">1,250</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Upcoming Events */}
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>Your confirmed bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center gap-4 p-4 rounded-lg border bg-white/50 dark:bg-gray-700/50"
                        >
                          <img
                            src={booking.eventImage || "/placeholder.svg"}
                            alt={booking.eventTitle}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{booking.eventTitle}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {booking.venue}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {booking.date} at {booking.time}
                              </span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                      No upcoming events. Explore new events to book!
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Favorites */}
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Recent Favorites
                  </CardTitle>
                  <CardDescription>Events you've saved for later</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockFavorites.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-white/50 dark:bg-gray-700/50"
                      >
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{event.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4" />
                            {event.venue}
                          </div>
                          <p className="text-lg font-bold text-blue-600">${event.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <div className="grid gap-6">
                {/* Upcoming Bookings */}
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Upcoming Bookings</CardTitle>
                    <CardDescription>Your confirmed future events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingBookings.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-center justify-between p-4 rounded-lg border bg-white/50 dark:bg-gray-700/50"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={booking.eventImage || "/placeholder.svg"}
                                alt={booking.eventTitle}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div>
                                <h3 className="font-semibold text-lg">{booking.eventTitle}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {booking.venue}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {booking.date} at {booking.time}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline">Seats: {booking.seats.join(", ")}</Badge>
                                  <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">${booking.totalAmount}</p>
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 text-center py-8">No upcoming bookings</p>
                    )}
                  </CardContent>
                </Card>

                {/* Past Bookings */}
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Booking History</CardTitle>
                    <CardDescription>Your past events and completed bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pastBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-white/50 dark:bg-gray-700/50 opacity-75"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={booking.eventImage || "/placeholder.svg"}
                              alt={booking.eventTitle}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold">{booking.eventTitle}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {booking.venue}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {booking.date}
                                </span>
                              </div>
                              <Badge className={getStatusColor(booking.status)} variant="outline">
                                {booking.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${booking.totalAmount}</p>
                            <Button size="sm" variant="ghost">
                              View Receipt
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Favorite Events
                  </CardTitle>
                  <CardDescription>Events you've saved for later booking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockFavorites.map((event) => (
                      <div
                        key={event.id}
                        className="group relative overflow-hidden rounded-lg border bg-white/50 dark:bg-gray-700/50 hover:shadow-lg transition-all duration-300"
                      >
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <MapPin className="h-4 w-4" />
                            {event.venue}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <Calendar className="h-4 w-4" />
                            {event.date}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-blue-600">${event.price}</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Heart className="h-4 w-4 fill-current text-red-500" />
                              </Button>
                              <Button size="sm">Book Now</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6">
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user?.name || ""}
                          className="w-full mt-1 px-3 py-2 border rounded-md bg-white/50 dark:bg-gray-700/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <input
                          type="email"
                          defaultValue={user?.email || ""}
                          className="w-full mt-1 px-3 py-2 border rounded-md bg-white/50 dark:bg-gray-700/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full mt-1 px-3 py-2 border rounded-md bg-white/50 dark:bg-gray-700/50"
                      />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive booking confirmations and updates
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get text reminders for upcoming events
                        </p>
                      </div>
                      <input type="checkbox" className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive promotional offers and event recommendations
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}
