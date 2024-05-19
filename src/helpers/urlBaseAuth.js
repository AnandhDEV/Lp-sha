import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { NextPage } from 'next'
import { useAuth } from 'src/hooks/useAuth'
import jwt from 'jsonwebtoken'

export function withAuth(WrappedComponent) {
  const Wrapper = props => {
    const Router = useRouter()

    useEffect(() => {
      const userData = jwt.decode(localStorage.getItem('accessToken'), { complete: true })?.payload
      const roleId = userData?.roleId

      // const isUser = Boolean(localStorage.getItem('isUser'))
      // // const roleId = localStorage.getItem('roleId')
      // const accessToken = localStorage.getItem('accessToken')

      if ((roleId == 4) && ["/users", "/clients", "/settings"].includes(Router.pathname)) {
        Router.replace('/401')
      }
    }, [Router])

    return <WrappedComponent {...props} />
  }

  return Wrapper
}
