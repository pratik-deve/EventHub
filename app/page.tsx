"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Users, Star, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="container mx-auto px-4 py-20 sm:py-32"
        >
          <div className="text-center space-y-8">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Discover Amazing Events
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight"
            >
              Your Gateway to
              <motion.span
                className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                Unforgettable Events
              </motion.span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Discover, book, and manage events seamlessly. From concerts to conferences, find your next amazing
              experience with EventHub.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6 btn-gradient-hover shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/events">
                    Explore Events
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 bg-transparent">
                  <Link href="/signup">Create Account</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">Why Choose EventHub?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of event discovery and booking with our innovative platform
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Calendar,
                title: "Easy Booking",
                description: "Book tickets in seconds with our streamlined checkout process and secure payment system.",
                color: "primary",
              },
              {
                icon: MapPin,
                title: "Local & Global",
                description: "Discover events in your city or explore exciting opportunities around the world.",
                color: "secondary",
              },
              {
                icon: Users,
                title: "Community",
                description: "Connect with like-minded people and build lasting memories at every event.",
                color: "accent",
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div key={index} variants={cardVariants} whileHover="hover">
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover h-full">
                    <CardContent className="p-8 text-center">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-16 h-16 bg-${feature.color}/10 rounded-2xl flex items-center justify-center mx-auto mb-6`}
                      >
                        <Icon className={`w-8 h-8 text-${feature.color}`} />
                      </motion.div>
                      <h3 className="text-xl font-serif font-semibold mb-4">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Events Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">Featured Events</h2>
              <p className="text-lg text-muted-foreground">Don't miss out on these popular upcoming events</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" asChild>
                <Link href="/events">View All Events</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map((i) => (
              <motion.div key={i} variants={cardVariants} whileHover="hover">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 card-hover group">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      Dec 25, 2024
                    </div>
                    <h3 className="font-serif font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      Sample Event {i}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      New York, NY
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                      <span className="font-semibold text-primary">$49</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-muted/50 py-12"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 mb-4 md:mb-0">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-bold">EventHub</span>
            </motion.div>
            <p className="text-muted-foreground text-center md:text-right">© 2024 EventHub. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
