
// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'

// ** Store Imports
import { store } from 'src/store'
import { Provider, useDispatch } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Fake-DB Import
import 'src/@fake-db'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'src/iconify-bundle/icons-bundle-react'

// ** Global css styles
import '../../styles/globals.css'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import { useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/router'

import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'
import { setRole } from 'src/store/authentication/register'
import { withAuth } from 'src/helpers/urlBaseAuth'
import { AuthProvider } from 'src/context/AuthContext'
import { useAuth } from 'src/hooks/useAuth'

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false

  const getLayout =
    Component.getLayout ??
    (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)
  const setConfig = Component.setConfig ?? undefined

  const router = useRouter()
  const auth = useAuth()
  const Org = auth.user?.org


  useEffect(() => {
    const accessToken = window.localStorage.getItem('accessToken')
    const userData = jwt.decode(localStorage.getItem('accessToken'), { complete: true })?.payload
    const userOrg = userData?.org
    if (accessToken) {
      const oldTokenDecoded = jwt.decode(accessToken, { complete: true })
      const user = oldTokenDecoded?.payload
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1

      if (isExpired) {
        localStorage.clear()

        return router.replace({ pathname: '/login' })
      }

      //if (JSON.parse(user.org)) {
      if (userOrg) {
        router.replace({
          pathname: router.route == '/' ? '/timesheet/timeSheets/' : router.route
        })
      } else {
        router.replace({ pathname: '/organizational-setup' })
      }
    } else if (router.pathname.includes('register'.toLowerCase())) {
      router.replace({ pathname: '/register' })
    } else if (!router.pathname.includes('employee-signup'.toLowerCase())) {
      router.push('/login')
    }
  }, [])

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName} - Streamlining project profitability through AI-driven resource optimization and real-time insights.`}</title>
          <meta name='description' content='' />
          <meta name='keywords' content='LeanProfit' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
        <AuthProvider>
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    {getLayout(<Component {...pageProps} />)}
                    <ReactHotToast>
                      <Toaster
                        position={settings.toastPosition}
                        duration={settings.toastDuration}
                        toastOptions={{ className: 'react-hot-toast' }}
                      />
                    </ReactHotToast>
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </AuthProvider>
      </CacheProvider>
    </Provider>
  )
}

export default withAuth(App)


