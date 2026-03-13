'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { AuthService } from '../api/auth.client'
import type { AuthResponse } from '../types/auth.types'

interface AuthContextType {
  user: AuthResponse['user'] | null
  isAuthenticated: boolean
  loading: boolean
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider ({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const cachedUser = AuthService.getCurrentUser()
      if (cachedUser) {
        setUser(cachedUser)
      }

      try {
        const freshUser = await AuthService.fetchCurrentUser()
        setUser(freshUser)
      } catch (e: any) {
        setUser(null)
        localStorage.removeItem('user')
        if (cachedUser) {
          window.location.href = '/'
        }
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null)
      localStorage.removeItem('user')
      window.location.href = '/'
    }

    window.addEventListener('auth:logout', handleForceLogout)
    return () => window.removeEventListener('auth:logout', handleForceLogout)
  }, [])

  const refreshUser = async () => {
    try {
      const freshUser = await AuthService.fetchCurrentUser()
      setUser(freshUser)
    } catch {
      setUser(null)
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
    } finally {
      setUser(null)
      localStorage.removeItem('user')
      window.location.href = '/'
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext () {
  const context = useContext(AuthContext)
  if (!context)
    throw new Error('useAuthContext must be used within AuthProvider')
  return context
}