"use client"

import type React from "react"
import { useState } from "react"
import { CreditCard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface PaymentFormProps {
  onSubmit: (paymentData: any) => void
  isLoading: boolean
}

export function PaymentForm({ onSubmit, isLoading }: PaymentFormProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Please enter a valid card number"
    }

    if (!paymentData.expiryMonth) {
      newErrors.expiryMonth = "Please select expiry month"
    }

    if (!paymentData.expiryYear) {
      newErrors.expiryYear = "Please select expiry year"
    }

    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = "Please enter a valid CVV"
    }

    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = "Please enter cardholder name"
    }

    if (!paymentData.billingAddress.street.trim()) {
      newErrors.street = "Please enter billing address"
    }

    if (!paymentData.billingAddress.city.trim()) {
      newErrors.city = "Please enter city"
    }

    if (!paymentData.billingAddress.zipCode.trim()) {
      newErrors.zipCode = "Please enter ZIP code"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(paymentData)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setPaymentData({ ...paymentData, cardNumber: formatted })
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i)
  const months = [
    { value: "01", label: "01 - January" },
    { value: "02", label: "02 - February" },
    { value: "03", label: "03 - March" },
    { value: "04", label: "04 - April" },
    { value: "05", label: "05 - May" },
    { value: "06", label: "06 - June" },
    { value: "07", label: "07 - July" },
    { value: "08", label: "08 - August" },
    { value: "09", label: "09 - September" },
    { value: "10", label: "10 - October" },
    { value: "11", label: "11 - November" },
    { value: "12", label: "12 - December" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="cardNumber"
              type="text"
              value={paymentData.cardNumber}
              onChange={handleCardNumberChange}
              className={`pl-10 ${errors.cardNumber ? "border-red-500" : ""}`}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>
          {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="expiryMonth">Month</Label>
            <Select
              value={paymentData.expiryMonth}
              onValueChange={(value) => setPaymentData({ ...paymentData, expiryMonth: value })}
            >
              <SelectTrigger className={errors.expiryMonth ? "border-red-500" : ""}>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.expiryMonth && <p className="text-sm text-red-500 mt-1">{errors.expiryMonth}</p>}
          </div>

          <div>
            <Label htmlFor="expiryYear">Year</Label>
            <Select
              value={paymentData.expiryYear}
              onValueChange={(value) => setPaymentData({ ...paymentData, expiryYear: value })}
            >
              <SelectTrigger className={errors.expiryYear ? "border-red-500" : ""}>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.expiryYear && <p className="text-sm text-red-500 mt-1">{errors.expiryYear}</p>}
          </div>

          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              type="text"
              value={paymentData.cvv}
              onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, "") })}
              className={errors.cvv ? "border-red-500" : ""}
              placeholder="123"
              maxLength={4}
            />
            {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="cardholderName">Cardholder Name</Label>
          <Input
            id="cardholderName"
            type="text"
            value={paymentData.cardholderName}
            onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
            className={errors.cardholderName ? "border-red-500" : ""}
            placeholder="John Doe"
          />
          {errors.cardholderName && <p className="text-sm text-red-500 mt-1">{errors.cardholderName}</p>}
        </div>
      </div>

      {/* Billing Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Billing Address</h3>

        <div>
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            type="text"
            value={paymentData.billingAddress.street}
            onChange={(e) =>
              setPaymentData({
                ...paymentData,
                billingAddress: { ...paymentData.billingAddress, street: e.target.value },
              })
            }
            className={errors.street ? "border-red-500" : ""}
            placeholder="123 Main St"
          />
          {errors.street && <p className="text-sm text-red-500 mt-1">{errors.street}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              type="text"
              value={paymentData.billingAddress.city}
              onChange={(e) =>
                setPaymentData({
                  ...paymentData,
                  billingAddress: { ...paymentData.billingAddress, city: e.target.value },
                })
              }
              className={errors.city ? "border-red-500" : ""}
              placeholder="New York"
            />
            {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              type="text"
              value={paymentData.billingAddress.state}
              onChange={(e) =>
                setPaymentData({
                  ...paymentData,
                  billingAddress: { ...paymentData.billingAddress, state: e.target.value },
                })
              }
              placeholder="NY"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            type="text"
            value={paymentData.billingAddress.zipCode}
            onChange={(e) =>
              setPaymentData({
                ...paymentData,
                billingAddress: { ...paymentData.billingAddress, zipCode: e.target.value },
              })
            }
            className={errors.zipCode ? "border-red-500" : ""}
            placeholder="10001"
          />
          {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading} size="lg">
        {isLoading ? "Processing..." : "Complete Payment"}
      </Button>
    </form>
  )
}
