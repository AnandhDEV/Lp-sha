import { useEffect } from 'react'
import AnalyticsDashboard from './dashboards/analytics'
import { useRouter } from 'next/router'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    // const accessToken = localStorage.getItem('accessToken')
    // if (window.location.pathname == '/') {
    //   if (accessToken != null) {
    //     const oldTokenDecoded = jwt.decode(accessToken, { complete: true })
    //   const user = oldTokenDecoded?.payload
    //   const isExpired = dayjs.unix(user?.exp).diff(dayjs()) < 1
    //    isExpired ?  router.replace({ pathname: '/login' }):  router.replace({ pathname: '/timesheet/timeSheets' })
    //   } else {
    //     router.replace({ pathname: '/login' })
    //   }
    // }
  }, [])

  return <></>
}

Home.getLayout = page => <BlankLayout>{page}</BlankLayout>
export default Home
