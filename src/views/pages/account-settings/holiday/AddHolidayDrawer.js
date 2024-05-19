// ** React Imports
import { useState } from 'react'

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
import DatePicker from 'react-datepicker'
import dayjs from 'dayjs'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addHoliday, setHolidays } from 'src/store/apps/accountSetting/index'
import subDays from 'date-fns/subDays'
import { unwrapResult } from '@reduxjs/toolkit'
import { handleResponse } from 'src/helpers/helpers'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  date: yup.date().required('Holiday date is required'),
  leaveDescription: yup.string().required('Leave description is required')
})

const defaultValues = {
  date: new Date(),
  leaveDescription: ''
}

const SidebarAddHoliday = props => {
  // ** Props
  const { open, toggle, holidays } = props

  // ** Hooks
  const dispatch = useDispatch()
  const [existError, setExistError] = useState(false)
  const [existDateError, setExistDateError] = useState(false)

  const {
    reset,
    control,
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  function isExistHoliday(array, value) {
    return array.some(obj => Object.values(obj).includes(value))
  }

  //UPDATE Holiday STATE
  const updateHolidayState = newHoliday => {
    let _holidays = [...holidays]
    _holidays.push(newHoliday)
    let sortedArray = _holidays.sort((a, b) => {
      return new Date(a.date) - new Date(b.date)
    })
    dispatch(setHolidays(sortedArray))
  }

  const onSubmit = data => {
    var date = dayjs(data.date).format('YYYY-MM-DD')
    data.date = date
    var holidayArray = [data]
    const isExist = isExistHoliday(holidays, data.leaveDescription?.trim())
    const dates = holidays.map(o => new Date(o.date).toDateString())
    const isExisDate = dates.includes(new Date(date).toDateString())

    if (isExist) {
      setExistError(true)

      return
    }
    if (isExisDate) {
      setExistDateError(true)

      return
    }
    setExistError(false)
    dispatch(addHoliday(holidayArray))
      .then(unwrapResult)
      .then(res => {
        handleResponse('create', res, updateHolidayState)
      })
    toggle()
    reset()
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  const isWeekday = date => {
    const day = new Date(date).getDay()

    return day !== 0 && day !== 6
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Add Holiday</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='date'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <DatePickerWrapper>
                  <DatePicker
                    onChange={date => {
                      onChange(date)
                    }}
                    selected={value}
                    excludeDates={holidays.map(o => subDays(new Date(o.date), 0))}
                    highlightDates={holidays.map(o => subDays(new Date(o.date), 0))}
                    customInput={
                      <CustomInput label='Holiday Date' fullWidth error={Boolean(errors.date)} />
                    }
                  />
                </DatePickerWrapper>
              )}
            />
            {errors.date && (
              <FormHelperText sx={{ color: 'error.main' }}>Holiday date is required</FormHelperText>
            )}
            {existDateError && (
              <FormHelperText sx={{ color: 'error.main' }}>This Date already exist</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='leaveDescription'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Leave Description'
                  onChange={onChange}
                  placeholder='description'
                  error={Boolean(errors.leaveDescription)}
                />
              )}
            />
            {errors.leaveDescription && (
              <FormHelperText sx={{ color: 'error.main' }}>
                Leave description is required
              </FormHelperText>
            )}
            {existError && watch('leaveDescription') && (
              <FormHelperText sx={{ color: 'error.main' }}>
                This Holiday already exist
              </FormHelperText>
            )}
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
  )
}

export default SidebarAddHoliday
