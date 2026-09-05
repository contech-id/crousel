import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type UserProfile = {
  fullName: string
  phone: string
  password: string
  birthDate: string
  gender: string
  province: string
  city: string
  district: string
  village: string
  postalCode: string
  address: string
  avatarUrl: string
}

type AuthContextValue = {
  user: UserProfile | null
  isAuthenticated: boolean
  login: (phone: string, password: string) => boolean
  register: (profile: Pick<UserProfile, 'fullName' | 'phone' | 'password'>) => boolean
  updateProfile: (profile: UserProfile) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const userKey = 'crousel-user'
const sessionKey = 'crousel-session'

function readUser(): UserProfile | null {
  try {
    const value = window.localStorage.getItem(userKey)
    return value ? (JSON.parse(value) as UserProfile) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (window.localStorage.getItem(sessionKey) !== 'active') return null
    return readUser()
  })

  useEffect(() => {
    if (user) window.localStorage.setItem(userKey, JSON.stringify(user))
  }, [user])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    login: (phone, password) => {
      const storedUser = readUser()
      if (!storedUser || storedUser.phone !== phone || storedUser.password !== password) return false
      window.localStorage.setItem(sessionKey, 'active')
      setUser(storedUser)
      return true
    },
    register: ({ fullName, phone, password }) => {
      const profile: UserProfile = {
        fullName,
        phone,
        password,
        birthDate: '',
        gender: '',
        province: '',
        city: '',
        district: '',
        village: '',
        postalCode: '',
        address: '',
        avatarUrl: '',
      }
      window.localStorage.setItem(userKey, JSON.stringify(profile))
      window.localStorage.setItem(sessionKey, 'active')
      setUser(profile)
      return true
    },
    updateProfile: (profile) => setUser(profile),
    logout: () => {
      window.localStorage.removeItem(sessionKey)
      setUser(null)
    },
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
