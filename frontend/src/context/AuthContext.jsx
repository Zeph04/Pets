import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => authService.getStoredUser())
  const [token,   setToken]   = useState(() => authService.getStoredToken())
  const [loading, setLoading] = useState(true)

  // Validate token on mount
  useEffect(() => {
    const validate = async () => {
      if (!token) { setLoading(false); return }
      try {
        const me = await authService.me()
        setUser(me)
      } catch {
        authService.clearStorage()
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }
    validate()
  }, []) // eslint-disable-line

  // Listen for 401 events fired by Axios interceptor
  useEffect(() => {
    const handleExpiry = () => {
      setUser(null)
      setToken(null)
    }
    window.addEventListener('auth:expired', handleExpiry)
    return () => window.removeEventListener('auth:expired', handleExpiry)
  }, [])

  const login = useCallback(async (credentials) => {
    const { token: t, user: u } = await authService.login(credentials)
    setToken(t)
    setUser(u)
    return u
  }, [])

  const register = useCallback(async (data) => {
    const res = await authService.register(data)
    // After register, log them in
    const { token: t, user: u } = res.data
    localStorage.setItem('pawshome_token', t)
    localStorage.setItem('pawshome_user', JSON.stringify(u))
    setToken(t)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(async () => {
    try { await authService.logout() } catch { /* ignore */ }
    setUser(null)
    setToken(null)
  }, [])

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin:  user?.is_admin ?? false,
    isStaff:  user?.roles?.some(r => ['admin', 'staff'].includes(r)) ?? false,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
