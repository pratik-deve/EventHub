import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, Globe, Award, Heart, Zap } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-6xl font-serif font-bold mb-6">About EventHub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're passionate about connecting people through unforgettable experiences. EventHub makes discovering and
            booking events simple, secure, and enjoyable.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To democratize event discovery and make every experience accessible to everyone. We believe that great
              events have the power to inspire, connect, and transform lives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">Passion-Driven</h3>
                <p className="text-muted-foreground">
                  We're fueled by our love for bringing people together through amazing experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">Innovation</h3>
                <p className="text-muted-foreground">
                  Cutting-edge technology meets intuitive design to create seamless event experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">Global Reach</h3>
                <p className="text-muted-foreground">
                  Connecting communities worldwide, from local meetups to international festivals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">EventHub by the Numbers</h2>
            <p className="text-lg text-muted-foreground">
              Join millions of event-goers who trust EventHub for their experiences
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">2M+</div>
              <div className="text-muted-foreground">Events Hosted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-secondary mb-2">50M+</div>
              <div className="text-muted-foreground">Tickets Sold</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-accent mb-2">180+</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">4.9★</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate individuals working together to revolutionize the event industry
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Founder",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Michael Chen",
                role: "CTO",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "Emily Rodriguez",
                role: "Head of Design",
                image: "/placeholder.svg?height=300&width=300",
              },
            ].map((member) => (
              <Card key={member.name} className="text-center border-0 shadow-lg overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-semibold mb-2">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold mb-2">Community First</h3>
                <p className="text-muted-foreground">
                  We prioritize building strong, inclusive communities where everyone feels welcome and valued.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold mb-2">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for excellence in every interaction, from our platform to our customer service.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold mb-2">Accessibility</h3>
                <p className="text-muted-foreground">
                  Making events accessible to everyone, regardless of background, location, or budget.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  Continuously pushing boundaries to create better, more intuitive event experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">Ready to Discover Amazing Events?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join millions of event-goers and start exploring unforgettable experiences today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              <Link href="/events">Browse Events</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
