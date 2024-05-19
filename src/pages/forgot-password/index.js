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
import { resetForgotPassword } from 'src/store/authentication/register'

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
import { BackdropSpinner } from 'src/@core/components/spinner'
import { customSuccessToast, customErrorToast } from 'src/helpers/custom-components/toasts'
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
  display: 'flex',
  fontSize: '0.875rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

const defaultValues = {
  passowrd: '',
  confirmPassword: '',
  isAgree: false
}

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(5, 'Password must be at least 5 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  isAgree: yup.boolean().required()
})

const ForgotPassword = ({ data, secretString }) => {
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
      Object.keys(JSON.parse(data)).length > 0 &&
        reset({
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

  const onSubmit = async value => {
    setLoading(true)
    const pass = value.confirmPassword

    await dispatch(resetForgotPassword({ base64String: secretString, pass: pass }))
      .then(unwrapResult)
      .then(res => {
        setLoading(false)
        if (res?.hasError) {
          customErrorToast(res.responseMessage)
        } else {
          customSuccessToast(res.responseMessage)
          reset()
        }
      })
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
              <Typography variant='h5'></Typography>
            </Box>
            {/* <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}> */}
            <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <TypographyStyled variant='h5'>Reset Password 🔒</TypographyStyled>
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
                          label='New Password'
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

              <Button
                fullWidth
                size='large'
                type='submit'
                variant='contained'
                disabled={!isDisabled}
                sx={{ mb: 7, mt:7 }}
              >
                Reset Password
              </Button>
              <LinkStyled href='/login'>
                <Icon icon='mdi:chevron-left' />
                <span>Back to login</span>
              </LinkStyled>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}
ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true

export default ForgotPassword
