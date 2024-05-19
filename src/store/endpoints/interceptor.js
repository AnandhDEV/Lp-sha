import axios from 'axios'
import { endpointURL, endpoints } from './endpoints'
import dayjs from 'dayjs'
import authConfig from 'src/configs/auth'
import jwt from 'jsonwebtoken'

export const base = {
  // url: 'https://lp-webapi-uat.azurewebsites.net/' //--------UAT-------
  url: process.env.NEXT_PUBLIC_API_URL //----------DEV-----------,

}

// export const identifyURL = () => {
//   if (process.env.NODE_ENV === 'development') {
//     return base.dev
//   } else {
//     return base.url
//   }
// }

// let apiUrl

// if (process.env.NODE_ENV === 'development') {
//   apiUrl = process.env.NEXT_PUBLIC_API_URL_DEV // Development environment
// } else {
//   apiUrl = process.env.NEXT_PUBLIC_API_URL_UAT // UAT environment
// }

// const instance = axios.create({
//   // Your API base URL
//   baseURL: apiUrl
// })

const instance = axios.create({
  baseURL: base.url
})

const jwtConfig = {
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  expirationTime: process.env.NEXT_PUBLIC_JWT_EXPIRATION,
  refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET
}

instance.interceptors.request.use(
  async config => {
    const accessToken = localStorage.getItem('accessToken')
    config.headers.Authorization = `Bearer ${accessToken}`

    if (accessToken != null) {
      const oldTokenDecoded = jwt.decode(accessToken, { complete: true })
      const user = oldTokenDecoded.payload
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1

      if (isExpired) {
        localStorage.clear()
        window.location.href = '/login'
      }
    } else {
      localStorage.clear()
      window.location.href = '/login'
    }

    return config
  },
  err => {
    return Promise.reject(err)
  }
)

export default instance
