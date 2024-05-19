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
import { fetchPolicies, putPolicy, setApply, setPolicies } from 'src/store/absence-management'
import { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { customToast, errorToast, handleResponse, successToast } from 'src/helpers/helpers'
import { useTheme } from '@emotion/react'
import { postProject } from 'src/store/apps/projects'
import { leavePolicyRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { APPROVERS } from 'src/helpers/constants'
import { BackdropSpinner } from 'src/@core/components/spinner'

const schema = yup.object().shape({
  typeOfLeave: yup.string().required('Request Type is Required'),
  period: yup.string().required('Period is Required'),
  carryForwardCount: yup.number().min(0).typeError('Must be a number'),
  allowanceTime: yup.number().min(0).typeError('Must be a number'),
  allowanceCount: yup
    .number()
    .positive('Should greater than 0')
    .required('Allowance Required')
    .typeError('Must be a number'),
  isPermission: yup.boolean(),
  levelOneApprovalLevelId: yup.number().positive().notRequired(),
  levelTwoApprovalLevelId: yup.number().positive().notRequired()
})

const EditLeavePolicy = ({ isOpen, setOpen, row }) => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const theme = useTheme()
  const [isLoading, setLoading] = useState(false)

  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: row,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    reset({
      typeOfLeave: row?.typeOfLeave,
      allowanceCount: row?.allowanceCount,
      allowanceTime: row?.allowanceTime,
      isPermission: row?.isPermission,
      period: row?.period,
      carryForwardCount: row?.carryForwardCount,
      level1: row?.levelOneApprovalId,
      level2: row?.levelTwoApprovalId
    })
  }, [row])

  //UPDATE POLICY STATE
  const updatePolicyState = newPolicy => {
    let policies = [...store.policies]
    const indexToReplace = policies.findIndex(item => item.id === newPolicy.id)

    if (indexToReplace !== -1) {
      policies[indexToReplace] = newPolicy
    }
    dispatch(setPolicies(policies))
    reset()
  }
  //submit

  const onSubmit = data => {
    try {
      setLoading(true)
      const req = { id: row?.id, ...data }
      setOpen(false)
      dispatch(putPolicy(leavePolicyRequest(req)))
        .then(unwrapResult)
        .then(res => {
          handleResponse('update', res, updatePolicyState)
          setLoading(false)
        })
    } catch (error) {
      setLoading(false)
      toast.error(error)
    }
  }

  return (
    <>
      {isLoading && <BackdropSpinner />}
      <Dialog fullWidth open={isOpen} maxWidth='sm' scroll='body' onClose={() => setOpen(false)}>
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
              <Typography variant='h5'>Edit Leave Policy</Typography>
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
                  {(watch('isPermission') ? errors.hours : errors.days) && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {watch('isPermission') ? errors.hours.message : errors.days.message}
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
                reset({
                  typeOfLeave: '',
                  allowanceTime: 0,
                  allowanceCount: 0,
                  period: '',
                  isPermission: false,
                  carryForwardCount: 0
                })
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

export default EditLeavePolicy
