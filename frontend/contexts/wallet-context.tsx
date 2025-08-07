"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { WalletContextType, Transaction } from '@/lib/types'

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(1000) // Initial balance of $1000
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Load wallet data from localStorage
    const savedBalance = localStorage.getItem('walletBalance')
    const savedTransactions = localStorage.getItem('walletTransactions')
    
    if (savedBalance) {
      setBalance(parseFloat(savedBalance))
    } else {
      // Set initial balance and transaction
      const initialTransaction: Transaction = {
        id: '1',
        type: 'credit',
        amount: 1000,
        description: 'Welcome bonus',
        date: new Date().toISOString(),
        status: 'completed'
      }
      setTransactions([initialTransaction])
      localStorage.setItem('walletTransactions', JSON.stringify([initialTransaction]))
      localStorage.setItem('walletBalance', '1000')
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  const addFunds = (amount: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'credit',
      amount,
      description: 'Funds added',
      date: new Date().toISOString(),
      status: 'completed'
    }
    
    const newBalance = balance + amount
    const newTransactions = [newTransaction, ...transactions]
    
    setBalance(newBalance)
    setTransactions(newTransactions)
    localStorage.setItem('walletBalance', newBalance.toString())
    localStorage.setItem('walletTransactions', JSON.stringify(newTransactions))
  }

  const deductFunds = (amount: number, description: string): boolean => {
    if (balance >= amount) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'debit',
        amount,
        description,
        date: new Date().toISOString(),
        status: 'completed'
      }
      
      const newBalance = balance - amount
      const newTransactions = [newTransaction, ...transactions]
      
      setBalance(newBalance)
      setTransactions(newTransactions)
      localStorage.setItem('walletBalance', newBalance.toString())
      localStorage.setItem('walletTransactions', JSON.stringify(newTransactions))
      return true
    }
    return false
  }

  return (
    <WalletContext.Provider value={{ balance, transactions, addFunds, deductFunds }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
