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
  fetchDashboard,
  fetchMyLeaves,
  fetchPolicies,
  fetchRequestTypes,
  fetchUsers,
  postLeaveRequest,
  setApply,
  setMyleaves,
  setPolicies
} from 'src/store/absence-management'
import { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { getWeekNumbers, handleResponse, successToast } from 'src/helpers/helpers'
import { useTheme } from '@emotion/react'
import { myLeaveRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import SimpleBackdrop, { BackdropSpinner, Spinner } from 'src/@core/components/spinner'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'
import { fetchHolidays } from 'src/store/apps/accountSetting'
import subDays from 'date-fns/subDays'
import { fetchConfig } from 'src/store/settings'
import { bulkTaskCreate, fetchTasks, postFiles, setProjectFiles } from 'src/store/apps/projects'
import { errorMessage } from 'src/helpers/constants'
import FileUpload from './FileUpload'

const defaultValues = {
  fileName: ''
}

const schema = yup.object().shape({
  fileName: yup.string().required('From date is Required').typeError('File is Invalid')
})

const AddTaskFiles = ({ isOpenImport, setOpenImport, id }) => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const theme = useTheme()
  const [isLoading, setLoading] = useState(false)
  const [files, setFiles] = useState([])

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
    return () => {
      setFiles([])
    }
  }, [])


  //handle files
  const handleFiles = files => {
    setFiles(files)
  }

  //submit
  const convertFileToBase64 = (file) => {
    if (!(file instanceof File)) {
      console.error("Received non-File object:", file);
      throw new Error("Provided parameter is not a valid File object");
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleConvertToBase64 = async () => {
    if (files.length > 0) {
      try {
        const base64 = await convertFileToBase64(files[0]);
        if (!isValidBase64(base64)) {
          throw new Error("Invalid base64 string");
        }
        setOpenImport(false)

        dispatch(bulkTaskCreate({ base64string: base64 })).then(res => {
          handlestate(res)
          dispatch(fetchTasks(id))
          setLoading(false)
        });
      } catch (error) {
        console.error("Error during base64 handling:", error);
      }
    }
  };
  const isValidBase64 = (str) => {
    try {
      const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

      return base64Regex.test(str);
    } catch (error) {
      console.error("Error validating base64:", error);

      return false;
    }
  };
  const handleClose = (e, v) => {
    // v == 'backdropClick' ? setOpenImport(true) : setOpenImport(false)
    setOpenImport(false)
  }

  const handlestate = (res) => {
    if (res.payload.status == 200) {
      customSuccessToast(res.payload.message)
    } else {
      customErrorToast('Task creation failed')

    }
    console.log(res);
  }

  return (
    <>
      <Dialog fullWidth open={isOpenImport} maxWidth='sm' onClose={handleClose}>
        <DialogContent
          sx={{
            position: 'relative',
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important, ${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important, ${theme.spacing(12.5)} !important`]
          }}
        >
          <IconButton
            size='small'
            onClick={() => setOpenImport(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5'>Add Task File</Typography>
            <Typography variant='body2'>Add task sheet for your project</Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <FileUpload onSelectFiles={handleFiles} />
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
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            sx={{ mr: 1 }}
            onClick={handleConvertToBase64}
            disabled={files.length == 0}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {isLoading && <BackdropSpinner />}
    </>
  )
}

export default AddTaskFiles
