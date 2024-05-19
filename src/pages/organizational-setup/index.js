// ** React Imports
import { useState } from 'react'

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
import { Autocomplete, FormHelperText, Grid, MenuItem, Select } from '@mui/material'
import { handleResponse } from 'src/helpers/helpers'

// import { error } from '@babel/eslint-parser/lib/convert/index.cjs'
import { signUpUser } from 'src/store/authentication/register'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import countries from 'src/helpers/countries.json'
import dialCodes from 'src/helpers/dialCodes.json'
import states from 'src/helpers/states.json'
import currencies from 'src/helpers/currencies.json'
import { addOrgs } from 'src/store/apps/organization'
import { organizationRequest } from 'src/helpers/requests'
import toast from 'react-hot-toast'
import { unwrapResult } from '@reduxjs/toolkit'
import SimpleBackdrop, { BackdropSpinner } from 'src/@core/components/spinner'
import { fetchUserByEmail, setUserId, setUserRoleId } from 'src/store/apps/user'
import { customErrorToast } from 'src/helpers/custom-components/toasts'
import { NODATA, ORGANIZATIOn_SIZE } from 'src/helpers/constants'
import { useAuth } from 'src/hooks/useAuth'

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
    maxWidth: 700
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
  name: '',
  code: '',
  phone: '',
  orgSize: 0,
  address: '',
  country: '',
  state: '',
  city: '',
  zipcode: ''
}

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schema = yup.object().shape({
  name: yup.string().required('Organization name is required'),
  website: yup.string().url('Invalid URL format').notRequired(),
  phone: yup
    .string()
    .required('Phone number is required')
    .typeError('Enter valid phone number')
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(10, 'too short')
    .max(10, 'too long'),
  orgSize: yup.string().notRequired(),
  address: yup.string().required('Address is required'),
  code: yup.object().required('Country Code is required').typeError('Country Code is not valid'),
  country: yup.object().required('Country is required').typeError('Country is not valid'),
  city: yup.string().required('City is required').typeError('City is not valid'),
  state: yup.object().required('State is required').typeError('State is not valid'),
  zipcode: yup.string().max(6, 'Invalid Zipcode').required('ZIP code is required')
})

