// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {
  Autocomplete,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Typography
} from '@mui/material'

//** Third Party */
import DatePicker, { ReactDatePicker, ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchMyLeaves,
  fetchPolicies,
  fetchRequestTypes,
  fetchUsers,
  postLeaveRequest,
  setApply
} from 'src/store/absence-management'
import { useEffect, useState } from 'react'
import { Box, minHeight } from '@mui/system'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { customToast, errorToast, handleResponse, successToast } from 'src/helpers/helpers'
import { useTheme } from '@emotion/react'
import { myLeaveRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { fetchHolidays, setHolidays, updateHoliday } from 'src/store/apps/accountSetting'
import { formatDateToYYYYMMDD } from 'src/helpers/dateFormats'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'
import subDays from 'date-fns/subDays'
import { BackdropSpinner } from 'src/@core/components/spinner'

const defaultValues = {
  date: new Date(),
  name: ''
}

const schema = yup.object().shape({
  name: yup.string().required('Holiday is required'),
  date: yup.date().required('Date is required')
})

const HolidayForm = ({ isOpen, row, setOpen }) => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const { holidays } = useSelector(state => state.accountSetting)
  const theme = useTheme()
  const [existError, setExistError] = useState(false)
  const [existDateError, setDateExistError] = useState(false)
  const [isLoading, setLoading] = useState(false)

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
    if (row) {
      reset({
        date: new Date(row.date),
        name: row.leaveDescription
      })
    }
  }, [row])

  const isWeekday = date => {
    const day = new Date(date).getDay()

    return day !== 0 && day !== 6
  }

  //UPDATE Holiday STATE
  const updateHolidayState = newHoliday => {
    let _holidays = [...holidays]
    let sortedArray = []
    const indexToReplace = _holidays.findIndex(item => item.id === newHoliday.id)

    if (indexToReplace !== -1) {
      _holidays[indexToReplace] = newHoliday
      sortedArray = _holidays.sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
      })
    }

    dispatch(setHolidays(sortedArray))
  }

  //submit

  const onSubmit = async formData => {
    setLoading(true)
    try {
      const isExist = holidays.some(
        o =>
          o.leaveDescription?.replaceAll(' ', '')?.toLowerCase() ==
          formData.name?.replaceAll(' ', '')?.toLowerCase()
      )
      const isExistDate = holidays.some(o => o.date == formData.date?.toDateString())
      if (isExist) {
        setExistError(true)

        return
      }
      if (isExistDate) {
        setExistError(true)

        return
      }

      setOpen(false)
      reset()

      dispatch(
        updateHoliday([
          { id: row.id, date: formatDateToYYYYMMDD(formData.date), leaveDescription: formData.name }
        ])
      )
        .then(unwrapResult)
        .then(res => {
          handleResponse('update', res, updateHolidayState)
          setLoading(false)
        })
    } catch (error) {
      toast.error(error)
      setLoading(false)

    }
  }

  const handleFromDateChange = selectedDate => {
    // Set the "to date" value when "from date" changes
    setValue('toDate', selectedDate)
  }

  const handleClose = (e, v) => {
    if (v != 'backdropClick') setOpen(false)
  }

  return (
    <>
      {isLoading && <BackdropSpinner />}
      <Dialog
        fullWidth
        open={isOpen}
        maxWidth='sm'
        scroll='body'
        onBlur={() => (setExistError(false), setDateExistError(false))}
        onClose={handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              position: 'relative',
              minHeight: '50vh',
              overflowY: 'auto',
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <IconButton
              size='small'
              onClick={() => {
                setOpen(false), setExistError(false), setDateExistError(false)
              }}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Icon icon='mdi:close' />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5'>Edit Holiday</Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='name'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Holiday Name'
                        onChange={onChange}
                        error={Boolean(errors.requestReason)}
                      />
                    )}
                  />
                  {errors.name && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.name.message}
                    </FormHelperText>
                  )}
                  {existError && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      This Holiday already exist
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                  <FormControl fullWidth>
                    <Controller
                      name='date'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          id='event-start-date'
                          selected={value}
                          dateFormat={'yyyy-MM-dd'}
                          excludeDates={holidays.map(o => subDays(new Date(o.date), 0))}
                          highlightDates={holidays.map(o => subDays(new Date(o.date), 0))}
                          customInput={
                            <PickersComponent label='Holiday Date' registername='fromDate' />
                          }
                          onChange={(date) => {
                            const formattedDate = date instanceof Date ? date : new Date(date);
                            const year = formattedDate.getFullYear().toString();
                            if (year.length <= 4) {
                              onChange(date);
                            }
                          }} onKeyDown={(e) => {
                            if (e.key === 'Delete' || e.key === 'Backspace') {
                              return;
                            }
                            if (!/[0-9]/.test(e.key) && e.key !== '/' && e.key !== '-') {
                              e.preventDefault();
                            }
                          }}
                          popperPlacement='bottom'
                        />
                      )}
                    />
                    {errors.date && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.date.message}
                      </FormHelperText>
                    )}
                    {existDateError && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        This Date already exist
                      </FormHelperText>
                    )}
                  </FormControl>
                </DatePickerWrapper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                reset()
                setOpen(false), setExistError(false), setDateExistError(false)
              }}
            >
              Cancel
            </Button>
            <Button variant='contained' type='submit' sx={{ mr: 1 }}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default HolidayForm
