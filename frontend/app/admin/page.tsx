"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, Calendar, DollarSign, TrendingUp, Plus, Edit, Trash2, Download, Search, Filter } from "lucide-react"
import { AuthGuard } from "@/components/auth/auth-guard"

// Mock analytics data
const revenueData = [
  { month: "Jan", revenue: 12000, bookings: 150 },
  { month: "Feb", revenue: 15000, bookings: 180 },
  { month: "Mar", revenue: 18000, bookings: 220 },
  { month: "Apr", revenue: 22000, bookings: 280 },
  { month: "May", revenue: 25000, bookings: 320 },
  { month: "Jun", revenue: 28000, bookings: 350 },
]

const categoryData = [
  { name: "Music", value: 45, color: "#8884d8" },
  { name: "Sports", value: 25, color: "#82ca9d" },
  { name: "Theater", value: 20, color: "#ffc658" },
  { name: "Comedy", value: 10, color: "#ff7300" },
]

const mockEvents = [
  {
    id: "1",
    title: "Summer Music Festival 2024",
    category: "Music",
    venue: "Central Park",
    date: "2024-07-15",
    price: 75,
    capacity: 5000,
    sold: 3200,
    status: "active",
  },
  {
    id: "2",
    title: "Broadway Show - Hamilton",
    category: "Theater",
    venue: "Richard Rodgers Theatre",
    date: "2024-08-20",
    price: 140,
    capacity: 1319,
    sold: 1200,
    status: "active",
  },
  {
    id: "3",
    title: "Tech Conference 2024",
    category: "Conference",
    venue: "Convention Center",
    date: "2024-05-10",
    price: 99,
    capacity: 2000,
    sold: 2000,
    status: "completed",
  },
]

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    joinDate: "2024-01-15",
    totalBookings: 5,
    totalSpent: 450,
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    joinDate: "2024-02-20",
    totalBookings: 3,
    totalSpent: 280,
    status: "active",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    joinDate: "2024-03-10",
    totalBookings: 8,
    totalSpent: 720,
    status: "active",
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalBookings = revenueData.reduce((sum, item) => sum + item.bookings, 0)
  const totalUsers = mockUsers.length
  const activeEvents = mockEvents.filter((event) => event.status === "active").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage events, users, and view analytics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +12% from last month
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                    <p className="text-3xl font-bold text-blue-600">{totalBookings.toLocaleString()}</p>
                    <p className="text-sm text-blue-600 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +8% from last month
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                    <p className="text-3xl font-bold text-purple-600">{totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-purple-600 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +15% from last month
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Events</p>
                    <p className="text-3xl font-bold text-orange-600">{activeEvents}</p>
                    <p className="text-sm text-orange-600 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +3 new this week
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue and booking trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Event Categories</CardTitle>
                    <CardDescription>Distribution of events by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest bookings and user activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">New booking for Summer Music Festival</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">John Doe - 2 tickets - $150</p>
                      </div>
                      <span className="text-sm text-gray-500">2 min ago</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">New user registration</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sarah Wilson joined the platform</p>
                      </div>
                      <span className="text-sm text-gray-500">5 min ago</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Event capacity reached</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Tech Conference 2024 is now sold out</p>
                      </div>
                      <span className="text-sm text-gray-500">1 hour ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Event Management</CardTitle>
                      <CardDescription>Create, edit, and manage events</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {mockEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-white/50 dark:bg-gray-700/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>Category: {event.category}</span>
                            <span>Venue: {event.venue}</span>
                            <span>Date: {event.date}</span>
                            <span>Price: ${event.price}</span>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center gap-4">
                              <span className="text-sm">
                                Sold: {event.sold}/{event.capacity} ({Math.round((event.sold / event.capacity) * 100)}%)
                              </span>
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-xs">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(event.sold / event.capacity) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage singuped users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-white/50 dark:bg-gray-700/50"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Joined: {user.joinDate}</span>
                            <span>Bookings: {user.totalBookings}</span>
                            <span>Total Spent: ${user.totalSpent}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Booking Management</CardTitle>
                  <CardDescription>View and manage all bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Booking management interface would be implemented here</p>
                    <p className="text-sm">Features: booking details, refunds, modifications, reports</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Monthly Bookings</CardTitle>
                    <CardDescription>Booking trends over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="bookings" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Revenue Analytics</CardTitle>
                    <CardDescription>Revenue growth and projections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
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
