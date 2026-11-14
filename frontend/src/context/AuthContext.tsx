import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { api } from '@/services/api'

interface User {
  userId: string
  email:  string
  role:   string
}

interface AuthState {
  user:    User | null
  token:   string | null
  login:   (email: string, password: string) => Promise<void>
  logout:  () => void
  isAuth:  boolean
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token')
  )
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? (JSON.parse(stored) as User) : null
  })

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ data: { user: User; token: string } }>(
      '/api/auth/login',
      { email, password }
    )
    setToken(res.data.token)
    setUser(res.data.user as unknown as User)
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
