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

import { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { getWeekNumbers, handleResponse, successToast } from 'src/helpers/helpers'
import { useTheme } from '@emotion/react'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import SimpleBackdrop, { BackdropSpinner, Spinner } from 'src/@core/components/spinner'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'
import {
  fetchExpenses,
  postExpenses,
  setExpenses,
  putExpenses,
  setEditExpenses
} from 'src/store/apps/projects'
import Expenses from '.'
import { expenseRequest } from 'src/helpers/requests'

const defaultValues = {
  projectId: '',
  expense: '',
  date: new Date(),
  cost: null,
  description: ''
}

const schema = yup.object().shape({
  cost: yup.number().typeError('Cost must be a number').required('Cost is required'),
  expense: yup.string().trim() // Trim leading and trailing whitespace
    .required('Expense is required')
    .test('is-not-empty', 'Expense cannot be empty', value => value.trim() !== ''),

  description: yup.string().required('Description is required'),
  date: yup.date().required('Date is required')
})

const NewExpenses = ({ isOpen, setOpen, rowData, id }) => {
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)

  const { editExpenses, expenses } = useSelector(state => state.projects)
  const maxDate = new Date()

  const onChange = e => {
    setValue(e.target.name, e.target.value)
  }

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
    resolver: yupResolver(schema)
  })

  // useEffect(() => {
  //   const projectId = localStorage.getItem('projectId')
  //   dispatch(fetchExpenses(projectId))
  // }, [])

  useEffect(() => {
    reset()
  }, [isOpen])

  useEffect(() => {
    if (editExpenses && rowData) {
      reset(rowData);
    }
    reset()
  }, [editExpenses, rowData]);

  //submit

  const updateState = newReq => {
    if (!editExpenses) {
      dispatch(setEditExpenses(false));
    }
    setLoading(false)
    reset(defaultValues);
  }


  const onSubmit = formData => {
    setOpen(false)
    setLoading(true)
    const projectId = id
    const request = editExpenses ? expenseRequest({
      ...formData, id,
      id: rowData.id,
    }) : expenseRequest({
      ...formData, projectId,

    });

    if (editExpenses) {
      setLoading(true)
      dispatch(putExpenses(request))
        .then(unwrapResult)
        .then(res => {
          handleResponse('update', res, updateState);

        });
    } else {
      setLoading(true)
      dispatch(postExpenses(request))
        .then(unwrapResult)
        .then(res => {
          handleResponse('create', res, updateState);
        });
    }
  }

  const handleClose = (e, v) => {
    if (v === 'backdropClick') {
      setOpen(true)
      reset()
    } else {
      setOpen(false)
    }
    // dispatch(setEditExpenses(false))
  }
  const handleBlur = (e, v) => {
    if (v == 'backdropClick') {
      setOpen(true)
      reset()
    } else {
      setOpen(false)
    }
  }

  return (
    <Box>
      {isLoading && <BackdropSpinner />}
      <Dialog fullWidth open={isOpen} maxWidth='sm' onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              position: 'relative',
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(8)} !important, ${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important, ${theme.spacing(12.5)} !important`]
            }}
          >
            <IconButton
              size='small'
              onClick={() => setOpen(false)}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Icon icon='mdi:close' />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5'>{editExpenses ? 'Edit Expense' : 'New Expense'}</Typography>
            </Box>

            <Grid container spacing={6}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='expense'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        value={field.value}
                        multiline
                        label='Expense *'
                        onChange={field.onChange}
                        error={Boolean(errors.expense)}
                      />
                    )}
                  />
                  {errors.expense && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.expense.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='description'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        minRows={2}
                        multiline
                        label='Description *'
                        onChange={onChange}
                        error={Boolean(errors.description)}
                      />
                    )}
                  />
                  {errors.description && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.description.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='cost'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        value={field.value}
                        type='number'
                        label='Cost *'
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === '+') {
                            e.preventDefault();
                          }
                        }}
                        inputProps={{ min: 0 }}
                        onChange={e => field.onChange(e.target.value)}
                        error={Boolean(errors.cost)}
                      />
                    )}
                  />
                  {errors.cost && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.cost.message}
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
                          maxDate={maxDate}
                          dateFormat={'dd-MMM-yy'}
                          autoComplete='off'
                          customInput={<PickersComponent label='Date *' registername='date' />}
                          onChange={onChange}
                        />
                      )}
                    />
                    {errors.date && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.date.message}
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
              px: theme => [`${theme.spacing(5)} !important, ${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important, ${theme.spacing(12.5)} !important`]
            }}
          >
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                reset(defaultValues)
                setOpen(false)
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
    </Box>
  )
}

export default NewExpenses
