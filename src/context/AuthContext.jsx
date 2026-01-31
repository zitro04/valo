import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'valoplant-auth'

const AuthContext = createContext(null)

function normalizeStoredUser(parsed) {
  if (!parsed?.id || !parsed?.name) return null
  const role = parsed.role ?? (parsed.id === 'coach' ? 'coach' : 'member')
  return { id: parsed.id, name: parsed.name, role }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        return normalizeStoredUser(parsed)
      }
    } catch (_) {}
    return null
  })

  useEffect(() => {
    if (user) {
      const toStore = normalizeStoredUser(user)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = useCallback((userData) => {
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const isCoach = user?.role === 'coach'

  return (
    <AuthContext.Provider value={{ user, login, logout, isCoach }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
