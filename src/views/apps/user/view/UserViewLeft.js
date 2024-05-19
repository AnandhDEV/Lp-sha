// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserSuspendDialog from 'src/views/apps/user/view/UserSuspendDialog'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { roles } from 'src/helpers/constants'
import { formatLocalDate } from 'src/helpers/dateFormats'
import { Autocomplete, Chip, FormHelperText } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import dynamic from 'next/dynamic'
import { UserEditDialog } from './UserEditDialog'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import CustomSkillPicker from 'src/views/components/autocomplete/CustomSkillPicker'
import { userRequest } from 'src/helpers/requests'
import { useDispatch, useSelector } from 'react-redux'
import {
  activateUser,
  fetchSkills,
  fetchUsers,
  resendEmail,
  setActivate,
  setActivateDialog,
  setSuspend,
  setSuspendDialogOpen,
  setUsers,
  updateUser
} from 'src/store/apps/user'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'
import { handleResponse, blobUrlToFile, base64ToFile } from 'src/helpers/helpers'
// import UserProfileUpload from './UserProfileUpload'

// const DynamicUserEditDialog = dynamic(() => import('src/views/apps/user/view/UserEditDialog'), {
//   ssr: false
// })

const data = {
  id: 1,
  role: 'admin',
  status: 'active',
  username: 'gslixby0',
  avatarColor: 'primary',
  country: 'El Salvador',
  company: 'Yotz PVT LTD',
  contact: '(479) 232-9151',
  currentPlan: 'enterprise',
  fullName: 'Daisy Patterson',
  email: 'gslixby0@abc.net.au',
  avatar: '/images/avatars/4.png'
}

const roleColors = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  costPerHour: 0,
  role: 0,
  reportingManager: {}
}

const mailValid = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

const schema = yup.object().shape({
  // fullName: yup.string().required(),
  firstName: yup.string().required('FirstName is required'),
  lastName: yup.string().required('LastName is required'),
  email: yup.string().email().required().matches(mailValid, 'Email is invalid'),
  costPerHour: yup.number().typeError('Cost field is required').required(),
  role: yup.number().required(),
  joinedDate: yup.date(),
  reportingManager: yup.object().required('Reporting Manager is required')
})

