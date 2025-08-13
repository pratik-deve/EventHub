import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import eventSlice from "./slices/eventSlice"
import bookingSlice from "./slices/bookingSlice"
import seatSlice from "./slices/seatSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    events: eventSlice,
    bookings: bookingSlice,
    seats: seatSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
