// ** React Imports
import { useEffect, useState } from 'react'

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
import { FormHelperText, Grid } from '@mui/material'

// import { error } from '@babel/eslint-parser/lib/convert/index.cjs'
import { UserInvite, signUpUser } from 'src/store/authentication/register'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { signupRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { setDate } from 'date-fns'
import { useRouter } from 'next/router'
import { base } from 'src/store/endpoints/interceptor'
import axios from 'axios'
import { endpoints } from 'src/store/endpoints/endpoints'
import jwt from 'jsonwebtoken'
import SimpleBackdrop, { BackdropSpinner } from 'src/@core/components/spinner'
import { customSuccessToast } from 'src/helpers/custom-components/toasts'
import { fetchUserByEmail, setUserId, setUserRoleId } from 'src/store/apps/user'

// ** Styled Components
const EmployeeSignupIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const EmployeeSignupIllustration = styled('img')(({ theme }) => ({
  maxWidth: '46rem',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '35rem'
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
  firstName: '',
  lastName: '',
  email: '',
  passowrd: '',
  confirmPassword: '',
  isAgree: false
}

const mailValid = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string(),
  email: yup.string().email('Invalid email').required('Email is required').matches(mailValid, "Email is invalid"),
  password: yup
    .string()
    .required('Password is required')
    .min(5, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  isAgree: yup.boolean().required()
})

const EmployeeSignup = ({ data }) => {
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isDisabled, setDisabled] = useState(true)
  const [user, setData] = useState({})
  const dispatch = useDispatch()
  const router = useRouter()

  const {
    reset,
    register,
    control,
    setValue,
    watch,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    if (data) {
      setData(JSON.parse(data))
      const { firstName, lastName, email } = JSON.parse(data)
      Object.keys(JSON.parse(data)).length > 0 &&
        reset({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: '',
          confirmPassword: '',
          isAgree: false
        })
    }
  }, [data, reset])

  // ** Vars
  const { skin } = settings

  const imageSource =
    skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'

  const onSubmit = () => {
    setLoading(true)

    const req = { tenantId: user?.tenantId, ...watch() }
    const payload = {
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email,
      tenantId: user?.tenantId,
      password: req?.password,
      enCodedString: localStorage.getItem('slug')
    }

    dispatch(UserInvite(payload))
      .then(unwrapResult)
      .then(res => {
        if (!res.hasError) {
          Login({ email: req?.email, password: req?.password })
        } else {
          setLoading(false)
          toast.error(res.responseMessage)
        }
      })
  }

  const Login = async data => {
    const response = await axios.post(base.url + endpoints.login, data)
    const { result } = response.data

    if (result.accessToken && !response.data.hasError) {
      window.localStorage.setItem('accessToken', result.accessToken)
      const userData = jwt.decode(result.accessToken, { complete: true }).payload
      window.localStorage.setItem('userData', JSON.stringify(userData))
      window.localStorage.setItem('roleId', userData?.roleId)

      if (result.accessToken) {
        if (JSON.parse(userData.org)) {
          dispatch(fetchUserByEmail(userData?.user))
            .then(unwrapResult)
            .then(res => {
              dispatch(setUserRoleId(userData?.roleId))
              dispatch(setUserId(res.result.id))
              localStorage.setItem('userId', res?.result?.id)
              const isUser = res?.result?.roleId == 4
              localStorage.setItem('isUser', isUser)

              customSuccessToast('Signup Completed')

              router.replace({
                pathname: '/timesheet/timeSheets/'
              })

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
        toast.error('Login Failed')
      }
    } else {
      setLoading(false)
      toast.error('Login Failed')
    }
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
          <EmployeeSignupIllustrationWrapper>
            <EmployeeSignupIllustration
              alt='register-illustration'
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </EmployeeSignupIllustrationWrapper>
          <FooterIllustrationsV2
            image={<TreeIllustration alt='tree' src='/images/pages/tree-2.png' />}
          />
        </Box>
      ) : null}
      <RightWrapper
        sx={
          skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}
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
            {/* <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}> */}
            <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='firstName'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField disabled value={value} onChange={onChange} label='First name' />
                      )}
                    />
                    {errors.firstName && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.firstName.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='lastName'
                      control={control}
                      rules={{ required: false }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          disabled
                          value={value}
                          onChange={onChange}
                          label='Last name'
                          placeholder='(Optional)'
                        />
                      )}
                    />
                    {errors.lastName && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.lastName.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='email'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField disabled value={value} onChange={onChange} label='Email' />
                      )}
                    />
                    {errors.email && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.email.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='password'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          autoFocus
                          type={showPassword ? 'text' : 'password'}
                          value={value}
                          onChange={onChange}
                          label='Password'
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  onClick={() => setShowPassword(!showPassword)}
                                  onMouseDown={e => e.preventDefault()}
                                  aria-label='toggle password visibility'
                                >
                                  <Icon
                                    fontSize={20}
                                    icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                                  />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    />
                    {errors.password && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.password.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name='confirmPassword'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          autoFocus
                          type={showConfirm ? 'text' : 'password'}
                          value={value}
                          onChange={onChange}
                          label='Confirm Password'
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  onClick={() => setShowConfirm(!showConfirm)}
                                  onMouseDown={e => e.preventDefault()}
                                  aria-label='toggle password visibility'
                                >
                                  <Icon
                                    fontSize={20}
                                    icon={showConfirm ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                                  />
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      )}
                    />
                    {errors.confirmPassword && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.confirmPassword.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <FormControlLabel
                control={
                  <Checkbox checked={isDisabled} onChange={() => setDisabled(!isDisabled)} />
                }
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
                variant='contained'
                disabled={!isDisabled}
                sx={{ mb: 7 }}
              >
                Sign up
              </Button>

              {/* <Divider sx={{ my: theme => `${theme.spacing(5)} !important` }}>or</Divider> */}
              {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
EmployeeSignup.getLayout = page => <BlankLayout>{page}</BlankLayout>
EmployeeSignup.guestGuard = true

export default EmployeeSignup