const UserViewLeft = ({ currentUser, rpm, index, updateUserData, setLoading, setRpm }) => {
  // ** States
  const [openEdit, setOpenEdit] = useState(false)
  const [openPlans, setOpenPlans] = useState(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false)
  const [isActivated, setisActivated] = useState(false)
  const [alertDialog, setalertDialog] = useState(false)
  const [skills, setSkills] = useState([])
  const [items, setItems] = useState(null)
  const [user, setUser] = useState(null)
  const [currentRole, setCurrentRole] = useState(null)
  const [profile, setProfile] = useState(null)
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    updateUserState()
  }, [store.isSuspended, store.isActivated])

  useEffect(() => {
    if (currentUser == null) {
      updateUserData()
    } else {
      setUser(currentUser)
      dispatch(setSuspend(false))
      dispatch(setActivate(false))
    }
  }, [currentUser])
  let fullName = `${user?.firstName} ${user?.lastName}`

  useEffect(() => {
    // if (profile != null) {
    //   const fetchData = async () => {
    //     const file =
    //       profilePhoto &&
    //       (await blobUrlToFile(profilePhoto, profilePictureName || 'profile Picture.jpg'))

    //     setProfile(file)
    //   }
    //   fetchData()
    // }
    user &&
      reset({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user.email,
        costPerHour: user.costPerHour,
        role: user.roleId,
        joinedDate: new Date(user.joinedDate),
        reportingManager: rpm
      })
    setSkills(user?.userskill || [])
    store.skills == null && dispatch(fetchSkills())
  }, [user])

  useEffect(() => {
    dispatch(fetchUsers())
    const items = store.skills?.filter(u => !skills.some(o => o.id === u.id)) || []
    setItems(items)
  }, [skills])

  // Handle Edit dialog
  const handleEditClickOpen = () => {
    setOpenEdit(true)
    if (user && user?.profilePhoto) {
      const base64String = user.profilePhoto;
      const file = base64ToFile(base64String, user.profilePictureName)
      setProfile({ base64String, file })
    }
  }
  const handleEditClose = () => {
    setOpenEdit(false)
    reset()
  }

  //update user

  const updateUserState = () => {
    let _user = { ...user }
    if (store.isSuspended) {
      _user.isActive = false
    } else if (store.isActivated) {
      _user.isActive = true
    }
    setUser(_user)
  }
  //UPDATE Request STATE
  const updateState = newUser => {
    let _user = { ...user }
    _user = {
      ...user,
      ...newUser
    }
    setUser(_user)
    setRpm(store.users.find(x => x.id == newUser?.reportingManagerId))
  }
  const onSubmit = async data => {
    setLoading(true)
    setOpenEdit(false)
    const profilePhoto = profile?.length > 0 && profile[0].file
    const profilePictureName = profile?.length > 0 && profile[0].file.name
    const req = {
      ...user,
      ...data,
      skills: skills.map(o => o.id),
      reportingManagerId: data.reportingManager?.id,
      profilePhoto: profilePhoto,
      profilePictureName: profilePictureName
    }

    const request = userRequest(req)
    await dispatch(updateUser(request))
      .then(unwrapResult)
      .then(res => {
        handleResponse('update', res, updateState)
        setLoading(false)
      })
      .catch(err => {
      })
    setLoading(false)
  }

  const handleUser = () => {
    if (user.isActive) {
      dispatch(setSuspendDialogOpen(true))
    } else {
      dispatch(setActivateDialog(true))
    }
  }

  const handleSkills = values => {
    setSkills(values)
    const _items = [...items]
    const _index = _items.findIndex(o => o.id === (values[values.length - 1]?.id ?? null))
    _items.splice(_index, 1)
    setItems(_items)
  }

  const handleRemoveSkill = value => {
    const _skills = [...skills]
    const _index = _skills.findIndex(o => o.id == value.id)
    _skills.splice(_index, 1)
    setSkills(_skills)
  }
  const handleProfile = file => {
    setProfile(file)
  }
  const handleActivate = () => {
    setLoading(true)
    dispatch(setActivateDialog(false))
    dispatch(resendEmail(store.userId))
      .then(unwrapResult)
      .then(res => {
        if (!res.hasError) {
          // setisActivated(true)
          // setalertDialog(true)
          // dispatch(setActivate(true))
          dispatch(setSuspend(false))
          customSuccessToast(res.responseMessage)
          setLoading(false)
        }
      })
      .catch(err => {
        toast.error('Error while Sending mail')
        dispatch(setActivateDialog(false))
        setLoading(false)

        // setalertDialog(true)
      })
  }

  let currentUserRoleId
  useEffect(() => {
    const role = localStorage.getItem('roleId')
    setCurrentRole(role)
  }, [])

  if (user != null && Object.keys(user)?.length > 0) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent
              sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}
            >
              {/* {data.avatar ? (
                <CustomAvatar
                  src={data.avatar}
                  variant='rounded'
                  alt={data.fullName}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4 }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={data.avatarColor}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                >
                  {getInitials(fullName || 'Unknown')}
                </CustomAvatar>
              )} */}
              {user?.profilePhoto ? (
                <CustomAvatar
                  src={user.profilePhoto}
                  variant='rounded'
                  alt={data.fullName}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, objectFit: 'contain !important' }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={data.avatarColor}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem', }}
                >
                  {getInitials(fullName || 'Unknown')}
                </CustomAvatar>
              )}
              <Typography variant='h6' sx={{ mb: 4 }}>
                {fullName}
              </Typography>
              <CustomChip
                skin='light'
                size='small'
                label={roles[user?.roleId]?.name}
                color={roleColors[roles[user?.roleId]?.name?.toLowerCase()]}
                sx={{ textTransform: 'capitalize' }}
              />
            </CardContent>

            {/* <CardContent sx={{ my: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    sx={{ mr: 4, width: 44, height: 44 }}
                  >
                    <Icon icon='mdi:check' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6'>1.23k</Typography>
                    <Typography variant='body2'>Task Done</Typography>
                  </div>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    sx={{ mr: 4, width: 44, height: 44 }}
                  >
                    <Icon icon='mdi:star-outline' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6'>568</Typography>
                    <Typography variant='body2'>Project Done</Typography>
                  </div>
                </Box>
              </Box>
            </CardContent> */}

            <CardContent>
              <Grid className='d-flex justify-between'>
                <Typography variant='h6'>Details</Typography>
              </Grid>
              <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
              <Box sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                    Username:
                  </Typography>
                  <Typography variant='body2'> {fullName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                    Email:
                  </Typography>
                  <Typography variant='body2'>{user.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                    Status:
                  </Typography>
                  <CustomChip
                    skin='light'
                    size='small'
                    label={user.isActive ? 'Active' : 'Inactive'}
                    color={user.isActive ? 'success' : 'error'}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                    Role:
                  </Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {roles[user.roleId]?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                    Cost Per Hour:
                  </Typography>
                  <Typography variant='body2'>{user.costPerHour}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                    Reporting Manager:
                  </Typography>
                  <Typography variant='body2'>
                    {rpm && `${rpm.firstName} ${rpm.lastName}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                    Skills:
                  </Typography>
                  <Typography variant='body2'>
                    {user.userskill.map(o => o.skillName)?.join(', ')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                    Joined Date:
                  </Typography>
                  <Typography variant='body2'>
                    {formatLocalDate(new Date(user.joinedDate))}
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                disabled={currentRole === '4'}
                color='error'
                variant='outlined'
                onClick={handleUser}
              >
                {user.isActive ? 'Suspend' : 'Resend-Email'}
              </Button>
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                Edit
              </Button>
            </CardActions>

            <Dialog
              open={openEdit}
              onClose={handleEditClose}
              aria-labelledby='user-view-edit'
              aria-describedby='user-view-edit-description'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 700 } }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle
                  id='user-view-edit'
                  sx={{
                    textAlign: 'center',
                    fontSize: '1.5rem !important',
                    px: theme => [
                      `${theme.spacing(5)} !important`,
                      `${theme.spacing(15)} !important`
                    ],
                    pt: theme => [
                      `${theme.spacing(8)} !important`,
                      `${theme.spacing(12.5)} !important`
                    ]
                  }}
                >
                  Edit User Information
                </DialogTitle>
                <DialogContent
                  sx={{
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [
                      `${theme.spacing(5)} !important`,
                      `${theme.spacing(15)} !important`
                    ]
                  }}
                >
                  <DialogContentText
                    variant='body2'
                    id='user-view-edit-description'
                    sx={{ textAlign: 'center', mb: 7 }}
                  >
                    Updating user details will receive a privacy audit.
                  </DialogContentText>

                  <Grid container spacing={6}>
                    {/* <Grid item xs={12} sm={12}>
                      <FormControl fullWidth>
                        <Typography variant='body1' sx={{ pb: 4 }}>
                          Profile Photo
                        </Typography>
                        <UserProfileUpload profile={profile} user={user} handleProfile={handleProfile} />

                      </FormControl>
                    </Grid> */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='firstName'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField value={value} label='FirstName' onChange={onChange} autoComplete='off' />
                          )}
                        />
                        {errors.firstName && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.firstName.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='lastName'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField value={value} label='LastName' onChange={onChange} autoComplete='off' />
                          )}
                        />
                        {errors.lastName && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.lastName.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='email'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              value={value}
                              type='email'
                              label='Email'
                              onChange={onChange}
                              autoComplete='off'
                              disabled={currentRole === '4'}
                            />
                          )}
                        />
                        {errors.email && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.email.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id='role-id'>Role</InputLabel>
                        <Controller
                          name='role'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Select
                              label='Role'
                              labelId='role-id'
                              defaultValue={user.roleId}
                              value={value}
                              onChange={onChange}
                              autoComplete='off'
                              disabled={currentRole === '4'}
                            >
                              {Object.keys(roles).map((key, i) => (
                                <MenuItem key={i} value={key}>
                                  <CustomChip
                                    size='small'
                                    label={roles[key].name}
                                    skin='light'
                                    sx={{ color: roles[key].color }}
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                      {errors.role && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.role.message}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='costPerHour'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              fullWidth
                              type='number'
                              value={value}
                              onChange={onChange}
                              autoComplete='off'
                              label='Cost Per Hour'
                              defaultValue={user.costPerHour}
                              onKeyDown={e => {
                                if (e.key === '-' || e.key === '+') {
                                  e.preventDefault()
                                }
                              }}
                              inputProps={{ min: 0 }}
                              disabled={currentRole === '4'}
                            />
                          )}
                        />
                      </FormControl>
                      {errors.costPerHour && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.costPerHour.message}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                        <Controller
                          name='joinedDate'
                          control={control}
                          rules={{ required: false }}
                          render={({ field: { value, onChange } }) => (
                            <DatePicker
                              selected={value}
                              id='date-range-picker'
                              onChange={onChange}
                              autoComplete='off'
                              disabled={currentRole === '4'}
                              shouldCloseOnSelect
                              popperPlacement='auto'
                              customInput={<CustomInput label='Joined Date' />}
                            />
                          )}
                        />
                      </DatePickerWrapper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name='reportingManager'
                          control={control}
                          rules={{ required: store.users?.length > 0 ? true : false }}
                          render={({ field }) => (
                            <Autocomplete
                              options={store.users?.filter(
                                option => option.id !== currentUser.id && option.isActive
                              ).sort(function (a, b) {
                                return a.firstName.localeCompare(b.firstName);
                              })}
                              id='autocomplete-limit-tags'
                              getOptionLabel={option =>
                                option?.fullName ? option.fullName : option
                              }
                              defaultValue={store.users[index]}
                              value={field.value}
                              disabled={currentRole === '4'}
                              autoComplete='off'
                              onChange={(e, v) => {
                                field.onChange(v)
                              }}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  error={Boolean(errors.reportingManager)}
                                  label='Reporting Manager'
                                />
                              )}
                            />
                          )}
                        />
                        {errors.reportingManager && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.reportingManager.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <CustomSkillPicker
                        values={skills}
                        items={items?.length > 0 ? items : store.skills || []}
                        label='Skills'
                        autoComplete='off'
                        setSkills={handleSkills}
                        onRemove={handleRemoveSkill}
                        originalItems={store.skills ? store.skills : []}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions
                  sx={{
                    justifyContent: 'center',
                    px: theme => [
                      `${theme.spacing(5)} !important`,
                      `${theme.spacing(15)} !important`
                    ],
                    pb: theme => [
                      `${theme.spacing(8)} !important`,
                      `${theme.spacing(12.5)} !important`
                    ]
                  }}
                >
                  <Button variant='outlined' color='secondary' onClick={handleEditClose}>
                    Cancel
                  </Button>
                  <Button variant='contained' type='submit' sx={{ mr: 2 }}>
                    Submit
                  </Button>
                </DialogActions>
              </form>
            </Dialog>

            <Dialog
              fullWidth
              open={store.activateDialog}
              onClose={() => dispatch(setActivateDialog(false))}
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
            >
              <DialogContent
                sx={{
                  px: theme => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`
                  ],
                  pt: theme => [
                    `${theme.spacing(8)} !important`,
                    `${theme.spacing(12.5)} !important`
                  ]
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    '& svg': { mb: 8, color: 'warning.main' }
                  }}
                >
                  <Icon icon='mdi:alert-circle-outline' fontSize='5.5rem' />
                  <Typography variant='h4' sx={{ mb: 5, color: 'text.secondary' }}>
                    Are you sure?
                  </Typography>
                  {/* <Typography>You won't be able to revert </Typography> */}
                </Box>
              </DialogContent>
              <DialogActions
                sx={{
                  justifyContent: 'center',
                  px: theme => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`
                  ],
                  pb: theme => [
                    `${theme.spacing(8)} !important`,
                    `${theme.spacing(12.5)} !important`
                  ]
                }}
              >
                <Button variant='contained' sx={{ mr: 2 }} onClick={handleActivate}>
                  Yes, Resend Email
                </Button>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => {
                    dispatch(setActivateDialog(false))
                  }}
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

            <UserSuspendDialog
              open={store.suspendDialogOpen}
              setOpen={value => dispatch(setSuspendDialogOpen(value ? true : false))}
            />
            <UserSubscriptionDialog
              open={subscriptionDialogOpen}
              setOpen={setSubscriptionDialogOpen}
            />

            <Dialog
              fullWidth
              open={alertDialog}
              onClose={() => setalertDialog(false)}
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
            >
              <DialogContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    '& svg': {
                      mb: 14,
                      color: isActivated ? 'success.main' : 'error.main'
                    }
                  }}
                >
                  <Icon
                    fontSize='5.5rem'
                    icon={isActivated ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}
                  />
                  <Typography variant='h4' sx={{ mb: 8 }}>
                    {isActivated ? 'Mail resent!' : 'Cancelled'}
                  </Typography>
                  <Typography>{isActivated ? 'Mail Resent.' : 'Cancelled :)'}</Typography>
                </Box>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant='contained' color='success' onClick={() => setalertDialog(false)}>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        </Grid>

        {/* <Grid item xs={12}>
          <Card
            sx={{ boxShadow: 'none', border: theme => `2px solid ${theme.palette.primary.main}` }}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                pb: '0 !important',
                justifyContent: 'space-between'
              }}
            >
              <CustomChip skin='light' size='small' color='primary' label='Standard' />
              <Box sx={{ display: 'flex', position: 'relative' }}>
                <Typography variant='h6' sx={{ color: 'primary.main', alignSelf: 'flex-end' }}>
                  $
                </Typography>
                <Typography
                  variant='h3'
                  sx={{
                    color: 'primary.main'
                  }}
                >
                  99
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', alignSelf: 'flex-end' }}>
                  / month
                </Typography>
              </Box>
            </CardContent>

            <CardContent>
              <Box sx={{ mt: 6, mb: 5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    mb: 3.5,
                    alignItems: 'center',
                    '& svg': { mr: 2, color: 'grey.300' }
                  }}
                >
                  <Icon icon='mdi:circle' fontSize='0.5rem' />
                  <Typography variant='body2'>10 Users</Typography>
                </Box>
                <Box
                  sx={{
                    mb: 3.5,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 2, color: 'grey.300' }
                  }}
                >
                  <Icon icon='mdi:circle' fontSize='0.5rem' />
                  <Typography variant='body2'>Up to 10GB storage</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 2, color: 'grey.300' }
                  }}
                >
                  <Icon icon='mdi:circle' fontSize='0.5rem' />
                  <Typography variant='body2'>Basic Support</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 1.5, justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                  Days
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                  26 of 30 Days
                </Typography>
              </Box>
              <LinearProgress
                value={86.66}
                variant='determinate'
                sx={{ height: 6, borderRadius: '5px' }}
              />
              <Typography variant='caption' sx={{ mt: 1.5, mb: 6, display: 'block' }}>
                4 days remaining
              </Typography>
              <Button variant='contained' sx={{ width: '100%' }} onClick={handlePlansClickOpen}>
                Upgrade Plan
              </Button>
            </CardContent>

            <Dialog
              open={openPlans}
              onClose={handlePlansClose}
              aria-labelledby='user-view-plans'
              aria-describedby='user-view-plans-description'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
            >
              <DialogTitle
                id='user-view-plans'
                sx={{
                  textAlign: 'center',
                  fontSize: '1.5rem !important',
                  px: theme => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`
                  ],
                  pt: theme => [
                    `${theme.spacing(8)} !important`,
                    `${theme.spacing(12.5)} !important`
                  ]
                }}
              >
                Upgrade Plan
              </DialogTitle>

              <DialogContent
                sx={{
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <DialogContentText
                  variant='body2'
                  sx={{ textAlign: 'center' }}
                  id='user-view-plans-description'
                >
                  Choose the best plan for the user.
                </DialogContentText>
              </DialogContent>

              <DialogContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: ['wrap', 'nowrap'],
                  pt: theme => `${theme.spacing(2)} !important`,
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <FormControl fullWidth size='small' sx={{ mr: [0, 3], mb: [3, 0] }}>
                  <InputLabel id='user-view-plans-select-label'>Choose Plan</InputLabel>
                  <Select
                    label='Choose Plan'
                    defaultValue='Standard'
                    id='user-view-plans-select'
                    labelId='user-view-plans-select-label'
                  >
                    <MenuItem value='Basic'>Basic - $0/month</MenuItem>
                    <MenuItem value='Standard'>Standard - $99/month</MenuItem>
                    <MenuItem value='Enterprise'>Enterprise - $499/month</MenuItem>
                    <MenuItem value='Company'>Company - $999/month</MenuItem>
                  </Select>
                </FormControl>
                <Button variant='contained' sx={{ minWidth: ['100%', 0] }}>
                  Upgrade
                </Button>
              </DialogContent>

              <Divider sx={{ m: '0 !important' }} />

              <DialogContent
                sx={{
                  pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(8)} !important`],
                  px: theme => [
                    `${theme.spacing(5)} !important`,
                    `${theme.spacing(15)} !important`
                  ],
                  pb: theme => [
                    `${theme.spacing(8)} !important`,
                    `${theme.spacing(12.5)} !important`
                  ]
                }}
              >
                <Typography sx={{ fontWeight: 500, mb: 2, fontSize: '0.875rem' }}>
                  User current plan is standard plan
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: ['wrap', 'nowrap'],
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ mr: 3, display: 'flex', ml: 2.4, position: 'relative' }}>
                    <Sup>$</Sup>
                    <Typography
                      variant='h3'
                      sx={{
                        mb: -1.2,
                        lineHeight: 1,
                        color: 'primary.main',
                        fontSize: '3rem !important'
                      }}
                    >
                      99
                    </Typography>
                    <Sub>/ month</Sub>
                  </Box>
                  <Button
                    color='error'
                    variant='outlined'
                    sx={{ mt: 2 }}
                    onClick={() => setSubscriptionDialogOpen(true)}
                  >
                    Cancel Subscription
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>
          </Card>
        </Grid> */}
      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft
