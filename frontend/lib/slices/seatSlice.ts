import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Seat {
  id: string
  row: string
  number: number
  type: "regular" | "vip" | "premium"
  price: number
  status: "available" | "held" | "booked" | "unavailable"
}

interface SeatState {
  seats: Seat[]
  selectedSeats: string[]
  heldSeats: string[]
  totalPrice: number
  seatMap: {
    rows: number
    seatsPerRow: number
  }
}

const initialState: SeatState = {
  seats: [],
  selectedSeats: [],
  heldSeats: [],
  totalPrice: 0,
  seatMap: {
    rows: 0,
    seatsPerRow: 0,
  },
}

const seatSlice = createSlice({
  name: "seats",
  initialState,
  reducers: {
    setSeats: (state, action: PayloadAction<Seat[]>) => {
      state.seats = action.payload
    },
    selectSeat: (state, action: PayloadAction<string>) => {
      const seatId = action.payload
      if (!state.selectedSeats.includes(seatId)) {
        state.selectedSeats.push(seatId)
        const seat = state.seats.find((s) => s.id === seatId)
        if (seat) {
          state.totalPrice += seat.price
        }
      }
    },
    deselectSeat: (state, action: PayloadAction<string>) => {
      const seatId = action.payload
      const index = state.selectedSeats.indexOf(seatId)
      if (index > -1) {
        state.selectedSeats.splice(index, 1)
        const seat = state.seats.find((s) => s.id === seatId)
        if (seat) {
          state.totalPrice -= seat.price
        }
      }
    },
    clearSelection: (state) => {
      state.selectedSeats = []
      state.totalPrice = 0
    },
    holdSeats: (state, action: PayloadAction<string[]>) => {
      state.heldSeats = action.payload
      // Update seat status to held
      state.seats.forEach((seat) => {
        if (action.payload.includes(seat.id)) {
          seat.status = "held"
        }
      })
    },
    setSeatMap: (state, action: PayloadAction<{ rows: number; seatsPerRow: number }>) => {
      state.seatMap = action.payload
    },
  },
})

export const { setSeats, selectSeat, deselectSeat, clearSelection, holdSeats, setSeatMap } = seatSlice.actions
export default seatSlice.reducer
