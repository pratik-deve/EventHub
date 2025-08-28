"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { Menu, X, Calendar, User, LogOut, Crown, Settings, BarChart3 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-lg shadow-sm"
          : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                <Calendar className="h-8 w-8 text-primary" />
              </motion.div>
              <span className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EventHub
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { href: "/events", label: "Events" },
              { href: "/about", label: "About" },
            ].map((item) => (
              <motion.div key={item.href} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link
                  href={item.href}
                  className="text-foreground/80 hover:text-foreground transition-colors duration-200 relative group py-2"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
            {user?.isOrganizer && (
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link
                  href="/organizer/dashboard"
                  className="text-foreground/80 hover:text-foreground transition-colors duration-200 relative group flex items-center gap-1 py-2"
                >
                  <Crown className="w-4 h-4" />
                  Organizer
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullname} />
                        <AvatarFallback>{user.fullname.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {user.isOrganizer && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
                          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-gradient-to-r from-primary to-secondary">
                            <Crown className="h-2 w-2" />
                          </Badge>
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.fullname}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                      {user.isOrganizer && (
                        <Badge variant="secondary" className="w-fit text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          {user.subscriptionStatus === "trial"
                            ? "Trial"
                            : user.subscriptionStatus === "monthly"
                              ? "Pro Monthly"
                              : "Pro Yearly"}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {user.isOrganizer && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/organizer/dashboard">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Organizer Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {!user.isOrganizer && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/subscription">
                          <Crown className="mr-2 h-4 w-4" />
                          Become Organizer
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-3"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 border-t">
                {[
                  { href: "/events", label: "Events" },
                  { href: "/about", label: "About" },
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-accent/10"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                {user?.isOrganizer && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      href="/organizer/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-accent/10"
                      onClick={() => setIsOpen(false)}
                    >
                      <Crown className="w-4 h-4" />
                      Organizer Dashboard
                    </Link>
                  </motion.div>
                )}
                {user ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-4 space-y-2"
                  >
                    <div className="px-3 py-2">
                      <p className="font-medium">{user.fullname}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.isOrganizer && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          {user.subscriptionStatus === "trial"
                            ? "Trial"
                            : user.subscriptionStatus === "monthly"
                              ? "Pro Monthly"
                              : "Pro Yearly"}
                        </Badge>
                      )}
                    </div>
                    {[
                      { href: "/dashboard", label: "Dashboard" },
                      { href: "/profile", label: "Profile" },
                    ].map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className="block px-3 py-2 text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-accent/10"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                    {!user.isOrganizer && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Link
                          href="/subscription"
                          className="flex items-center gap-2 px-3 py-2 text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-accent/10"
                          onClick={() => setIsOpen(false)}
                        >
                          <Crown className="w-4 h-4" />
                          Become Organizer
                        </Link>
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-3"
                        onClick={() => {
                          signOut()
                          setIsOpen(false)
                        }}
                      >
                        Sign out
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col space-y-2 pt-4"
                  >
                    <Button variant="ghost" asChild>
                      <Link href="/signin" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="bg-gradient-to-r from-primary to-secondary">
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
