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
  postProjectStatus,
  postDepartment,
  putDepartment, setEditDepartment,
  putProjectStatus,
  setEditProjectStatus,
} from 'src/store/settings'
import { BackdropSpinner } from 'src/@core/components/spinner'

const defaultValues = {
  name: ''
}

const NewDepartment = ({ isOpen, setOpen, rowData }) => {
  const store = useSelector(state => state.settings)

  const dispatch = useDispatch()
  const theme = useTheme()
  const [isLoading, setLoading] = useState(false)
  const { editDepartment, department } = useSelector(state => state.settings)

  const schema = yup.object().shape({
    name: yup.string().trim().required(' Name is required')
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
    if (editDepartment && rowData) {
      reset(rowData)
    } else {
      reset()
    }
  }, [editDepartment, rowData])

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const updateState = newReq => {
    dispatch(setEditDepartment(false))
    setOpen(false)
    reset(defaultValues)
    setLoading(false)
  }

  // submit
  const onSubmit = formData => {
    setLoading(true)

    setOpen(false)
    reset()

    const isDuplicate =
      department.some(dept => dept.name.toLowerCase() === formData.name.toLowerCase());

    if (isDuplicate) {
      setLoading(false);
      toast.error('Department with the same name already exists.');

      return;
    }

    const request = editDepartment ? { ...formData } : { ...formData, id: rowData?.id }

    if (editDepartment) {
      setLoading(true)
      dispatch(putDepartment(request))
        .then(unwrapResult)
        .then(res => {
          handleResponse('update', res, updateState)
          setLoading(false)
        })
    } else {
      setLoading(true)
      dispatch(postDepartment(request))
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
    setEditDepartment(false)
    reset()
  }

  const close = () => {
    setEditDepartment(false)

    setOpen(false)
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
                dispatch(setEditDepartment(false))
              }} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Icon icon='mdi:close' />
            </IconButton>
            <Box sx={{ mb: 8 }}>
              <Typography variant='h5'>
                {editDepartment ? 'Edit Department' : 'New Department'}
              </Typography>
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
                        label='Department Name *'
                        placeholder='Enter name'
                        onChange={onChange}
                        autoComplete='off'
                        error={Boolean(errors.name)}
                      />
                    )}
                  />
                  {errors.name && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.name.message}
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
                dispatch(setEditDepartment(false))
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

export default NewDepartment