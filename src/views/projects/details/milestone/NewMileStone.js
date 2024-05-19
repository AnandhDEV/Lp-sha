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
import {
  deleteMileStone,
  fetchMileStones,
  postMileStone,
  putMilestone,
  setCategories,
  setEditMilestone,
  setEditTask,
  setEmpty,
  setMileStones,
  setNewTask,
  setTaskLists
} from 'src/store/apps/projects'
import { formatLocalDate } from 'src/helpers/dateFormats'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { mileStoneRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import CustomCategoryPicker from 'src/views/components/autocomplete/CustomCategoryPicker'
import dayjs from 'dayjs'
import { handleResponse } from 'src/helpers/helpers'
import { NODATA } from 'src/helpers/constants'
import NewDepartment from 'src/views/configuration/department/NewDepartment'
import { BackdropSpinner } from 'src/@core/components/spinner'
import { useAuth } from 'src/hooks/useAuth'

var isBetween = require('dayjs/plugin/isBetween')

dayjs.extend(isBetween)

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
  name: '',
  description: '',
  startDate: null,
  endDate: null,
  categories: []
}

const schema = yup.object().shape({
  name: yup.string().trim().required('Milestone name is required')
    .test('is-not-empty', 'Milestone cannot be empty', value => value.trim() !== ''),
  description: yup.string().notRequired(),
  startDate: yup.date().required('Start Date is required'),
  endDate: yup.date().required('End Date is required')

})