const OrganizationalSetup = () => {
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const [isLoading, setLoading] = useState(false)
  const [isDisable, setDisable] = useState(false)

  const dispatch = useDispatch()
  const router = useRouter()

  const {
    register,
    reset,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const auth = useAuth()
  const roleId = auth?.user?.roleId

  const updateorg = newReq => {
    try {
      if (newReq) {
        const userData = JSON.parse(localStorage.getItem('userData'))
        localStorage.setItem('userData', JSON.stringify({ ...userData, org: 'true' }))
        const orgUpdatedUserData = JSON.parse(localStorage.getItem('userData'))

        if (JSON.parse(orgUpdatedUserData.org)) {
          dispatch(fetchUserByEmail(userData?.user))
            .then(unwrapResult)
            .then(res => {
              setLoading(false)
              if (res.hasError) {
                customErrorToast(res.responseMessage)
                setDisable(false)

                return
              } else {
                dispatch(setUserId(res?.result?.id))
                localStorage.setItem('userId', res?.result?.id)
                const isUser = res?.result?.roleId == 4
                localStorage.setItem('isUser', isUser)
                setDisable(true)
                router.replace({
                  pathname: '/timesheet/timeSheets/'
                })
              }
            })
        }
      } else {
        setDisable(false)
        customErrorToast('Problem Occurred! Please Try again')
        router.replace({
          pathname: '/organizational-setup'
        })
        setLoading(false)
      }
    } catch (error) {
      setDisable(false)
      customErrorToast(NODATA.error)
      setLoading(false)
    }
  }

  const onSubmit = data => {
    try {
      setLoading(true)
      const req = { ...data }
      const phoneNumber = watch('code')?.dial_code.concat(watch('phone'))
      const request = organizationRequest({ ...req, phone: phoneNumber })

      dispatch(addOrgs(request))
        .then(unwrapResult)
        .then(res => {
          if (res != '' && !res?.hasError) {
            handleResponse('create', res, updateorg)
          } else {
            customErrorToast('Problem Occurred while creating Organization')
          }
          setLoading(false)
        })
        .catch(error => {
          setDisable(false)
          customErrorToast(error?.message)
          setLoading(false)
        })
    } catch (error) {
      setDisable(false)
      setLoading(false)

      return NODATA.error
    }
  }

  // ** Vars
  const { skin } = settings

  const imageSource =
    skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'

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
            <Box sx={{ mb: 10 }}>
              <Typography variant='h5'>Welcome to LeanProfit!</Typography>
            </Box>
            <br />
            <Grid
              container
              spacing={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container rowSpacing={6} columnSpacing={4}>
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='name'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            label='Organization name *'
                            variant='outlined'
                            onChange={onChange}
                            error={Boolean(errors.name)}
                          />
                        )}
                      />
                      {errors.name && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.name.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='website'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            label='Website URL (Optional)'
                            variant='outlined'
                            onChange={onChange}
                          />
                        )}
                      />
                      {errors.website && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.website.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item lg={3} md={3} sm={3} xs={4}>
                    <FormControl fullWidth>
                      <Controller
                        name='code'
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            options={dialCodes}
                            getOptionLabel={o => (o ? `${o?.code}(${o?.dial_code})` : '')}
                            id='autocomplete-limit-tags'
                            onChange={(e, v) => {
                              field.onChange(v)
                            }}
                            value={field.value}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Code *'
                                placeholder='Code'
                                error={Boolean(errors.code)}
                              />
                            )}
                          />
                        )}
                      />
                      {errors.code && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.code.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item lg={6} md={6} sm={6} xs={8}>
                    <FormControl fullWidth>
                      <Controller
                        name='phone'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <TextField
                              value={value}
                              type='number'
                              label='Phone number *'
                              variant='outlined'
                              onChange={onChange}
                              error={Boolean(errors.phone)}
                            />
                          </>
                        )}
                      />
                      {errors.phone && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.phone.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item lg={3} md={3} sm={3} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-select-small-label'>Organization Size</InputLabel>
                      <Controller
                        name='orgSize'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Select
                            value={value}
                            label='Organization Size'
                            onChange={onChange}
                            error={Boolean(errors.orgSize)}
                            labelId='demo-select-small-label'
                            aria-describedby='stepper-linear-client'
                          >
                            {ORGANIZATIOn_SIZE.map((size, key) => (
                              <MenuItem key={key} value={size}>
                                {size}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.orgSize && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.orgSize.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='address'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            label='Address *'
                            variant='outlined'
                            minRows={3}
                            multiline
                            onChange={onChange}
                            error={Boolean(errors.address)}
                          />
                        )}
                      />
                      {errors.address && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.address.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='country'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Autocomplete
                            options={countries}
                            getOptionLabel={o => o.name}
                            id='autocomplete-limit-tags'
                            onChange={(e, data) => onChange(data)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                error={Boolean(errors.country)}
                                label='Country *'
                                placeholder='Country'
                              />
                            )}
                          />
                        )}
                      />
                      {errors.country && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.country.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='state'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Autocomplete
                            options={
                              watch('country') != null
                                ? states.filter(o => o.country_code === watch('country').code)
                                : []
                            }
                            getOptionLabel={o => o.name || o}
                            id='autocomplete-limit-tags'
                            onChange={(e, data) => onChange(data)}
                            disabled={!watch('country')}
                            renderInput={params => (
                              <TextField
                                {...params}
                                disabled={!watch('country')}
                                error={Boolean(errors.state)}
                                label='State *'
                                placeholder='State'
                              />
                            )}
                          />
                        )}
                      />
                      {errors.state && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.state.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='city'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            disabled={!watch('state')}
                            error={Boolean(errors.city)}
                            label='City *'
                            placeholder='City'
                            {...field}
                          />
                        )}
                      />
                      {errors.city && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.city.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='zipcode'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            type='number'
                            label='ZipCode *'
                            variant='outlined'
                            onChange={onChange}
                            error={Boolean(errors.zipcode)}
                          />
                        )}
                      />
                      {errors.zipcode && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.zipcode.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} className='flex-right'>
                    <Grid item md={6} sm={6} xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant='body2' >
                        <LinkStyled
                          href='/login'
                          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Icon icon='mdi:chevron-left' />
                          <span>Back to login</span>
                        </LinkStyled>
                      </Typography>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        disabled={isDisable}
                      >
                        Create Organization
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}
OrganizationalSetup.getLayout = page => <BlankLayout>{page}</BlankLayout>
OrganizationalSetup.guestGuard = true

export default OrganizationalSetup
