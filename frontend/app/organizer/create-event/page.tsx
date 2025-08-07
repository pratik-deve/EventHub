"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Calendar, MapPin, Clock, Ticket, Image, Tag, Plus, X, Save, Eye, Sparkles, Zap, Star } from 'lucide-react'

const categories = [
  "Music", "Theater", "Conference", "Sports", "Comedy", "Art", "Food", "Technology", "Business", "Health"
]

const amenityOptions = [
  "Parking", "Food & Beverages", "WiFi", "Air Conditioning", "Wheelchair Accessible", 
  "Photography", "Live Streaming", "Security", "Coat Check", "VIP Area"
]

export default function CreateEventPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    longDescription: "",
    category: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    venue: "",
    images: [] as string[],
    tags: [] as string[],
    amenities: [] as string[],
    ticketTypes: [
      {
        name: "General Admission",
        price: 0,
        description: "",
        features: [] as string[],
        quantity: 100
      }
    ]
  })

  const [newTag, setNewTag] = useState("")
  const [newFeature, setNewFeature] = useState("")

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

  const addTag = () => {
    if (newTag.trim() && !eventData.tags.includes(newTag.trim())) {
      setEventData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEventData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addTicketType = () => {
    setEventData(prev => ({
      ...prev,
      ticketTypes: [
        ...prev.ticketTypes,
        {
          name: "",
          price: 0,
          description: "",
          features: [],
          quantity: 100
        }
      ]
    }))
  }

  const removeTicketType = (index: number) => {
    if (eventData.ticketTypes.length > 1) {
      setEventData(prev => ({
        ...prev,
        ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
      }))
    }
  }

  const addFeatureToTicket = (ticketIndex: number) => {
    if (newFeature.trim()) {
      setEventData(prev => ({
        ...prev,
        ticketTypes: prev.ticketTypes.map((ticket, i) => 
          i === ticketIndex 
            ? { ...ticket, features: [...ticket.features, newFeature.trim()] }
            : ticket
        )
      }))
      setNewFeature("")
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast({
      title: "🎉 Event Created Successfully!",
      description: "Your event has been created and is now live. Start promoting it!",
    })
    
    setIsSubmitting(false)
    router.push('/organizer/dashboard')
  }

  const steps = [
    { title: "Basic Info", icon: Sparkles },
    { title: "Details", icon: Star },
    { title: "Tickets", icon: Ticket },
    { title: "Review", icon: Eye }
  ]

  if (!user || !user.isOrganizer) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create Amazing Event ✨
            </h1>
            <p className="text-muted-foreground text-lg">
              Bring your vision to life and create unforgettable experiences
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-600 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    index <= currentStep ? 'text-purple-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-purple-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
            <CardContent className="p-8">
              {/* Step 0: Basic Info */}
              {currentStep === 0 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                  <div className="text-center mb-6">
                    <Sparkles className="w-12 h-12 mx-auto text-purple-600 mb-2" />
                    <h2 className="text-2xl font-bold">Let's Start with the Basics</h2>
                    <p className="text-muted-foreground">Tell us about your amazing event</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Summer Music Festival 2024"
                        value={eventData.title}
                        onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={eventData.category} onValueChange={(value) => setEventData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of your event (max 200 characters)"
                      value={eventData.description}
                      onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                      maxLength={200}
                      rows={3}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {eventData.description.length}/200 characters
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Event Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={eventData.date}
                        onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Start Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={eventData.time}
                        onChange={(e) => setEventData(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={eventData.endTime}
                        onChange={(e) => setEventData(prev => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue Name *</Label>
                      <Input
                        id="venue"
                        placeholder="e.g., Madison Square Garden"
                        value={eventData.venue}
                        onChange={(e) => setEventData(prev => ({ ...prev, venue: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., New York, NY"
                        value={eventData.location}
                        onChange={(e) => setEventData(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Details */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                  <div className="text-center mb-6">
                    <Star className="w-12 h-12 mx-auto text-purple-600 mb-2" />
                    <h2 className="text-2xl font-bold">Add the Magic Details</h2>
                    <p className="text-muted-foreground">Make your event irresistible</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longDescription">Detailed Description</Label>
                    <Textarea
                      id="longDescription"
                      placeholder="Tell the full story of your event. What makes it special? What can attendees expect?"
                      value={eventData.longDescription}
                      onChange={(e) => setEventData(prev => ({ ...prev, longDescription: e.target.value }))}
                      rows={6}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Event Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {eventData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag (e.g., outdoor, family-friendly)"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button onClick={addTag} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Amenities & Features</Label>
                    <div className="grid md:grid-cols-2 gap-2">
                      {amenityOptions.map((amenity) => (
                        <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={eventData.amenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEventData(prev => ({
                                  ...prev,
                                  amenities: [...prev.amenities, amenity]
                                }))
                              } else {
                                setEventData(prev => ({
                                  ...prev,
                                  amenities: prev.amenities.filter(a => a !== amenity)
                                }))
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Event Images</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Upload event images</p>
                      <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
                      <Button variant="outline" className="mt-4">
                        Choose Files
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Tickets */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                  <div className="text-center mb-6">
                    <Ticket className="w-12 h-12 mx-auto text-purple-600 mb-2" />
                    <h2 className="text-2xl font-bold">Set Up Your Tickets</h2>
                    <p className="text-muted-foreground">Create different ticket types for your audience</p>
                  </div>

                  <div className="space-y-6">
                    {eventData.ticketTypes.map((ticket, index) => (
                      <Card key={index} className="border-2 border-purple-200 dark:border-purple-800">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Ticket Type {index + 1}</CardTitle>
                            {eventData.ticketTypes.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeTicketType(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Ticket Name *</Label>
                              <Input
                                placeholder="e.g., VIP Experience"
                                value={ticket.name}
                                onChange={(e) => {
                                  const newTickets = [...eventData.ticketTypes]
                                  newTickets[index].name = e.target.value
                                  setEventData(prev => ({ ...prev, ticketTypes: newTickets }))
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Price ($) *</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={ticket.price}
                                onChange={(e) => {
                                  const newTickets = [...eventData.ticketTypes]
                                  newTickets[index].price = parseFloat(e.target.value) || 0
                                  setEventData(prev => ({ ...prev, ticketTypes: newTickets }))
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              placeholder="Describe what's included with this ticket"
                              value={ticket.description}
                              onChange={(e) => {
                                const newTickets = [...eventData.ticketTypes]
                                newTickets[index].description = e.target.value
                                setEventData(prev => ({ ...prev, ticketTypes: newTickets }))
                              }}
                              rows={2}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Available Quantity</Label>
                            <Input
                              type="number"
                              placeholder="100"
                              value={ticket.quantity}
                              onChange={(e) => {
                                const newTickets = [...eventData.ticketTypes]
                                newTickets[index].quantity = parseInt(e.target.value) || 0
                                setEventData(prev => ({ ...prev, ticketTypes: newTickets }))
                              }}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Features</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {ticket.features.map((feature, featureIndex) => (
                                <Badge key={featureIndex} variant="outline">
                                  {feature}
                                  <button
                                    onClick={() => {
                                      const newTickets = [...eventData.ticketTypes]
                                      newTickets[index].features = newTickets[index].features.filter((_, i) => i !== featureIndex)
                                      setEventData(prev => ({ ...prev, ticketTypes: newTickets }))
                                    }}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a feature (e.g., VIP seating)"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addFeatureToTicket(index)}
                              />
                              <Button onClick={() => addFeatureToTicket(index)} variant="outline">
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button onClick={addTicketType} variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Ticket Type
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                  <div className="text-center mb-6">
                    <Eye className="w-12 h-12 mx-auto text-purple-600 mb-2" />
                    <h2 className="text-2xl font-bold">Review Your Event</h2>
                    <p className="text-muted-foreground">Everything looks good? Let's make it live!</p>
                  </div>

                  <Card className="border-2 border-purple-200 dark:border-purple-800">
                    <CardHeader>
                      <CardTitle className="text-2xl">{eventData.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                          {eventData.category}
                        </Badge>
                        {eventData.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{eventData.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span>{eventData.date} at {eventData.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          <span>{eventData.venue}, {eventData.location}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Ticket Types:</h4>
                        <div className="space-y-2">
                          {eventData.ticketTypes.map((ticket, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div>
                                <div className="font-medium">{ticket.name}</div>
                                <div className="text-sm text-muted-foreground">{ticket.description}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-purple-600">${ticket.price}</div>
                                <div className="text-xs text-muted-foreground">{ticket.quantity} available</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={
                      (currentStep === 0 && (!eventData.title || !eventData.category || !eventData.date)) ||
                      (currentStep === 2 && eventData.ticketTypes.some(t => !t.name || t.price < 0))
                    }
                  >
                    Next Step
                    <Zap className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Event...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Event 🚀
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
