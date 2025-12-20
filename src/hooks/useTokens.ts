'use client'

import { useState, useEffect, useCallback } from 'react'

const API_BASE = 'https://api.xors.xyz'
const MIN_BALANCE = 100 // Minimum balance to enable real token mode
const API_KEY_STORAGE_KEY = 'xors_api_key'

interface Transaction {
  id: string
  amount_cents: number
  created_at: string
}

interface UseTokensResult {
  balance: number
  isConnected: boolean
  isLoading: boolean
  error: string | null
  setBalance: (balance: number) => void
  addLocal: (amount: number) => void
  refetch: () => Promise<void>
  setApiKey: (key: string) => void
  clearApiKey: () => void
  apiKey: string | null
}

export function useTokens(defaultBalance: number = 1000): UseTokensResult {
  const [balance, setBalance] = useState(defaultBalance)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKeyState] = useState<string | null>(null)

  // Load API key from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY)
      if (storedKey) {
        setApiKeyState(storedKey)
      } else {
        setIsLoading(false)
      }
    }
  }, [])

  // Fetch balance when API key is set
  const fetchBalance = useCallback(async () => {
    if (!apiKey) {
      setIsConnected(false)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/api/credits`, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError('Invalid API key')
          setIsConnected(false)
          setIsLoading(false)
          return
        }
        throw new Error('Failed to fetch balance')
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        // Calculate balance from transactions
        const transactions: Transaction[] = result.data
        const calculatedBalance = transactions.reduce(
          (sum, t) => sum + Number(t.amount_cents),
          0
        )
        
        // Only use real tokens if balance is above minimum
        if (calculatedBalance >= MIN_BALANCE) {
          setBalance(calculatedBalance)
          setIsConnected(true)
        } else {
          // Below minimum - use local mode
          setIsConnected(false)
        }
      } else {
        setIsConnected(false)
      }
    } catch (err) {
      console.error('Token fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to connect')
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }, [apiKey])

  // Fetch balance when API key changes
  useEffect(() => {
    if (apiKey) {
      fetchBalance()
    }
  }, [apiKey, fetchBalance])

  // Add tokens locally (for UI updates, game endpoints handle server-side)
  const addLocal = useCallback((amount: number) => {
    setBalance(prev => prev + amount)
  }, [])

  // Set API key and save to localStorage
  const setApiKey = useCallback((key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_KEY_STORAGE_KEY, key)
    }
    setApiKeyState(key)
  }, [])

  // Clear API key
  const clearApiKey = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(API_KEY_STORAGE_KEY)
    }
    setApiKeyState(null)
    setIsConnected(false)
    setBalance(1000) // Reset to default
  }, [])

  return {
    balance,
    isConnected,
    isLoading,
    error,
    setBalance,
    addLocal,
    refetch: fetchBalance,
    setApiKey,
    clearApiKey,
    apiKey,
  }
}

