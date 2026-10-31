
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const API_URL = 'https://gather-production-f9af.up.railway.app'

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchUser(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
        throw new Error(
            `Unable to authenticate user. Status: ${response.status}`
        )
    }

    return response.json()
  }

  useEffect(() => {
    const token = sessionStorage.getItem('gather_token')

    if (!token) {
      setLoading(false)
      return
    }

    let active = true

    fetchUser(token)
      .then((data) => {
        if (active) setUser(data)
      })
      .catch(() => {
        if (active) {
          sessionStorage.removeItem('gather_token')
          setUser(null)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function login(token: string) {
    const data = await fetchUser(token)
    sessionStorage.setItem('gather_token', token)
    setUser(data)
  }

  function logout() {
    sessionStorage.removeItem('gather_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}