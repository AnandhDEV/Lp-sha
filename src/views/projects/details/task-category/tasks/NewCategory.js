// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {
  Avatar,
  Checkbox,
  Chip,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
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
import {
  editCategory,
  fetchTasks,
  postCategory,
  setCategories,
  setEditTask,
  setEmpty,
  setNewTask,
  setTaskLists,
  fetchProjectById
} from 'src/store/apps/projects'
import { formatLocalDate } from 'src/helpers/dateFormats'
import toast from 'react-hot-toast'
import { categoryRequest } from 'src/helpers/requests'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { handleResponse } from 'src/helpers/helpers'
import { unwrapResult } from '@reduxjs/toolkit'
import { customErrorToast } from 'src/helpers/custom-components/toasts'
import { NODATA } from 'src/helpers/constants'
import { BackdropSpinner } from 'src/@core/components/spinner'
import { useRouter } from 'next/router'

const NewTaskCategory = ({ isOpen, setOpen, category, onClose }) => {
  const [categoryName, setCategoryName] = useState(null)
  const [isBillable, setBillable] = useState(false)
  const [isgetBillable, setGetBillable] = useState(false)
  const [isError, setError] = useState(false)
  const [isExist, setExist] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const { id } = router.query
  const store = useSelector(state => state.projects)
  const STATUS = ['Completed', 'Not Started', 'Working on it', 'Due']
  const STATUS_COLOR = ['success', 'warning', 'info', 'error']
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id))
        .then(unwrapResult)
        .then(res => {
          if (res.result) {
            setBillable(res.result?.isBillable)
            setDisabled(res.result.isBillable ? false : true)
          }
        })
        .catch(error => {
          // Handle error if fetching project fails
          console.error(error)
        })
    }
  }, [dispatch, id])

  useEffect(()=>{
    if (category) {
      setCategoryName(category.taskCategory)
      setBillable(category.isBillable)
    }
  }, [category])
  

  const reset = () => {
    setCategoryName(null)
    // setBillable(true);
    setError(false)
    setExist(false)
    setLoading(false)
  }

  //update state

  const createTaskCategoryState = newCategory => {
    let taskList = [...store.taskLists]
    taskList.push({
      taskCategoryId: newCategory.id,
      taskCategory: newCategory.name,
      isBillable: newCategory.isBillable,
      projectId: newCategory.projectId,
      tasks: []
    })
    dispatch(setEmpty(false))
    dispatch(setTaskLists(taskList))
    setLoading(false)
  }

  const updateTaskCategoryState = newCategory => {
    setLoading(true)
    let taskList = [...store.taskLists]
    const index = taskList.findIndex(o => o.taskCategoryId == newCategory?.id)
    taskList[index] = {
      ...taskList[index],
      taskCategory: newCategory?.name,
      isBillable: newCategory?.isBillable
    }
    dispatch(setEmpty(false))
    dispatch(setTaskLists(taskList))
    setLoading(false)
  }

  //CREATE
  const createNewCategory = () => {
    setLoading(true)
    try {
      if (categoryName) {
        const projectId = id
        const request = categoryRequest(0, categoryName, isBillable, projectId)
        dispatch(postCategory(request))
          .then(unwrapResult)
          .then(res => {
            handleResponse('create', res, createTaskCategoryState)
            setLoading(false)
            setOpen(false)
            setBillable(true)
          })
      } else {
        setLoading(false)
        setError(true)
      }
    } catch (error) {
      customErrorToast(NODATA.error)
      setLoading(false)
    }
  }
  //UPDATE
  const updateTaskCategory = () => {
    try {
      setLoading(true)
      if (categoryName) {
        const projectId = id
        const request = categoryRequest(
          category?.taskCategoryId,
          categoryName,
          isBillable,
          projectId
        )

        dispatch(editCategory(request))
          .then(unwrapResult)
          .then(res => {
            handleResponse('update', res, updateTaskCategoryState)
            setOpen(false)
            setLoading(false)
          })
      } else {
        setError(true)
        setLoading(false)
      }
    } catch (error) {
      customErrorToast(NODATA.error)
    }
  }

  //SUBMIT
  const onSubmit = () => {
    try {
      setLoading(true)

      if (!categoryName) {
        setError(true)

        return
      }
      const tasks = [...store.taskLists]
      const isExistingCategory = tasks.some(
        o =>
          o.taskCategory?.replaceAll(' ', '')?.toLowerCase() ===
            categoryName?.replaceAll(' ', '')?.toLowerCase() &&
          o.taskCategoryId !== category?.taskCategoryId
      )
      if (isExistingCategory) {
        setExist(true)
        setLoading(false)
      } else {
        setExist(false)

        category ? updateTaskCategory() : createNewCategory()
        setCategoryName(null)
      }
    } catch (error) {}
  }

  const handleClose = () => {
    onClose ? onClose() : setOpen(false)
    reset()
  }

  return (
    <>
      {isLoading && <BackdropSpinner />}
      <Box>
        <Drawer anchor='right' open={isOpen} onClose={() => setOpen(false)}>
          <form onSubmit={e => e.preventDefault()}>
            <Grid container spacing={5} sx={{ p: 8, width: 420 }}>
              <Grid
                item
                xs={12}
                className='gap-1'
                justifyContent='space-between'
                alignItems='center'
              >
                <Typography color='secondary'>
                  {category ? 'Update Category' : 'Add New Category'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Category '
                  value={categoryName}
                  placeholder='Category Name'
                  autoComplete='off'
                  onChange={e => {
                    if ((setCategoryName(e.target.value), e.target.value.length > 0)) {
                      setError(false)
                      setExist(false)
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Icon icon='mdi:shape-outline' />
                      </InputAdornment>
                    )
                  }}
                />
                {(isError || categoryName == '') && (
                  <FormHelperText sx={{ color: 'error.main' }}>Category is required</FormHelperText>
                )}
                {isExist && categoryName?.length > 0 && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    Category already exist
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  label='Billable'
                  control={
                    <Checkbox
                      checked={isBillable}
                      onChange={e => setBillable(e.target.checked)}
                      name='color-primary'
                      disabled={disabled}
                    />
                  }
                />
              </Grid>

              <Grid columnGap={2} item xs={12} className='flex-right' sx={{ mt: 5 }}>
                <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                  Close
                </Button>
                <Button size='large' variant='contained' onClick={onSubmit}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Drawer>
      </Box>
    </>
  )
}

export default NewTaskCategory
