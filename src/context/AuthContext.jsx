import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  const login = useCallback((username = 'User') => {
    const lowerUsername = username.toLowerCase()
    const role = lowerUsername.includes('admin') ? 'admin' : 'user'
    setCurrentUser({
      id: '1',
      name: username,
      email: username.includes('@') ? username : 'yogesh@example.com',
      avatar: `https://ui-avatars.com/api/?name=${username.replace(/ /g, '+')}&background=c5a059&color=fff`,
      role
    })
  }, [])

  const signup = useCallback((name, email) => {
    setCurrentUser({
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=c5a059&color=fff`,
      role: 'user'
    })
  }, [])

  const loginWithGoogle = useCallback(() => {
    setCurrentUser({
      id: 'google-user',
      name: 'Google User',
      email: 'google@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Google+User&background=db4437&color=fff',
      role: 'user'
    })
  }, [])

  const loginWithFacebook = useCallback(() => {
    setCurrentUser({
      id: 'facebook-user',
      name: 'Facebook User',
      email: 'facebook@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Facebook+User&background=4267B2&color=fff',
      role: 'user'
    })
  }, [])

  const updateProfile = useCallback((details) => {
    setCurrentUser(prev => prev ? { ...prev, ...details } : null)
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  const isAdmin = currentUser?.role === 'admin'
  const isLoggedIn = currentUser !== null

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdmin,
      isLoggedIn,
      login,
      signup,
      loginWithGoogle,
      loginWithFacebook,
      updateProfile,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
