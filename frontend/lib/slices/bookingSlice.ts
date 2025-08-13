import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Booking {
  id: string
  eventId: string
  userId: string
  seats: string[]
  totalAmount: number
  status: "pending" | "confirmed" | "cancelled" | "refunded"
  bookingDate: string
  paymentId?: string
}

interface BookingState {
  bookings: Booking[]
  currentBooking: Booking | null
  isLoading: boolean
  error: string | null
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
}

export const createBooking = createAsyncThunk(
  "bookings/create",
  async (bookingData: Omit<Booking, "id" | "bookingDate" | "status">) => {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
    return response.json()
  },
)

export const fetchUserBookings = createAsyncThunk("bookings/fetchUserBookings", async (userId: string) => {
  const response = await fetch(`/api/bookings/user/${userId}`)
  return response.json()
})

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentBooking = action.payload
        state.bookings.push(action.payload)
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Booking failed"
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.bookings = action.payload
      })
  },
})

export const { setCurrentBooking, clearError } = bookingSlice.actions
export default bookingSlice.reducer
