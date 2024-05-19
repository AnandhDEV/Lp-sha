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
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser, setUsers } from 'src/store/apps/user'
import CustomSkillPicker from 'src/views/components/autocomplete/CustomSkillPicker'
import { SKILLS, roles } from 'src/helpers/constants'
import { Autocomplete } from '@mui/material'
import { userRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { fetchSkills } from 'src/store/apps/user'
import { handleResponse } from 'src/helpers/helpers'
import { BackdropSpinner } from 'src/@core/components/spinner'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { right } from '@popperjs/core'

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

const mailValid = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

const skill = yup.string()
const schema = yup.object().shape({
  email: yup.string().email().required('Email is required').matches(mailValid, "Email is invalid"),
  joinedDate: yup.date().required('Joined date is required'),
  cost: yup.number().typeError('Cost is required')

    // .min(10, obj => showErrors('Contact Number', obj.value.length, obj.min))
    .required(),
  firstName: yup
    .string().required('FirstName is required')
    .min(3, "FirstName must be atleast 3 characters")
  ,
  lastName: yup
    .string().required('LastName is required')
    .min(3, "LastName must be atleast 3 characters"),
  role: yup.number().required('Role is required').moreThan(0, 'Role is required'),
  reportingManager: yup.string().notRequired()
})



const defaultValues = {
  email: '',
  firstName: '',
  lastName: '',
  joinedDate: new Date(),
  cost: 0,
  role: 4,
  reportingManager: ''
}

const SidebarAddUser = props => {
  // ** Props
  const { open, toggle } = props

  // ** State
  const [plan, setPlan] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [skills, setSkills] = useState([])

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)

  const [items, setItems] = useState([])

  const {
    reset,
    control,
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })


  useEffect(() => {
    store.skills == null && dispatch(fetchSkills())
    reset({role:4})
  }, [])

  useEffect(() => {
    setItems(store.skills)
  }, [store.skills])

  
  const updateUsersList = user => {
    const users = store.users ? [...store.users] : []
    users.unshift(user)
    dispatch(setUsers(users))
    setLoading(false)
  }

  const onSubmit = data => {
    handleClose()
    setLoading(true)
    const user = store.users?.find(o => o.fullName == data.reportingManager)
    const _skills = skills.map(o => o.id)
    const req = {
      ...data,
      reportingManagerId: user ? user.id : 0,
      departmentId: null,
      skills: _skills
    }
    const request = userRequest(req)
    dispatch(addUser(request))
      .then(unwrapResult)
      .then(res => {
        handleResponse('create', res, updateUsersList)
        setLoading(false)
      })
      
  }

  const handleSkills = values => {
    setSkills(values)
    const _items = [...items]
    const _index = _items.findIndex(o => o.id == values[values.length - 1]?.id)
    _index != -1 && _items.splice(_index, 1)
    setItems(_items)
  }

  const handleRemoveSkill = value => {
    const _skills = [...skills]
    const _index = _skills.findIndex(o => o.id == value.id)
    _skills.splice(_index, 1)
    setSkills(_skills)
    // setItems(_options)
  }

  const handleClose = () => {
    setSkills([])
    setItems(store.skills)
    toggle()
    reset()
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
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <Header>
          <Typography variant='h6'>Add User</Typography>
          <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='firstName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='First Name *'
                    onChange={onChange}
                    autoComplete='off'
                    error={Boolean(errors.firstName)}
                  />
                )}
              />
              {errors.firstName && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.firstName.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='lastName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Last Name *'
                    onChange={onChange}
                    autoComplete='off'
                    error={Boolean(errors.lastName)}
                  />
                )}
              />
              {errors.lastName && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.lastName.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='email'
                control={control}
                rules={{
                  required: true

                }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type='email'
                    value={value}
                    label='Email *'
                    onChange={onChange}
                    autoComplete='off'
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
                name='joinedDate'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                    <DatePicker
                      id='event-end-date'
                      selected={value}
                      dateFormat={'dd-MMM-yy'}
                      maxDate={new Date()}
                      autoComplete='off'
                      customInput={
                        <PickersComponent label='Joined Date *' registername='joinedDate' />
                      }
                      onChange={onChange}
                      popperPlacement='auto'
                    />
                  </DatePickerWrapper>
                )}
              />
              {errors.joinedDate && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.joinedDate.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='cost'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    type='number'
                    value={value}
                    label='Cost per hour *'
                    onChange={onChange}
                    autoComplete='off'
                    error={Boolean(errors.cost)}
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === '+') {
                        e.preventDefault();
                      }
                    }}
                    inputProps={{ min: 0 }}
                  />
                )}
              />
              {errors.cost && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.cost.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id='role-select'>{"User Role * "}</InputLabel>
              <Controller
                name='role'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    fullWidth
                    value={value || 4}
                    id='select-role'
                    label='User Role'
                    onChange={onChange}
                    autoComplete='off'
                    // placeholder='Select Role '
                  >
                    {Object.keys(roles).map((key, i) => (
                      <MenuItem key={i} value={key}>
                        {roles[key].name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.role && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.role.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='reportingManager'
                control={control}
                rules={{ required: store.users?.length > 0 ? true : false }}
                render={({ field }) => (
                  <Autocomplete
                    options={store.users?.filter(u => u.isActive).slice()
    .sort((a, b) => (a.firstName + ' ' + a.lastName).localeCompare(b.firstName + ' ' + b.lastName)) || []}
                    id='autocomplete-limit-tags'
                    getOptionLabel={option => (option?.fullName ? option.fullName : option)}
                    onChange={(e, v) => {
                      field.onChange(e.target.innerText)
                    }}
                    value={field.value?.fullName ? field.value.fullName : field.value}
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
            <FormControl fullWidth sx={{ mb: 6 }}>
              <CustomSkillPicker
                values={skills}
                items={items?.length > 0 ? items : store.skills || []}
                label='Skills'
                setSkills={handleSkills}
                setItems={setItems}
                originalItems={store.skills ? store.skills : []}
              />
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: right }}>
              <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                Submit
              </Button>
              <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  )
}

export default SidebarAddUser
