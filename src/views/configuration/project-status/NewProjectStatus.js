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
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { customToast, errorToast, handleResponse, successToast } from 'src/helpers/helpers'
import { useTheme } from '@emotion/react'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import {
  fetchProjectStatus,
  postProjectStatus,
  putProjectStatus,
  setEditProjectStatus,
  setProjectStatus
} from 'src/store/settings'
import { BackdropSpinner } from 'src/@core/components/spinner'

const defaultValues = {
  taskStatusName: ''
}

const NewProjectStatus = ({ isOpen, setOpen, rowData }) => {
  const store = useSelector(state => state.settings)

  const dispatch = useDispatch()
  const theme = useTheme()
  const [isLoading, setLoading] = useState(false)
  const { editProjectStatus, ProjectStatus } = useSelector(state => state.settings)

  const schema = yup.object().shape({
    taskStatusName: yup.string().trim().required('Status Name is Required')
  })

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
    if (editProjectStatus && rowData) {
      reset(rowData)
    } else {
      reset()
    }
  }, [editProjectStatus, rowData])

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const updateState = newReq => {
    dispatch(setEditProjectStatus(false))
    setOpen(false)
    setLoading(false)
    reset(defaultValues)
  }

  // submit
  const onSubmit = formData => {

    setOpen(false)
    reset()
    const isDuplicate =
      ProjectStatus.some(status => status.taskStatusName.toLowerCase() === formData.taskStatusName.toLowerCase());

    if (isDuplicate) {
      setLoading(false);
      toast.error('Status with the same name already exists.');

      return;
    }

    const request = editProjectStatus ? { ...formData } : { ...formData, id: rowData?.id }

    if (editProjectStatus) {
      setLoading(true)
      dispatch(putProjectStatus(request))
        .then(unwrapResult)
        .then(res => {
          handleResponse('update', res, updateState)
        })
    } else {
      setLoading(true)
      dispatch(postProjectStatus(request))
        .then(unwrapResult)
        .then(res => {
          handleResponse('create', res, updateState)
        })
    }
  }

  const handleClose = (e, v) => {
    if (v === 'backdropClick') {
      setOpen(true)
    } else {
      setOpen(false)

    }
    reset()
  }

  return (
    <Box>
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
              onClick={() => {
                reset(defaultValues)
                setOpen(false)
                dispatch(setEditProjectStatus(false))
              }} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Icon icon='mdi:close' />
            </IconButton>
            <Box sx={{ mb: 8 }}>
              <Typography variant='h5'>
                {editProjectStatus ? 'Edit Status' : 'New Status'}
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='taskStatusName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Status Name'
                        placeholder='name'
                        onChange={onChange}
                        autoComplete='off'
                        error={Boolean(errors.taskStatusName)}
                        required
                      />
                    )}
                  />
                  {errors.taskStatusName && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.taskStatusName.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'right',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                reset(defaultValues)
                setOpen(false)
                dispatch(setEditProjectStatus(false))
              }}
            >
              Cancel
            </Button>
            <Button variant='contained' type='submit' sx={{ mr: 1 }}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog >
    </Box>
  )
}

export default NewProjectStatus