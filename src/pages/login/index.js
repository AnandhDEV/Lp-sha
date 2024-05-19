// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import jwt from 'jsonwebtoken'

// ** Hooks
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useRouter } from 'next/router'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import axios from 'axios'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import toast from 'react-hot-toast'
import { base, identifyURL } from 'src/store/endpoints/interceptor'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserByEmail, setUserId, setUserRoleId } from 'src/store/apps/user'
import SimpleBackdrop, { BackdropSpinner } from 'src/@core/components/spinner'
import { customErrorToast } from 'src/helpers/custom-components/toasts'
import { fetchUsers } from 'src/store/absence-management'
import { unwrapResult } from '@reduxjs/toolkit'
import { NODATA } from 'src/helpers/constants'
import { loginUser } from 'src/store/authentication/register'
import { setRole } from 'src/store/authentication/register'

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const LoginIllustration = styled('img')(({ theme }) => ({
  maxWidth: '48rem',
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
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const mailValid = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

const schema = yup.object().shape({
  email: yup.string().email().required('Email is required').typeError('Please enter valid email').matches(mailValid, "Email is invalid"),
  password: yup.string().required('Password is required')
})

const defaultValues = {
  email: '',
  password: ''
}

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [disable, setDisable] = useState(false)

  // ** Hooks
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  const [user, setUser] = useState(null)

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    setLoading(true)
    setDisable(true)
    try {
      const response = await dispatch(loginUser(data))
      const { payload } = response
      const { result } = payload
      if (payload.hasError) {
        customErrorToast(payload.responseMessage)
        setLoading(false)
        setDisable(false)
      } else {
        window.localStorage.setItem('accessToken', result.accessToken)
        const userData = jwt.decode(result.accessToken, { complete: true }).payload
        window.localStorage.setItem('userData', JSON.stringify(userData))
        window.localStorage.setItem('roleId', userData?.roleId)
        setUser(userData)

        if (result.accessToken) {
          if (JSON.parse(userData.org)) {
            dispatch(fetchUserByEmail(userData?.user))
              .then(unwrapResult)
              .then(res => {
                dispatch(setUserRoleId(userData?.roleId))
                dispatch(setUserId(res.result?.id))
                localStorage.setItem('userId', res?.result?.id)
                const isUser = res?.result?.roleId == 4
                localStorage.setItem('isUser', isUser)
                router.push({
                  pathname: '/timesheet/timeSheets/'
                }
                )
                // .then(() => {
                //   router.reload();
                // });
                setLoading(false)
              })
          } else {
            router.replace({
              pathname: '/organizational-setup'
            })
            setLoading(false)
          }
        } else {
          setLoading(false)
          setDisable(false)
          toast.error('Login Failed')
        }
      }
    } catch (error) {
      customErrorToast(NODATA.error)
      setLoading(false)
      setDisable(false)
    }
  }

  const imageSource =
    skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  return (
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
          <LoginIllustrationWrapper>
            <LoginIllustration
              alt='login-illustration'
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </LoginIllustrationWrapper>
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper
        sx={
          skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}
        }
      >
        {loading && <BackdropSpinner />}
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
              <TypographyStyled variant='h5'>
                Welcome to {themeConfig.templateName}! 👋🏻
              </TypographyStyled>
              <Typography variant='body2'>
                Please sign-in to your account and start the adventure
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder='example@mail.com'
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.email.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                            <Icon
                              icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                              fontSize={20}
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Box
                sx={{
                  mt: 3,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between'
                }}
              >
                {/* <FormControlLabel
                  label='Remember Me'
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                  }
                /> */}
                <LinkStyled href='/reset-password'>Forgot Password?</LinkStyled>
              </Box>
              <Button
                fullWidth
                size='large'
                type='submit'
                variant='contained'
                disabled={disable}
                sx={{ mb: 7 }}
              >
                Login
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                <Typography variant='body2' sx={{ mr: 2 }}>
                  New on our platform?
                </Typography>
                <Typography variant='body2'>
                  <LinkStyled href='/register'>Create an account</LinkStyled>
                </Typography>
              </Box>
              {/* <Divider sx={{ my: theme => `${theme.spacing(5)} !important` }}>or</Divider>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton
                  href='/'
                  component={Link}
                  sx={{ color: '#497ce2' }}
                  onClick={e => e.preventDefault()}
                >
                  <Icon icon='mdi:facebook' />
                </IconButton>
                <IconButton
                  href='/'
                  component={Link}
                  sx={{ color: '#1da1f2' }}
                  onClick={e => e.preventDefault()}
                >
                  <Icon icon='mdi:twitter' />
                </IconButton>
                <IconButton
                  href='/'
                  component={Link}
                  onClick={e => e.preventDefault()}
                  sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300') }}
                >
                  <Icon icon='mdi:github' />
                </IconButton>
                <IconButton
                  href='/'
                  component={Link}
                  sx={{ color: '#db4437' }}
                  onClick={e => e.preventDefault()}
                >
                  <Icon icon='mdi:google' />
                </IconButton>
              </Box> */}
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
