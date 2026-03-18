import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('neuro_token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('neuro_user')
    if (stored && token) {
      try { setUser(JSON.parse(stored)) } catch { logout() }
    }
    setLoading(false)
  }, [])

  const login = (userData, jwt) => {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem('neuro_token', jwt)
    localStorage.setItem('neuro_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('neuro_token')
    localStorage.removeItem('neuro_user')
  }

  const updateUser = (nextUserData) => {
    setUser((prev) => {
      const merged = { ...(prev || {}), ...(nextUserData || {}) }
      localStorage.setItem('neuro_user', JSON.stringify(merged))
      return merged
    })
  }

  const isAdmin = user?.role === 'admin'
  const isEducator = user?.role === 'educator'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, isAdmin, isEducator }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
