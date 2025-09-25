// src/hooks/useAuth.jsx - Demo bypass ekli
import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Demo user kontrolü
    const demoUser = localStorage.getItem('emotice_demo_user')
    if (demoUser) {
      setUser({ id: 'demo-user', email: 'demo@emotice.com', name: 'Demo User' })
    }
    setLoading(false)
  }, [])

  const signUp = async (email, password, userData) => {
    // Demo için
    setUser({ id: 'demo-user', email, name: userData.full_name })
    localStorage.setItem('emotice_demo_user', 'true')
    return { data: { user: true }, error: null }
  }

  const signIn = async (email, password) => {
    // Demo için
    setUser({ id: 'demo-user', email, name: 'Demo User' })
    localStorage.setItem('emotice_demo_user', 'true')
    return { data: { user: true }, error: null }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('emotice_demo_user')
    return { error: null }
  }

  return { user, loading, signUp, signIn, signOut }
}
