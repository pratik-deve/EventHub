"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { AuthContextType, User } from '@/lib/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication - in real app, validate against backend
    if (email && password) {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        avatar: '/placeholder.svg?height=100&width=100',
        joinedDate: '2024-01-15',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        bio: 'Music lover and event enthusiast',
        isOrganizer: email.includes('organizer'), // Simple check for demo
        organizerProfile: email.includes('organizer') ? {
          companyName: 'Amazing Events Co.',
          website: 'https://amazingevents.com',
          description: 'Creating unforgettable experiences since 2020',
          verified: true,
          rating: 4.8,
          eventsCreated: 25
        } : undefined
      }
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      return true
    }
    return false
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (name && email && password) {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        avatar: '/placeholder.svg?height=100&width=100',
        joinedDate: new Date().toISOString().split('T')[0],
        bio: 'New to EventHub!',
        isOrganizer: email.includes('organizer'), // Simple check for demo
        organizerProfile: email.includes('organizer') ? {
          companyName: `${name}'s Events`,
          description: 'New event organizer ready to create amazing experiences!',
          verified: false,
          rating: 0,
          eventsCreated: 0
        } : undefined
      }
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
