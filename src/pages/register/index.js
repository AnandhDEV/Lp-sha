// ** React Imports
import { useRef, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
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
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'

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

import * as yup from 'yup'
import { FormHelperText } from '@mui/material'

// import { error } from '@babel/eslint-parser/lib/convert/index.cjs'
import { signUpUser } from 'src/store/authentication/register'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import jwt from 'jsonwebtoken'
import SimpleBackdrop, { BackdropSpinner } from 'src/@core/components/spinner'
import { useRouter } from 'next/router'
import { unwrapResult } from '@reduxjs/toolkit'
import user from 'src/store/apps/user'
import { customErrorToast } from 'src/helpers/custom-components/toasts'

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const RegisterIllustration = styled('img')(({ theme }) => ({
  maxWidth: '46rem',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '35rem'
  },
  [theme.breakpoints.up('sm')]: {
    maxWidth: '40rem'
  }
}))

const TreeIllustration = styled('img')(({ theme }) => ({
  bottom: 0,
  left: '1.875rem',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    left: 0
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
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const defaultValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const mailValid = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

const schema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required').matches(mailValid, "Email is invalid"),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
})

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [Password, setPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const router = useRouter()
  const passwordRef = useRef(null)

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const dispatch = useDispatch()

  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const imageSource =
    settings.skin === 'bordered'
      ? 'auth-v2-register-illustration-bordered'
      : 'auth-v2-register-illustration'

  const onSubmit = async data => {
    try {
      setLoading(true)
      setDisabled(true)
      const body = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password
      }

      await schema.validate(data, { abortEarly: false })
      dispatch(signUpUser(body))
        .then(unwrapResult)
        .then(res => {
          const data = res
          setLoading(false)

          if (res?.hasError) {
            setDisabled(false)
            setLoading(false)
            customErrorToast(res?.responseMessage)
          } else {
            if (data?.result?.accessToken) {
              window.localStorage.setItem('accessToken', data?.result.accessToken)
              const userData = jwt.decode(data?.result.accessToken, { complete: true }).payload
              window.localStorage.setItem('userData', JSON.stringify(userData))
              window.localStorage.setItem('roleId', userData?.roleId)
              const isUser = userData?.roleId == 4
              localStorage.setItem('isUser', isUser)
              if (userData.org == null || userData.org == 'false') {
                router.replace({
                  pathname: '/organizational-setup'
                })
              } else {
                router.replace({
                  pathname: '/timesheet/timeSheets/'
                })
              }
            } else {
              setLoading(false)
              setDisabled(false)
              customErrorToast(res?.responseMessage)
            }
          }
        })
    } catch (error) {
      setDisabled(false)
      setLoading(false)
      console.error('Validation Error:', error)
    }
  }

  const handleClickShowPassword = event => {
    event.preventDefault()
    passwordRef.current.focus() // Focus the input after toggling
    setShowPassword(!showPassword)
  }
  const handleClickShowConfirmPassword = event => {
    event.preventDefault()
    passwordRef.current.focus() // Focus the input after toggling
    setPassword(!Password)
  }

  return (
    <Box className='content-right'>
      {isLoading && <BackdropSpinner />}
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
          <RegisterIllustrationWrapper>
            <RegisterIllustration
              alt='register-illustration'
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </RegisterIllustrationWrapper>
          <FooterIllustrationsV2
            image={<TreeIllustration alt='tree' src='/images/pages/tree-2.png' />}
          />
        </Box>
      ) : null}
      <RightWrapper
        sx={
          settings.skin === 'bordered' && !hidden
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
                  theme.palette.mode === 'dark'
                    ? '/images/leanprofit-white.png'
                    : '/images/leanprofit-purple.png'
                }
                alt='Leanprofit'
                height={40}
              />
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h5'>Welcome to LeanProfit!</Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth>
                <Controller
                  name='first_name'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      sx={{ mb: 4 }}
                      label='First name *'
                      variant='outlined'
                      {...field}
                      error={Boolean(errors.first_name)}
                      helperText={errors.first_name?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='last_name'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label='Last name *'
                      variant='outlined'
                      {...field}
                      error={Boolean(errors.last_name)}
                      helperText={errors.last_name?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label='Email *'
                      variant='outlined'
                      {...field}
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Password *
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      label='Password'
                      id='auth-login-v2-password'
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                      ref={passwordRef}
                      autoFocus
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton edge='end' onClick={handleClickShowPassword}>
                            <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                      error={Boolean(errors.password)}
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.password?.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel
                  htmlFor='auth-login-v2-confirm-password'
                  error={Boolean(errors.confirmPassword)}
                >
                  Confirm Password *
                </InputLabel>
                <Controller
                  name='confirmPassword'
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      label='Confirm Password'
                      id='auth-login-v2-confirm-password'
                      type={Password ? 'text' : 'password'}
                      {...field}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton edge='end' onClick={handleClickShowConfirmPassword}>
                            <Icon icon={Password ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                      error={Boolean(errors.confirmPassword)}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.confirmPassword?.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControlLabel
                control={<Checkbox defaultChecked onChange={e => setDisabled(!e.target.checked)} />}
                sx={{ mb: 4, mt: 1.5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                label={
                  <>
                    <Typography variant='body2' component='span'>
                      I agree to privacy policy & terms
                    </Typography>
                    {/* <LinkStyled href='/' onClick={e => e.preventDefault()}>
                      privacy policy & terms
                    </LinkStyled> */}
                  </>
                }
              />
              <Button
                fullWidth
                size='large'
                type='submit'
                disabled={disabled}
                variant='contained'
                sx={{ mb: 7 }}
              >
                Sign up
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
                  Already have an account?
                </Typography>
                <Typography variant='body2'>
                  <LinkStyled href='/login'>Sign in instead</LinkStyled>
                </Typography>
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}
Register.getLayout = page => <BlankLayout>{page}</BlankLayout>
Register.guestGuard = true

export default Register
