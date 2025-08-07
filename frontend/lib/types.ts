export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  joinedDate: string
  phone?: string
  location?: string
  bio?: string
  isOrganizer?: boolean
  organizerProfile?: {
    companyName: string
    website?: string
    description: string
    verified: boolean
    rating: number
    eventsCreated: number
  }
}

export interface Event {
  id: string
  title: string
  image: string
  images?: string[]
  date: string
  time: string
  location: string
  venue: string
  price: number
  originalPrice?: number
  category: string
  rating: number
  reviewCount: number
  attendees: number
  description: string
  longDescription?: string
  tags: string[]
  organizer: {
    name: string
    image: string
    rating: number
    eventsCount: number
  }
  lineup?: Array<{
    name: string
    time: string
    stage: string
  }>
  amenities?: Array<{
    icon: any
    name: string
  }>
  ticketTypes?: Array<{
    name: string
    price: number
    originalPrice?: number
    description: string
    features: string[]
  }>
}

export interface BookedEvent {
  id: string
  event: Event
  ticketType: string
  quantity: number
  totalPrice: number
  bookingDate: string
  status: 'confirmed' | 'cancelled' | 'completed'
  qrCode?: string
}

export interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

export interface WalletContextType {
  balance: number
  transactions: Transaction[]
  addFunds: (amount: number) => void
  deductFunds: (amount: number, description: string) => boolean
}

export interface BookingContextType {
  bookedEvents: BookedEvent[]
  bookEvent: (event: Event, ticketType: string, quantity: number, totalPrice: number) => boolean
  cancelBooking: (bookingId: string) => void
}

// Add new interfaces for event creation
export interface CreateEventData {
  title: string
  description: string
  longDescription: string
  category: string
  date: string
  time: string
  endTime: string
  location: string
  venue: string
  images: string[]
  ticketTypes: Array<{
    name: string
    price: number
    description: string
    features: string[]
    quantity: number
  }>
  tags: string[]
  amenities: string[]
}

export interface OrganizerEvent extends Event {
  organizerId: string
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  ticketsSold: number
  revenue: number
  createdAt: string
}
