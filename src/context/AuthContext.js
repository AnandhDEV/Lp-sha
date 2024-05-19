import { createContext, useEffect, useState } from 'react'

import jwt from 'jsonwebtoken'
import { useRouter } from 'next/router'

const defaultProvider = {
  user: null,
  loading: true
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultProvider.user)
  const router = useRouter()

  useEffect(() => {
    const userData = jwt.decode(localStorage.getItem('accessToken'), { complete: true })?.payload
    setUser(userData)
  }, [router.pathname])

  const values = {
    user,
    setUser
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }