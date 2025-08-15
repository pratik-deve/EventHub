import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  // id: string
  username: string
  // name: string
  role: "user" | "admin" | "organizer"
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
}

// Async thunks for API calls
export const signinUser = createAsyncThunk(
  "auth/signin",
  async ({ email, password }: { email: string; password: string }) => {
    // Mock API call - replace with actual API
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    return response.json()
  },
)

export const singupUser = createAsyncThunk(
  "auth/singup",
  async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const response = await fetch("/api/auth/singup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })
    return response.json()
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signinUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "signin failed"
      })
      .addCase(singupUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(singupUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(singupUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Registration failed"
      })
  },
})

export const { logout, clearError, setCredentials } = authSlice.actions
export default authSlice.reducer
