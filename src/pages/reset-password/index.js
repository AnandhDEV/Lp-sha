// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { forgotPassword } from 'src/store/authentication/register'
import { useDispatch, useSelector } from 'react-redux'
import { BackdropSpinner } from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import { customSuccessToast, customErrorToast } from 'src/helpers/custom-components/toasts'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useState } from 'react'
import { FormHelperText } from '@mui/material'
import { set } from 'date-fns'

// Styled Components
const ForgotPasswordIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  maxWidth: '53.125rem',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '35rem'
  },
  [theme.breakpoints.up('sm')]: {
    maxWidth: '40rem'
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('xl')]: {
    width: '100%'
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  fontSize: '0.875rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

const ResetPassword = () => {
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()

  //** states */

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()

  // ** Vars
  const { skin } = settings
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const handleEmailChange = e => {
    const value = e.target.value
    setEmail(value)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailError(!emailRegex.test(value))
  }

  const imageSource =
    skin === 'bordered'
      ? 'auth-v2-forgot-password-illustration-bordered'
      : 'auth-v2-forgot-password-illustration'

  const onSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    await dispatch(forgotPassword(email))
      .then(unwrapResult)
      .then(res => {
        setLoading(false)
        if (res?.hasError) {
          customErrorToast(res.responseMessage)
        } else {
          customSuccessToast(res.responseMessage)
        }
      })
      setEmail('')
  }

  return (
    <>
      {isLoading && <BackdropSpinner />}
      <Box className='content-right'>
        {!hidden ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ForgotPasswordIllustrationWrapper>
              <ForgotPasswordIllustration
                alt='forgot-password-illustration'
                src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
              />
            </ForgotPasswordIllustrationWrapper>
            <FooterIllustrationsV2 />
          </Box>
        ) : null}
        <RightWrapper
          sx={
            skin === 'bordered' && !hidden
              ? { borderLeft: `1px solid ${theme.palette.divider}` }
              : {}
          }
        >
          <Box
            sx={{
              p: 12,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'background.paper'
            }}
          >
            <BoxWrapper>
              <Box
                sx={{
                  top: 30,
                  left: 40,
                  display: 'flex',
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={
                    theme.palette.mode === 'dark' || theme.palette.mode == 'semi-dark'
                      ? '/images/leanprofit-white.png'
                      : '/images/leanprofit-purple.png'
                  }
                  alt='Leanprofit'
                  height={40}
                />
              </Box>
              <Box sx={{ mb: 6 }}>
                <TypographyStyled variant='h5'>Forgot Password? 🔒</TypographyStyled>
                <Typography variant='body2'>
                  Enter your email and we&prime;ll send you instructions to reset your password
                </Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={onSubmit}>
                <TextField
                  autoFocus
                  type='email'
                  label='Email'
                  value={email}
                  onChange={handleEmailChange}
                  sx={{ display: 'flex' }}
                  placeholder='example@mail.com'
                  error={emailError}
                />
                {/* {
                !email && email?.length >=0 &&  <FormHelperText sx={{ color: 'error.main' }}>Email is required</FormHelperText>
              } */}
                {emailError && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    Invalid email address
                  </FormHelperText>
                )}

                <Button
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  disabled={emailError || email?.length === 0}
                  sx={{ mt: 4, mb: 5.25 }}
                >
                  Send reset link
                </Button>
                <Typography
                  variant='body2'
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <LinkStyled href='/login'>
                    <Icon icon='mdi:chevron-left' />
                    <span>Back to login</span>
                  </LinkStyled>
                </Typography>
              </form>
            </BoxWrapper>
          </Box>
        </RightWrapper>
      </Box>
    </>
  )
}
ResetPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ResetPassword.guestGuard = true

export default ResetPassword
