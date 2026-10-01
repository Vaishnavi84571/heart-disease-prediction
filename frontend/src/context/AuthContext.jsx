import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('heart_user') || 'null'))
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const token = localStorage.getItem('heart_token')
    if (!token) return setLoading(false)
    api.get('/user/me').then(r => setUser(r.data)).catch(() => { localStorage.clear(); setUser(null) }).finally(() => setLoading(false))
  }, [])
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('heart_token', data.token); localStorage.setItem('heart_user', JSON.stringify(data.user)); setUser(data.user)
  }
  const signup = async (full_name, email, password) => {
    const { data } = await api.post('/auth/signup', { full_name, email, password })
    localStorage.setItem('heart_token', data.token); localStorage.setItem('heart_user', JSON.stringify(data.user)); setUser(data.user)
  }
  const logout = () => { localStorage.removeItem('heart_token'); localStorage.removeItem('heart_user'); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
