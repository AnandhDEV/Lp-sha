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
import { fetchPolicies, postPolicy, setApply, setPolicies } from 'src/store/absence-management'
import { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { customToast, handleResponse } from 'src/helpers/helpers'
import { useTheme } from '@emotion/react'
import { postProject } from 'src/store/apps/projects'
import { leavePolicyRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { APPROVERS } from 'src/helpers/constants'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'
import { BackdropSpinner } from 'src/@core/components/spinner'


const defaultValues = {
  typeOfLeave: '',
  allowanceTime: 0,
  allowanceCount: 0,
  period: '',
  isPermission: false,
  carryForwardCount: 0,
  level1: 1,
  level2: 2
}

const schema = yup.object().shape({
  typeOfLeave: yup.string().required('Request Type is Required'),
  allowanceCount: yup
    .number()
    .positive('Should greater than 0')
    .required('Allowance Required')
    .typeError('Must be a number'),
  isPermission: yup.boolean(),

  allowanceTime: yup.string().nullable().when('isPermission', {
    is: (er) => er == true,
    then: () => yup.string().required('Hours is required').typeError('Hours is required').nullable(),
  }),
  carryForwardCount: yup.number().min(0).typeError('Must be a number'),
  level1: yup.number().min(0).notRequired(),
  level2: yup.number().min(0).notRequired()
})

const NewLeavePolicy = ({ isOpen, setOpen }) => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const theme = useTheme()
  const [isLoading, setLoading] = useState(false)

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

  useEffect(() => {
    reset()
  }, [])

  function isExistPolicy(array, value) {
    return array.some(obj => Object.values(obj).includes(value))
  }

  //UPDATE POLICY STATE
  const updatePolicyState = newPolicy => {
    let policies = [...store.policies]
    policies.push(newPolicy)
    dispatch(setPolicies(policies))
    reset()
    setLoading(false)
  }

  //submit

  const onSubmit = async formData => {
    setLoading(true)
    const isExist = isExistPolicy(store.policies, formData.typeOfLeave?.trim())

    if (isExist) {
      setError('typeOfLeave', { type: 'custom', message: 'Policy already exist' })

      return
    }
    setOpen(false)

    const req = leavePolicyRequest(formData)
    dispatch(postPolicy(req))
      .then(unwrapResult)
      .then(res => {
        setLoading(true)
        handleResponse('create', res, updatePolicyState)
      })
  }

  const handleClose = (e, v) => {
    if (v == 'backdropClick') {
      setOpen(true)
      reset()
    } else {
      setOpen(false)
    }
  }

  return (
    <>
      {isLoading && <BackdropSpinner />}

      <Dialog fullWidth open={isOpen} maxWidth='sm' scroll='body' onClose={handleClose}>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              position: 'relative',
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
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
              <Typography variant='h5'>Add New Leave Policy</Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='typeOfLeave'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Leave Type *'
                        placeholder='Leave Type'
                        onChange={onChange}
                        autoComplete='off'
                        error={Boolean(errors.typeOfLeave)}
                      />
                    )}
                  />
                  {errors.typeOfLeave && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.typeOfLeave.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={5} sm={5}>
                <FormControl fullWidth>
                  <Controller
                    name='allowanceCount'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        type='number'
                        label='Allowance'
                        onChange={onChange}
                        autoComplete='off'
                        error={Boolean(errors.allowance)}
                      />
                    )}
                  />
                  {errors.allowanceCount && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.allowanceCount.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid
                item
                xs={2}
                sm={2}
                display='flex'
                alignItems='center'
                justifyContent='space-evenly'
              >
                <Typography variant='body2'>Per</Typography>
              </Grid>

              <Grid item xs={5} sm={5}>
                <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                  <FormControl fullWidth>
                    <InputLabel id='demo-select-small-label'>Period *</InputLabel>
                    <Controller
                      name='period'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          value={value}
                          label='Period *'
                          onChange={onChange}
                          autoComplete='off'
                          error={Boolean(errors.period)}
                          labelId='demo-select-small-label'
                          aria-describedby='stepper-linear-client'
                        >
                          {[
                            { id: '1', name: 'Month' },
                            { id: '2', name: 'Year' }
                          ].map(client => (
                            <MenuItem key={client.id} value={client.name}>
                              {client.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.period && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.period.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </DatePickerWrapper>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='carryForwardCount'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        type='number'
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === '+') {
                            e.preventDefault();
                          }
                        }}
                        inputProps={{ min: 0 }}
                        label='Carry forward count'
                        onChange={onChange}
                        autoComplete='off'
                      />
                    )}
                  />
                  {errors.carryForwardCount && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.carryForwardCount.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={4} sm={4} md={4} lg={4}>
                <FormControl>
                  <Controller
                    name='isPermission'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        label='Permission'
                        control={
                          <Checkbox
                            value={value}
                            checked={value}
                            onChange={onChange}
                            autoComplete='off'
                            name='Permission'
                          />
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={8} md={8} lg={8}>
                <FormControl fullWidth>
                  <Controller
                    name='allowanceTime'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={watch('isPermission') ? value : 0}
                        type='number'
                        label='Hours'
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === '+') {
                            e.preventDefault();
                          }
                        }}
                        inputProps={{ min: 0 }}
                        disabled={!watch('isPermission')}
                        onChange={onChange}
                        autoComplete='off'
                      />
                    )}
                  />
                  {errors.allowanceTime && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.allowanceTime.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id='demo-select-small-label'>Level 1</InputLabel>
                  <Controller
                    name='level1'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        value={value}
                        label='Level 1'
                        onChange={onChange}
                        autoComplete='off'
                        defaultValue={1}
                        labelId='demo-select-small-label'
                        aria-describedby='stepper-linear-client'
                      >
                        {APPROVERS.map(approver => (
                          <MenuItem key={approver.id} value={approver.id}>
                            {approver.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormControl fullWidth>
                  <InputLabel id='demo-select-small-label'>Level 2</InputLabel>
                  <Controller
                    name='level2'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        value={watch('level1') === 3 ? '' : value}
                        label='Level 2'
                        onChange={onChange}
                        autoComplete='off'
                        defaultValue={2}
                        disabled={watch('level1') === 3}
                        labelId='demo-select-small-label'
                        aria-describedby='stepper-linear-client'
                      >
                        {APPROVERS.map(approver => (
                          <MenuItem key={approver.id} value={approver.id}>
                            {approver.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
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
    </>
  )
}

export default NewLeavePolicy
