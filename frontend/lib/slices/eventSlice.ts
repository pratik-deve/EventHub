import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Event {
  id: string
  title: string
  description: string
  category: "music" | "movies" | "sports" | "theater" | "comedy" | "other"
  date: string
  time: string
  venue: {
    id: string
    name: string
    address: string
    city: string
    capacity: number
  }
  price: {
    min: number
    max: number
  }
  image: string
  organizer: {
    id: string
    name: string
  }
  tags: string[]
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
}

interface EventFilters {
  category?: string
  location?: string
  dateRange?: { start: string; end: string }
  priceRange?: { min: number; max: number }
  search?: string
}

interface EventState {
  events: Event[]
  featuredEvents: Event[]
  trendingEvents: Event[]
  selectedEvent: Event | null
  filters: EventFilters
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
  }
}

const initialState: EventState = {
  events: [],
  featuredEvents: [],
  trendingEvents: [],
  selectedEvent: null,
  filters: {},
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
  },
}

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async ({ page = 1, filters }: { page?: number; filters?: EventFilters }) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...filters,
    })
    const response = await fetch(`/api/events?${queryParams}`)
    return response.json()
  },
)

export const fetchEventById = createAsyncThunk("events/fetchEventById", async (eventId: string) => {
  const response = await fetch(`/api/events/${eventId}`)
  return response.json()
})

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<EventFilters>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {}
    },
    setSelectedEvent: (state, action: PayloadAction<Event | null>) => {
      state.selectedEvent = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false
        state.events = action.payload.events
        state.pagination = action.payload.pagination
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch events"
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.selectedEvent = action.payload
      })
  },
})

export const { setFilters, clearFilters, setSelectedEvent } = eventSlice.actions
export default eventSlice.reducer