const NewMileStone = ({ isOpen, setOpen, id }) => {
  const [isUser, setIsUser] = useState(true)
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const auth = useAuth()
  const IsUser = auth.user?.roleId == 4

  const { mileStones, editMilestone } = useSelector(state => state.projects)

  const selectedCategoryIds = editMilestone
    ? editMilestone.taskCategories?.map(category => category.id)
    : []

  const [milestone, setMilestone] = useState({
    milestoneName: '',
    startDate: '',
    endDate: '',
    categories: [],
    categoryList: []
  })

  const [maxDate, setMaxDate] = useState(null)
  const [minDate, setMinDate] = useState(null)

  useEffect(() => {
    setLoading(true)
    setIsUser(IsUser)
    setMilestone({ ...milestone, categoryList: store.categories })
    setLoading(false)
  }, [store.categories])

  const {
    register,
    reset,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (editMilestone) {
      reset({
        name: editMilestone.name,
        description: editMilestone.description,
        startDate: new Date(editMilestone.startDate),
        endDate: new Date(editMilestone.endDate)
      })
      const _items = store.categories.filter(
        o => !editMilestone.taskCategories.some(tc => tc.id == o.id)
      )
      setMilestone(ms => ({
        ...ms,
        categories: editMilestone.taskCategories,
        categoryList: _items
      }))
    } else {
      reset({})
      setMilestone(ms => ({ ...ms, categories: [] }))
    }
  }, [isOpen, editMilestone])

  useEffect(() => {
    const categoryByProject = store.categories?.filter(c => c.projectId == id)
    const filtered = categoryByProject?.filter(category =>
      !store.mileStones?.some(milestone =>
        milestone.taskCategories.some(taskCategory => taskCategory.id === category.id)
      )
    );
    setFilteredCategories(filtered);
  }, [store.categories, store.mileStones]);


  //CREATE

  const Proj = newReq => {
    let Ms = [...mileStones]
    if (editMilestone) {
      const index = Ms.findIndex(item => item.id === editMilestone.id)
      if (index !== -1) {
        Ms[index] = newReq
      }
    } else {
      Ms.push(newReq)
    }
    Ms.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    dispatch(setMileStones(Ms))
    reset()
    setLoading(false)
  }

  const onSubmit = data => {
    const error = mileStones?.some(item => {
      if (editMilestone && item.id === editMilestone.id) {
        return false
      }
      const isStartDateOverlap = dayjs(data.startDate).isBetween(
        dayjs(item.startDate),
        dayjs(item.endDate),
        null,
        '[)'
      )
      const isEndDateOverlap = dayjs(data.endDate).isBetween(
        dayjs(item.startDate),
        dayjs(item.endDate),
        null,
        '(]'
      )
      const ExistingDate = isStartDateOverlap || isEndDateOverlap

      const isExistInNew =
        dayjs(item.startDate).isBetween(dayjs(data.startDate), dayjs(data.endDate), null, '[]') ||
        dayjs(item.endDate).isBetween(dayjs(data.startDate), dayjs(data.endDate), null, '[]')

      return ExistingDate || isExistInNew
    })

    if (error) {
      toast.error('Milestone date range overlaps with an existing milestone')
    } else {
      try {
        const req = {
          projectId: id,
          taskCategories: milestone.categories.map(o => o.id),
          ...data
        }

        setOpen(false)
        reset()

        const request = mileStoneRequest(req)
        if (editMilestone) {
          setLoading(true)
          dispatch(putMilestone({ ...request, id: editMilestone.id }))
            .then(unwrapResult)
            .then(res => {
              handleResponse('update', res, Proj)
              setLoading(false)

            })
            .catch(error => toast.error(error, { duration: 3000, position: 'top-right' }))
        } else {
          setLoading(true)
          dispatch(postMileStone(request))
            .then(unwrapResult)
            .then(res => {
              handleResponse('create', res.data, Proj)
              setLoading(false)

            })
        }
      } catch (error) {
        toast.error(error, { duration: 3000, position: 'top-right' })
      }
    }
  }

  //UPDATE
  const updateTask = () => {
    try {
      const tasks = [...store.taskLists]
      let index = tasks.findIndex(o => o.id === localNewTask.id)
      if (index != -1)
        tasks[index] = { ...localNewTask, dueDate: formatLocalDate(localNewTask.dueDate) }
      dispatch(setTaskLists(tasks))
      dispatch(setEditTask({}))
      reset()
      setOpen(false)
      toast.success('Task Updated', { duration: 3000, position: 'top-right' })
    } catch (error) {
      toast.error(error, { duration: 3000, position: 'top-right' })
    }
  }

  //CLOSE

  const handleClose = () => {
    setOpen(false)
    // dispatch(setEditMilestone(null))
    !editMilestone
      ? setMilestone(ms => ({ ...ms, categories: [], categoryList: store.categories }))
      : // setMilestone(ms => ({ ...ms, categories: [], categoryList: [] }))
      reset()
  }

  // SET FIELDS


  const handleChangeCategory = categories => {
    setMilestone(ms => ({ ...ms, categories: categories }))
  }
  const handleItems = items => {
    setMilestone(ms => ({ ...ms, categoryList: items }))
  }

  // ... other code
  const handleFromDateChange = selectedDate => {
    // Set the "to date" value when "from date" changes
    setValue('endDate', selectedDate)
  }

  useEffect(() => {
    setMinDate(new Date(JSON.parse(localStorage.getItem('project')).startDate)) //Project start date
    setMaxDate(new Date(JSON.parse(localStorage.getItem('project')).endDate)) //Project ENd date
  }, [])

  const removeMileStone = data => {
    if (data) {
      const mileStones = [...store.mileStones]
      const newData = mileStones.filter(o => o.id != editMilestone.id)
      dispatch(setMileStones(newData))
    }
  }

  const handleDelete = () => {
    handleClose()
    if (editMilestone) {
      setLoading(true)
      dispatch(deleteMileStone(editMilestone.id))
        .then(unwrapResult)
        .then(res => {
          handleResponse('delete', res, removeMileStone, editMilestone)
          setLoading(false)
        })
    }
  }

  const currentYear = new Date().getFullYear()
  //const minDate = new Date(currentYear, 0, 1)

  return (
    <Box>
      {isLoading && <BackdropSpinner />}
      <Drawer anchor='right' open={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5} sx={{ p: 8, width: 420 }}>
            <Grid item xs={12} className='gap-1' justifyContent='space-between' alignItems='center'>
              <Typography color='secondary'>
                {editMilestone ? `Update Milestone` : `Add Milestone`}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      label='Milestone *'
                      value={value}
                      placeholder='Milestone Name *'
                      onChange={onChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='mdi:flag-triangle' />
                          </InputAdornment>
                        )
                      }}
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

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='description'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      multiline
                      label='Description'
                      value={value}
                      placeholder='Description'
                      onChange={onChange}
                      sx={{ textAlign: 'justify' }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='mdi:order-bool-descending' />
                          </InputAdornment>
                        )
                      }}
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
              <DatePickerWrapper>
                <FormControl fullWidth>
                  <Controller
                    name='startDate'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        id='picker-filter-from-date'
                        selected={value}
                        popperPlacement='bottom'
                        autoComplete='off'
                        // minDate={minDate}
                        // maxDate={maxDate}
                        onChange={(e) => {
                          onChange(e)
                          setValue('endDate', '')
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Delete' || e.key === 'Backspace') {
                            return;
                          }
                          if (!/[0-9]/.test(e.key) && e.key !== '/' && e.key !== '-') {
                            e.preventDefault();
                          }
                        }}
                        customInput={
                          <CustomInput
                            label='Start Date *'
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  <Icon icon='mdi:calendar-outline' />
                                </InputAdornment>
                              )
                            }}
                          />
                        }
                      />
                    )}
                  />
                  {errors.startDate && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.startDate.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12}>
              <DatePickerWrapper>
                <FormControl fullWidth>
                  <Controller
                    name='endDate'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        id='picker-filter-from-date'
                        selected={value}
                        popperPlacement='bottom'
                        onChange={onChange}
                        minDate={watch('startDate')}
                        disabled={!watch('startDate')}
                        autoComplete='off'
                        customInput={
                          <CustomInput
                            label='End Date *'
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  <Icon icon='mdi:calendar-outline' />
                                </InputAdornment>
                              )
                            }}
                          />
                        }
                      />
                    )}
                  />
                  {errors.endDate && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {errors.endDate.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='categories'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomCategoryPicker
                      label='Categories'
                      items={filteredCategories}
                      values={milestone.categories}
                      setCategories={handleChangeCategory}
                      originalItems={store.categories}
                      setItems={handleItems}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid columnGap={2} item xs={12} className='flex-right' sx={{ mt: 5 }}>
              <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                Close
              </Button>
              {editMilestone && (!isUser || store.projectRoleId !== 3) && (
                <Button size='large' variant='contained' color='secondary' onClick={handleDelete}>
                  Delete
                </Button>
              )}

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

export default NewMileStone
