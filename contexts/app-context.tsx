"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { storage } from '@/lib/storage'

interface AppContextType {
  theme: string | undefined
  setTheme: (theme: string) => void
  user: any
  setUser: (user: any) => void
  isLoading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user on app start
    const currentUser = storage.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  return (
    <AppContext.Provider value={{ theme, setTheme, user, setUser, isLoading }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}