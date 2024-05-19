// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import

const AuthGuard = props => {
  const { children, fallback } = props
  const router = useRouter()
  useEffect(
    () => {
      if (!router.isReady) {
        return
      }
      if (!window.localStorage.getItem('userData')) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/login')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )

  return <>{children}</>
}

export default AuthGuard
