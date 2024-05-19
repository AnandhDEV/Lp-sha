// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addClients, fetchClients, setClients, updateClient } from 'src/store/clients'
import { Checkbox, FormControlLabel, Grid } from '@mui/material'
import ProfileUpload from '../add/ProfileUpload'
import { clientRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { blobUrlToFile, getBase64String, handleResponse } from 'src/helpers/helpers'
import { customErrorToast } from 'src/helpers/custom-components/toasts'
import EditProfileUpload from '../add/EditProfilephoto'
import { errorMessage } from 'src/helpers/constants'
import { BackdropSpinner } from 'src/@core/components/spinner'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const mailValid = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

const schema = yup.object().shape({
  // address: yup.string().required('Address is required'),
  address: yup.string().notRequired(),
  taxId: yup.string().notRequired(),
  email: yup.string().notRequired(),
  primaryContactName: yup.string().notRequired(),
  // taxId: yup.string().required('Tax Id is required'),
  // email: yup.string().required('Email is required').typeError('Email is invalid').matches(mailValid, "Email is invalid"),
  // primaryContactName: yup.string().required('Contact is required'),
  phoneNumber: yup.string().notRequired().nullable(),
  // .matches(phoneRegExp, 'Phone number is not valid')
  // .min(10, 'Too short')
  // .max(10, 'Too long'),
  companyName: yup
    .string()
    .required('Company name is required')
    .min(3, obj => showErrors('Company name', obj.value.length, obj.min)),
  isActive: yup.boolean().notRequired(),
  companyId: yup.string().notRequired()
})

const defaultValues = {
  companyName: '',
  primaryContactName: '',
  address: '',
  email: '',
  phoneNumber: '',
  companyId: '',
  taxId: '',
  isActive: true
}
const SidebarAddClient = props => {
  // ** Props
  const { open, toggle, editedRowData, handleEdit, setEditedRowData } = props

  // ** State
  const [plan, setPlan] = useState('basic')
  const [profile, setProfile] = useState(null)
  const [isLoading, setLoading] = useState(false)

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.clients)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const {
    reset,
    control,
    setValue,
    watch,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (editedRowData != null) {
      const fetchData = async () => {
        const {
          profilePhoto,
          companyName,
          primaryContatctName,
          address,
          email,
          phoneNumber,
          companyId,
          taxId,
          isActive,
          profilePictureName
        } = editedRowData
        const file =
          profilePhoto &&
          (await blobUrlToFile(profilePhoto, profilePictureName || 'profile Picture.jpg'))

        setProfile(file)
        reset({
          companyName: companyName,
          primaryContactName: primaryContatctName || '',
          address: address,
          email: email,
          phoneNumber: phoneNumber,
          companyId: companyId,
          taxId: taxId,
          isActive: isActive
        })
      }
      fetchData()
    } else {
      reset()
    }

    return () => {
      setProfile(null)
    }
  }, [open])

  const addNewClient = newClient => {
    const _clients = store.clients != null ? [...store.clients] : []
    _clients.push(newClient)
    setEditedRowData(null)
    dispatch(setClients(_clients))
    handleEdit(null)
    setProfile(null)
    reset({})
    setLoading(false)
    handleClose()
  }

  const updateClientState = client => {
    const _clients = store.clients != null ? [...store.clients] : []
    const index = _clients.findIndex(o => o.id == client.id)
    _clients[index] = client
    setEditedRowData(null)
    dispatch(setClients(_clients))
    handleEdit(null)
    setProfile(null)
    reset({})
    setLoading(false)
    handleClose()
  }

  const onSubmit = data => {
    setLoading(true)
    setFormSubmitted(true)
    // if (!profile) {
    //   toast.error('Profile photo is required');

    //   return;
    // }
    toggle()
    const profilePhoto =
      editedRowData && profile?.length > 0
        ? profile[0].file
        : profile?.length > 0
        ? profile[0].file
        : profile

    const contactName = data.primaryContactName
    const profilePictureName = profilePhoto?.name
    delete data.primaryContactName

    const req = {
      profilePhoto: profilePhoto,
      primaryContatctName: contactName,
      profilePictureName: profilePictureName,
      ...data
    }
    setLoading(true)
    dispatch(editedRowData ? updateClient({ id: editedRowData?.id, ...req }) : addClients(req))
      .then(unwrapResult)
      .then(res => {
        if (res['hasError'] != null) {
          editedRowData
            ? handleResponse('update', res, updateClientState)
            : handleResponse('create', res, addNewClient)
        } else {
          customErrorToast(errorMessage.default)
          setLoading(false)
          reset({})
        }
      })
      .catch(error => {
        customErrorToast(error.message)
        setLoading(false)
        reset({})
      })
  }

  const handleProfile = file => {
    setProfile(file)
  }

 const handleRemoveProfile = ()=>{
  handleProfile(null)
 }

  const handleClose = (e, v) => {
    if (v != 'backdropClick') {
      reset({})
      setProfile(null)
      setEditedRowData(null)
      setProfile(null)
      toggle()
    }
  }
  
  return (
    <>
      {isLoading && <BackdropSpinner />}
      <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
      >
        <Header>
          <Typography variant='h6'>
            {editedRowData ? 'Edit Client' : 'Create New Client'}
          </Typography>
          <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Typography variant='body1' sx={{ pb: 4 }}>
                Profile Photo
                {/* <span style={{ color: 'red' }}>*</span> */}
              </Typography>

              {editedRowData ? (
                <>
                  {profile ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EditProfileUpload profile={profile} handleProfile={handleProfile} />
                      <IconButton
                        color='error'
                        size='small'
                        onClick={handleRemoveProfile}
                      >
                        <Icon icon='mdi:trash-outline' fontSize={18} />
                      </IconButton>
                    </Box>
                  ) : (
                    <EditProfileUpload
                      profile={profile}
                      handleProfile={handleProfile}
                    />
                  )}
                </>
              ) : (
                <>
                {profile ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ProfileUpload profile={profile} handleProfile={handleProfile} />
                    <IconButton
                      color='error'
                      size='small'
                      onClick={handleRemoveProfile}
                    >
                      <Icon icon='mdi:trash-outline' fontSize={18} />
                    </IconButton>
                  </Box>
                ) : (
                  <ProfileUpload profile={profile} handleProfile={handleProfile} />
                )}
                </>
              )}
              {/* {formSubmitted && !profile && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  Profile photo is required
                </FormHelperText>
              )} */}

              {/* {!profile && (
              <FormHelperText sx={{ color: 'error.main' }}>Profile Photo is required</FormHelperText>
            )} */}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='companyName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Company name *'
                    onChange={onChange}
                    autoComplete='off'
                    //   placeholder='johndoe'
                    error={Boolean(errors.companyName)}
                  />
                )}
              />
              {errors.companyName && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.companyName.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='primaryContactName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Contact name'
                    onChange={onChange}
                    autoComplete='off'
                    error={Boolean(errors.primaryContactName)}
                  />
                )}
              />
              {errors.primaryContactName && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.primaryContactName.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='phoneNumber'
                control={control}
                // rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <>
                    <TextField
                      sx={{
                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                          display: 'none'
                        },
                        '& input[type=number]': { MozAppearance: 'textfield' }
                      }}
                      value={value}
                      label='Phone number'
                      autoComplete='off'
                      type='tel'
                      inputProps={{ min: 10, maxLength: 10 }}
                      onChange={e => {
                        const inputValue = e.target.value.replace(/\D/g, '')
                        if (inputValue.length <= 10) {
                          onChange({ target: { value: inputValue } })
                        }
                      }}
                    />
                    {value && value.length !== 10 && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        Please enter a valid 10-digit phone number.
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='email'
                control={control}
                // rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type='email'
                    value={value}
                    label='Email'
                    autoComplete='off'
                    onChange={onChange}
                    error={Boolean(errors.email)}
                  />
                )}
              />
              {errors.email && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='address'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Address'
                    multiline
                    autoComplete='off'
                    minRows={2}
                    onChange={onChange}
                    //   placeholder='Company PVT LTD'
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

            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='companyId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Company Id'
                    onChange={onChange}
                    autoComplete='off'
                    //   placeholder='Australia'
                    error={Boolean(errors.companyId)}
                  />
                )}
              />
              {errors.companyId && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.companyId.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='taxId'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Tax Id'
                    onChange={onChange}
                    autoComplete='off'
                    //   placeholder='Australia'
                    error={Boolean(errors.taxId)}
                  />
                )}
              />
              {errors.taxId && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.taxId.message}</FormHelperText>
              )}
            </FormControl>

            <FormControl sx={{ mb: 6 }}>
              <Controller
                name='isActive'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    label='Active'
                    control={
                      <Checkbox
                        size='medium'
                        defaultChecked={watch('isActive')}
                        checked={value}
                        value={value}
                        onChange={onChange}
                      />
                    }
                  />
                )}
              />
            </FormControl>

            <Box sx={{ display: 'flex', gap: 5, alignItems: 'center', justifyContent: 'flex-end' }}>
              <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                Cancel
              </Button>
              <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  )
}

export default SidebarAddClient
