"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { useWallet } from "@/contexts/wallet-context"
import { Ticket, Menu, User, Calendar, Wallet, Settings, LogOut, Home, Search, Plus } from 'lucide-react'

export function Header() {
  const { user, logout } = useAuth()
  const { balance } = useWallet()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Events', href: '/events', icon: Search },
  ]

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              EventHub
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            {user?.isOrganizer && (
              <Link
                href="/organizer/dashboard"
                className="text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Organizer Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-2 text-sm">
                  <Wallet className="w-4 h-4 text-green-600" />
                  <span className="font-medium">${balance.toFixed(2)}</span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/bookings" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wallet" className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Wallet (${balance.toFixed(2)})
                      </Link>
                    </DropdownMenuItem>
                    {user?.isOrganizer && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/organizer/dashboard" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Organizer Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/organizer/create-event" className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create Event
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-2 text-lg font-medium hover:text-purple-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  ))}
                  
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 py-2 border-t">
                        <Wallet className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Balance: ${balance.toFixed(2)}</span>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 text-lg font-medium hover:text-purple-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        Profile
                      </Link>
                      <Link
                        href="/bookings"
                        className="flex items-center gap-2 text-lg font-medium hover:text-purple-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Calendar className="w-5 h-5" />
                        My Bookings
                      </Link>
                      <Link
                        href="/wallet"
                        className="flex items-center gap-2 text-lg font-medium hover:text-purple-600 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Wallet className="w-5 h-5" />
                        Wallet
                      </Link>
                      {user?.isOrganizer && (
                        <>
                          <Link
                            href="/organizer/dashboard"
                            className="flex items-center gap-2 text-lg font-medium hover:text-purple-600 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <Settings className="w-5 h-5" />
                            Organizer Dashboard
                          </Link>
                          <Link
                            href="/organizer/create-event"
                            className="flex items-center gap-2 text-lg font-medium hover:text-purple-600 transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <Plus className="w-5 h-5" />
                            Create Event
                          </Link>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="justify-start gap-2 text-lg font-medium"
                      >
                        <LogOut className="w-5 h-5" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 pt-4 border-t">
                      <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
                        <Link href="/auth/signin">Sign In</Link>
                      </Button>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" asChild onClick={() => setIsOpen(false)}>
                        <Link href="/auth/signup">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
