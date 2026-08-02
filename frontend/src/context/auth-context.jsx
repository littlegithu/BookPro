import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('bookpro_user') || 'null')
  )
  const [token, setToken] = useState(
    localStorage.getItem('bookpro_token') || null
  )

  const login = async (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('bookpro_user', JSON.stringify(userData))
    localStorage.setItem('bookpro_token', jwtToken)
  }

  const updateProfileImage = (profileImage) => {
    const updatedUser = { ...user, profile_image: profileImage }
    setUser(updatedUser)
    localStorage.setItem('bookpro_user', JSON.stringify(updatedUser))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('bookpro_user')
    localStorage.removeItem('bookpro_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateProfileImage, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
