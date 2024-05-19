// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import

const GuestGuard = props => {
  const { children, fallback } = props
  const router = useRouter()
  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (window.localStorage.getItem('userData')) {
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])

  return <>{children}</>
}

export default GuestGuard
