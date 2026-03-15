import React, { createContext, useState, useContext, useEffect } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userAppointments, setUserAppointments] = useState([])
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedAppointments = localStorage.getItem('appointments')
    
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsLogged(true)
    }
    
    if (storedAppointments) {
      setUserAppointments(JSON.parse(storedAppointments))
    }
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    setIsLogged(true)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('isLogged', 'true')
    if (token) localStorage.setItem('token', token)
  }

  const logout = () => {
    setUser(null)
    setIsLogged(false)
    setUserAppointments([])
    localStorage.removeItem('user')
    localStorage.removeItem('isLogged')
    localStorage.removeItem('appointments')
    localStorage.removeItem('token')
  }

  const updateAppointments = (appointments) => {
    setUserAppointments(appointments)
    localStorage.setItem('appointments', JSON.stringify(appointments))
  }

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    userAppointments,
    isLogged,
    login,
    logout,
    updateAppointments,
    updateUser
  }

  return React.createElement(UserContext.Provider, { value }, children)
}
export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider')
  }
  return context
}