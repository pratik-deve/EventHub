"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Check, Crown, Zap, Star, ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const plans = [
  {
    id: "trial",
    name: "Free Trial",
    price: 0,
    period: "14 days",
    description: "Perfect for getting started",
    features: [
      "Create up to 3 events",
      "Basic analytics",
      "Email support",
      "Standard templates",
      "Up to 100 attendees per event",
    ],
    popular: false,
    icon: Zap,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "monthly",
    name: "Pro Monthly",
    price: 29,
    period: "month",
    description: "For active event organizers",
    features: [
      "Unlimited events",
      "Advanced analytics & insights",
      "Priority support",
      "Custom branding",
      "Unlimited attendees",
      "Payment processing",
      "Marketing tools",
      "Team collaboration",
    ],
    popular: true,
    icon: Crown,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "yearly",
    name: "Pro Yearly",
    price: 290,
    period: "year",
    originalPrice: 348,
    description: "Best value for serious organizers",
    features: [
      "Everything in Pro Monthly",
      "Advanced integrations",
      "White-label solution",
      "Dedicated account manager",
      "Custom development",
      "API access",
      "Advanced reporting",
      "Priority feature requests",
    ],
    popular: false,
    icon: Star,
    gradient: "from-orange-500 to-red-500",
  },
]

export default function SubscriptionPage() {
  const { user, becomeOrganizer } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSelectPlan = async (planId: "trial" | "monthly" | "yearly") => {
    setSelectedPlan(planId)
    setIsProcessing(true)

    try {
      await becomeOrganizer(planId)

      toast({
        title: "Welcome to EventHub Pro!",
        description: `You've successfully ${planId === "trial" ? "started your free trial" : "subscribed to the Pro plan"}.`,
      })

      // Redirect to organizer dashboard
      router.push("/organizer/dashboard")
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setSelectedPlan(null)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white">
                <Sparkles className="w-4 h-4 mr-1" />
                Become an Organizer
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">Ready to Create Amazing Events?</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of successful event organizers and start creating memorable experiences today.
              </p>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative ${plan.popular ? "lg:scale-105" : ""}`}
                >
                  <Card
                    className={`h-full transition-all duration-300 hover:shadow-xl ${
                      plan.popular ? "border-primary shadow-lg" : ""
                    } ${selectedPlan === plan.id ? "ring-2 ring-primary" : ""}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-8">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <CardTitle className="text-2xl font-serif">{plan.name}</CardTitle>
                      <CardDescription className="text-base">{plan.description}</CardDescription>

                      <div className="mt-4">
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-4xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/{plan.period}</span>
                        </div>
                        {plan.originalPrice && (
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="text-sm text-muted-foreground line-through">
                              ${plan.originalPrice}/year
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              Save ${plan.originalPrice - plan.price}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full ${
                          plan.popular
                            ? "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                            : ""
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                        onClick={() => handleSelectPlan(plan.id as "trial" | "monthly" | "yearly")}
                        disabled={isProcessing}
                      >
                        {isProcessing && selectedPlan === plan.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {plan.id === "trial" ? "Start Free Trial" : "Get Started"}
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 text-center"
          >
            <h2 className="text-3xl font-serif font-bold mb-8">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div>
                <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of
                  your billing period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What happens after the trial?</h3>
                <p className="text-muted-foreground text-sm">
                  After your 14-day trial, you can choose to upgrade to a paid plan or your account will revert to
                  attendee-only access.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-muted-foreground text-sm">
                  We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I change plans later?</h3>
                <p className="text-muted-foreground text-sm">
                  You can upgrade or downgrade your plan at any time from your account settings.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
