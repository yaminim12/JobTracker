import { createContext, useContext, useEffect, useState } from 'react'

import api from '../api/axios'

const AuthContext = createContext(null)

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('jobTrackerUser') || 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser)
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('jobTrackerAccessToken')),
  )

  const saveSession = ({ access, refresh, user: nextUser }) => {
    localStorage.setItem('jobTrackerAccessToken', access)
    localStorage.setItem('jobTrackerRefreshToken', refresh)
    localStorage.setItem('jobTrackerUser', JSON.stringify(nextUser))
    setUser(nextUser)
    setIsAuthenticated(true)
  }

  const clearSession = () => {
    localStorage.removeItem('jobTrackerAccessToken')
    localStorage.removeItem('jobTrackerRefreshToken')
    localStorage.removeItem('jobTrackerUser')
    setUser(null)
    setIsAuthenticated(false)
  }

  const login = async (credentials) => {
    const { data } = await api.post('auth/login/', credentials)
    saveSession(data)
  }

  const logout = async () => {
    const refresh = localStorage.getItem('jobTrackerRefreshToken')
    try {
      if (refresh) await api.post('auth/logout/', { refresh })
    } catch {
      // Clear local state when a token has already expired.
    } finally {
      clearSession()
    }
  }

  const updateUser = (nextUser) => {
    localStorage.setItem('jobTrackerUser', JSON.stringify(nextUser))
    setUser(nextUser)
  }

  useEffect(() => {
    const handleExpiredSession = () => clearSession()
    window.addEventListener('job-tracker-auth-expired', handleExpiredSession)
    return () => window.removeEventListener(
      'job-tracker-auth-expired',
      handleExpiredSession,
    )
  }, [])

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider.')
  return context
}
