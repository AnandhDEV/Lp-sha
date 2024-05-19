// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import CustomChip from 'src/@core/components/mui/chip'
import * as yup from 'yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {
  Autocomplete,
  Avatar,
  Checkbox,
  Chip,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Typography
} from '@mui/material'

//** Third Party */
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAssigneeRoles, fetchUsers, putAssignee, setProjectMembers, setProjectRoles } from 'src/store/apps/projects'
import { formatLocalDate } from 'src/helpers/dateFormats'
import toast from 'react-hot-toast'
import CustomPeoplePicker from 'src/views/components/autocomplete/CustomPeoplePicker'
import { unwrapResult } from '@reduxjs/toolkit'
import { projectAssigneeRequest } from 'src/helpers/requests'
import { postAssignee } from 'src/store/apps/projects'
import { handleResponse } from 'src/helpers/helpers'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { store } from 'src/store'
import { BackdropSpinner } from 'src/@core/components/spinner'
import user from 'src/store/apps/user'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
} 

const defaultValues = {
  allocatedProjectCost: '',
  projectId: '',
  userId: null,
  projectRoleId: null,
  availablePercentage: ''
}

const schema = yup.object().shape({
  allocatedProjectCost: yup.number().required('Allocated cost required').typeError(),
  userId: yup.object().required('Project Member required'),
  projectRoleId: yup.object().required('Project role Required'),
  availablePercentage: yup.number().required('Available Percentage required').typeError(),
  projectRoleId: yup.object().required('Project Role required')
})


const NewMember = ({ isOpen, setOpen, id }) => {
  const [isLoading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const { editProjectMember, projectMembers, users, assigneeRoles } = useSelector(state => state.projects)
  useEffect(() => {
    dispatch(fetchAssigneeRoles())
    users == null && dispatch(fetchUsers()).then(unwrapResult)
  }, [])
  const STATUS = ['Completed', 'Not Started', 'Working on it', 'Due']
  const STATUS_COLOR = ['success', 'warning', 'info', 'error']

  const onSelectMember = e => {
    setProjectMem(e.map(o => o.userName))
  }

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

  useEffect(() => {
    if (editProjectMember) {
      reset({
        allocatedProjectCost: editProjectMember.allocatedProjectCost,
        projectId: editProjectMember.projectId,
        userId: users
          .map(i => ({ id: i.id, name: i.firstName + ' ' + i.lastName }))
          .find(x => x.id === editProjectMember.userId),
        projectRoleId: assigneeRoles.find(x => x.projectRoleId === editProjectMember.projectRoleId),
        availablePercentage: editProjectMember.availablePercentage
      })
    } else {
      reset({})
    }
  }, [editProjectMember])


  const addNewMember = newMember => {
    const _projectMembers = [...projectMembers]
    _projectMembers.push(...newMember)
    dispatch(setProjectMembers(_projectMembers))
    setLoading(false)

  }
  const updateProjectMember = updateMember => {
    const _projectMembers = [...projectMembers]

    const index = _projectMembers.findIndex(o => o.id == updateMember[0].id)
    _projectMembers[index] = updateMember[0]
    dispatch(setProjectMembers(_projectMembers))
    setLoading(false)

  }

  const onSubmit = data => {

    setLoading(true)
    handleClose()
    const req = {
      ...data,
      userId: data.userId.id,
      projectId: id,
      projectRoleId: data.projectRoleId.projectRoleId,
      availablePercentage: Number(data.availablePercentage),
      id: editProjectMember ? editProjectMember.id : null
    }

    const request = projectAssigneeRequest(req)

    if (editProjectMember) {
      dispatch(putAssignee(request))
        .then(unwrapResult)
        .then(res => {
          handleResponse('update', res, updateProjectMember)
        })
        .catch(err => {
          setLoading(false)
          toast.error(err.message)
        })
    } else {
      dispatch(postAssignee(request))
        .then(unwrapResult)
        .then(res => {
          handleResponse('create', res, addNewMember)
        })
        .catch(err => {
          setLoading(false)
          toast.error(err.message)
        })
    }
  }

  const handleClose = (e, v) => {
    if (v != 'backdropClick') {
      setOpen(false)
      reset()
    }
  }

  return (
    <Box>
      {isLoading && <BackdropSpinner />}
      <Drawer anchor='right' open={isOpen} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5} sx={{ p: 8, width: 400 }}>
            <Grid item xs={12} className='gap-1' justifyContent='space-between' alignItems='center'>
              <Typography color='secondary'>
                {editProjectMember ? 'Edit Member' : 'Add Member'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='userId'
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      label='Project Member'
                      options={users
                        ?.filter(
                          member =>
                            !projectMembers?.some(
                              projectMember =>
                                projectMember.projectId ===
                                id &&
                                projectMember.userId === member.id
                            ) && member.isActive
                        ).slice()
                        .sort((a, b) => (a.firstName + ' ' + a.lastName).localeCompare(b.firstName + ' ' + b.lastName))
                        .map(x => ({
                          name: x.firstName + ' ' + x.lastName,
                          id: x.id
                        })) || []}
                      getOptionLabel={option => option.name || ''}
                      id='autocomplete-limit-tags'
                      value={field.value}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      disabled={!!editProjectMember}
                      renderInput={params => <TextField {...params} label='Project Member *' />}
                    />
                  )}
                />
                {errors.userId && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.userId.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='allocatedProjectCost'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type='number'
                      label='Allocated Project Cost *'
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === '+') {
                          e.preventDefault();
                        }
                      }}
                      inputProps={{ min: 0 }}
                    />
                  )}
                />
                {errors.allocatedProjectCost && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.allocatedProjectCost.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='availablePercentage'
                  control={control}
                  defaultValue={100}
                  render={({ field }) => (
                    <TextField {...field} type='number'
                      label='Available Percentage *'
                      onKeyDown={(e) => {
                        const currentValue = parseFloat(e.target.value + e.key);
                        if (e.key === '-' || e.key === '+' || currentValue > 100) {
                          e.preventDefault();
                        }
                      }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  )}
                />
                {errors.availablePercentage && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.availablePercentage.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='projectRoleId'
                  control={control}
                  defaultValue={assigneeRoles.find(r => r.projectRoleId == 3)}
                  render={({ field }) => (
                    <Autocomplete
                      label='Project Role Id'
                      options={assigneeRoles}
                      getOptionLabel={option => option.projectRoleName}
                      id='autocomplete-limit-tags'
                      value={field.value}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      renderInput={params => <TextField {...params} label='Project Role *' />}
                    />
                  )}
                />
                {errors.projectRoleId && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.projectRoleId.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid columnGap={2} item xs={12} className='flex-right' sx={{ mt: 5 }}>
              <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                Close
              </Button>
              <Button size='large' variant='contained' type='submit'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Drawer>
    </Box>
  )
}

export default NewMember
