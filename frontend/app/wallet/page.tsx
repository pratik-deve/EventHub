"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { useWallet } from "@/contexts/wallet-context"
import { useToast } from "@/hooks/use-toast"
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, DollarSign, TrendingUp, Calendar } from 'lucide-react'

export default function WalletPage() {
  const { user } = useAuth()
  const { balance, transactions, addFunds } = useWallet()
  const { toast } = useToast()
  const router = useRouter()
  const [addFundsAmount, setAddFundsAmount] = useState("")
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
    }
  }, [user, router])

  const handleAddFunds = () => {
    const amount = parseFloat(addFundsAmount)
    if (amount > 0) {
      addFunds(amount)
      setAddFundsAmount("")
      setIsAddFundsOpen(false)
      toast({
        title: "Funds added successfully",
        description: `$${amount.toFixed(2)} has been added to your wallet.`,
      })
    }
  }

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? (
      <ArrowDownLeft className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-red-600" />
    )
  }

  const getTransactionColor = (type: string) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600'
  }

  if (!user) {
    return null
  }

  // Calculate stats
  const totalCredits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalDebits = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
            <p className="text-muted-foreground">
              Manage your EventHub wallet and transaction history
            </p>
          </div>

          {/* Wallet Balance Card */}
          <Card className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-6 h-6" />
                Wallet Balance
              </CardTitle>
              <CardDescription className="text-purple-100">
                Available funds in your EventHub wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold mb-2">
                    ${balance.toFixed(2)}
                  </div>
                  <div className="text-purple-100">
                    Available Balance
                  </div>
                </div>
                <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Funds
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Funds to Wallet</DialogTitle>
                      <DialogDescription>
                        Add money to your EventHub wallet to book events seamlessly.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={addFundsAmount}
                            onChange={(e) => setAddFundsAmount(e.target.value)}
                            className="pl-10"
                            min="1"
                            step="0.01"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {[25, 50, 100, 200].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setAddFundsAmount(amount.toString())}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddFunds}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          disabled={!addFundsAmount || parseFloat(addFundsAmount) <= 0}
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Add Funds
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddFundsOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Added</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${totalCredits.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Lifetime funds added
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ${totalDebits.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Spent on events
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {transactions.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total transactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Your recent wallet transactions and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <div className="font-medium">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()} at{' '}
                            {new Date(transaction.date).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`font-bold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </div>
                        <Badge
                          variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                          className={
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : ''
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Your transaction history will appear here once you start using your wallet.
                  </p>
                  <Button onClick={() => setIsAddFundsOpen(true)}>
                    Add Your First Funds
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
