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

  const isStaff = () => {
    if (!user) return false
    return user.role === 'staff' || (user.staff && user.staff.role)
  }

  const staffRole = () => {
    if (!user) return null
    if (user.staff && user.staff.role) return user.staff.role
    if (user.role === 'staff') return 'Receptionist'
    return null
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateProfileImage, isAuthenticated: !!token, isStaff, staffRole }}>
      {children}
    </AuthContext.Provider>
  )
}

/* eslint-disable react-refresh/only-export-components */
export function useAuth() {
  return useContext(AuthContext)
}