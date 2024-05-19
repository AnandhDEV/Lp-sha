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
  Autocomplete,
  Avatar,
  Checkbox,
  Chip,
  Dialog,
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
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTaskType,
  fetchTasks,
  fetchUsers,
  postTask,
  putTask,
  setEditTask,
  setNewTask,
  setTaskLists
} from 'src/store/apps/projects'
import { formatLocalDate } from 'src/helpers/dateFormats'
import toast from 'react-hot-toast'
import { unwrapResult } from '@reduxjs/toolkit'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { fetchStatus } from 'src/store/absence-management'
import { taskRequest } from 'src/helpers/requests'
import { STATUS, TASK_PRIORITIES, statusObj, typeObj } from 'src/helpers/constants'
import {
  ConvertHoursToTime,
  ConvertTimeStringToDecimal,
  getRandomColor,
  handleResponse
} from 'src/helpers/helpers'
import { BackdropSpinner } from 'src/@core/components/spinner'
import { fetchProjectStatus } from 'src/store/settings'
import { useAuth } from 'src/hooks/useAuth'
import TaskFile from './taskFile'

const defaultValues = {
  taskName: '',
  taskDescription: '',
  taskStatusId: 1,
  taskEstimateHours: '',
  dueDate: new Date(),
  taskAssignedUserId: {},
  taskPriorityId: 1,
  isBillable: true,
  taskCategoryId: 0,
  taskTypeId: 1
}

const schema = yup.object().shape({
  taskName: yup.string().trim().required('Task is required'),
  taskDescription: yup.string().notRequired(),
  taskStatusId: yup.number().notRequired(),
  taskEstimateHours: yup
    .number()
    // .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)')
    // .max(8)
    .typeError('Hours is not valid')
    .required('Estimated hours is required'),
  dueDate: yup.date().required('Due Date  is required'),
  taskAssignedUserId: yup.object().required('Task Owner required'),
  taskPriorityId: yup.number().positive().required('Priority is required'),
  taskTypeId: yup.number().notRequired()
})

const NewTask = ({ isOpen, setOpen, category, edit, id }) => {
  const [assignees, setAssignees] = useState([])
  const [index, setIndex] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [role, setRole] = useState(4)
  const [project, setProject] = useState(null)
  const [categories, setCategories] = useState(null)

  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const _settings = useSelector(state => state.settings)
  const auth = useAuth()
  const roleId = auth.user?.roleId

  const {
    register,
    setValue,
    setError,
    reset,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    shouldUnregister: false,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const [file, setFile] = useState(null)

  const handleFileAdded = selectedFile => {
    setFile(selectedFile)
    setValue('files', selectedFile)
  }

  const handleFileDeleted = () => {
    setValue('files', null)
  }

  useEffect(() => {
    if (category) {
      reset({
        taskPriorityId: 1,
        taskStatusId: 1,
        dueDate: new Date(),
        isBillable: true
      })
    }
  }, [category, isOpen])

  useEffect(() => {
    setProject(JSON.parse(localStorage.getItem('project')))
    setRole(roleId)
    dispatch(fetchProjectStatus())
    dispatch(fetchTaskType())
    store.users == null &&
      dispatch(fetchUsers())
        .then(unwrapResult)
        .then(res => {
          setAssignees(res.result)
        })
  }, [])

  useEffect(() => {
    if (store.editTask != null && Object.keys(store.editTask).length > 0) {
      const _assignees = assignees.length > 0 ? assignees : store.users
      const {
        taskName,
        taskDescription,
        taskStatusId,
        taskCategoryId,
        taskPriorityId,
        taskTypeId,
        taskEstimateHours,
        dueDate,
        taskAssignedUserId,
        isBillable,
        files
      } = store.editTask

      let assigneeObj = _assignees?.find(o => o.id == taskAssignedUserId)
      reset({
        taskName: taskName,
        taskDescription: taskDescription,
        dueDate: dueDate,
        isBillable: isBillable,
        taskAssignedUserId: {
          userName: assigneeObj.firstName + ' ' + assigneeObj.lastName,
          userId: assigneeObj?.id
        },
        taskEstimateHours: taskEstimateHours,
        taskPriorityId: taskPriorityId,
        taskStatusId: taskStatusId,
        files: files,
        taskTypeId: taskTypeId,
      })
      const _index =
        store.users?.length > 0 && store.users.findIndex(o => o.id === taskAssignedUserId)
      setIndex(_index)
    } else {
      reset({
        dueDate: new Date(),
        taskPriorityId: 1
      })
    }
  }, [isOpen, store.editTask])

  useEffect(() => {
    const sortedTaskList = store.taskLists ? [...store.taskLists] : []
    setCategories(sortedTaskList)
  }, [store.taskLists])

  //create state
  const createTaskState = newTask => {
    setLoading(true)
    const categories = [...store.taskLists]
    const index = categories.findIndex(o => o.taskCategoryId == newTask?.taskCategoryId)
    const tasks = [...categories[index]?.tasks, newTask]
    categories[index] = {
      ...categories[index],
      tasks: tasks
    }

    dispatch(setTaskLists(categories))
    setLoading(false)
    reset({})
    dispatch(setEditTask(null))
  }

  //update state
  const updateTaskState = task => {
    const categories = [...store.taskLists]
    const taskDetail = categories.findIndex(o => o.id == task?.id)

    if (task.taskCategoryId == store.selectedCategoryId) {
      const index = categories.findIndex(o => o.taskCategoryId == task?.taskCategoryId)
      const tasks = index != -1 ? [...categories[index].tasks.flat()] : []
      const taskIndex = tasks.findIndex(o => o.id == task.id)
      tasks[taskIndex] = task
      categories[index] = {
        ...categories[index],
        tasks: tasks
      }
      dispatch(setTaskLists(categories))
      dispatch(setEditTask(null))
      setLoading(false)
    } else {
      const index = categories.findIndex(o => o.taskCategoryId == store.selectedCategoryId)
      const tasks = [...categories[index].tasks.flat()]
      const taskIndex = tasks.findIndex(o => o.id == task.id)
      tasks.splice(taskIndex, 1)

      categories[index] = {
        ...categories[index],
        tasks: tasks
      }
      const updateIndex = categories.findIndex(o => o.taskCategoryId == task?.taskCategoryId)
      const updatetasks = [...categories[updateIndex]?.tasks, task]
      categories[updateIndex] = {
        ...categories[updateIndex],
        tasks: updatetasks
      }
      dispatch(setTaskLists(categories))
      reset()
      setLoading(false)
    }
  }
  // submit
  const onSubmit = data => {
    setLoading(true)
    setOpen(false)
    const isEdit = store.editTask && Object.keys(store.editTask).length > 0
    const category = JSON.parse(localStorage.getItem('category'))
    const tasks = category.tasks.flatMap(o => o.taskName?.trim()?.toLowerCase())
    if (!isEdit && tasks.includes(data.taskName?.trim().toLowerCase())) {
      return toast.error('Task Already exist in this category')
    }
    let taskCategorytemp = data.taskCategoryId ? data.taskCategoryId : category.taskCategoryId
    let tempdata = { ...data, taskCategoryId: taskCategorytemp }
    const request = taskRequest({
      id: isEdit ? store.editTask.id : 0,
      taskCategoryId: category?.taskCategoryId,
      projectId: id,
      taskStatusId: data.taskStatusId || 1,
      isBillable: data.isBillable,
      taskDescription: data.taskDescription,
      Files: data.files,
      taskTypeId: data.taskTypeId || 1,
      // taskAssignedUserId: data.taskAssignedUserId.id,
      ...tempdata
    })
    handleClose()
    dispatch(isEdit ? putTask(request) : postTask(request))
      .then(unwrapResult)
      .then(res => {
        isEdit && res['hasError'] != null
          ? handleResponse('update', res, updateTaskState)
          : handleResponse('create', res, createTaskState)
          res?.hasError && setLoading(false)
      })
      
  }
  const handleClose = (e, v) => {
    if (v != 'backdropClick') {
      setOpen(false)
      reset({})
    }
  }


  return (
    <Box>
      {isLoading && <BackdropSpinner />}

      <Dialog fullWidth open={isOpen} maxWidth='md' onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6} sx={{ p: 8, width: 900 }}>
            <Grid item xs={12} className='gap-1' justifyContent='space-between' alignItems='center'>
              <Typography color='secondary'>{edit ? `Update Task` : 'Add New task'}</Typography>
              {/* <Typography color='secondary'>{edit ? `Update Task  ${store.editTask?.id}` : 'Add New task'}</Typography> */}
              <Grid
                item
                xs={3}
                className='gap-1'
                justifyContent='space-between'
                alignItems='center'
              >
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-outlined-label' required>
                    Category
                  </InputLabel>
                  <Controller
                    name='taskCategoryId'
                    control={control}
                    rules={{ required: true }}
                    defaultValue={store.selectedCategoryId}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        required
                        label='Category'
                        value={value}
                        //defaultValue={store.selectedCategoryId}
                        onChange={onChange}
                        startAdornment={
                          <InputAdornment position='start'>
                            <Icon icon='mdi:square-edit-outline' />
                          </InputAdornment>
                        }
                      >
                        {categories?.map(
                          (
                            category,
                            i // Assuming `result` holds the response from API
                          ) => (
                            <MenuItem key={i} className='gap-1' value={category.taskCategoryId}>
                              <CustomChip
                                key={i}
                                label={category.taskCategory}
                                //skin='light'
                                // color={typeObj[type.taskTypeId].color}
                                skin='light'
                                color='secondary'
                              />
                            </MenuItem>
                          )
                        )}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='taskName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      label='Task *'
                      value={value}
                      placeholder='Task Name'
                      onChange={onChange}
                      autoComplete='off'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='mdi:checkbox-marked-circle-auto-outline' />
                          </InputAdornment>
                        )

                      }}
                    />
                  )}
                />
                {errors.taskName && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.taskName.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='taskDescription'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      label='Description '
                      value={value}
                      placeholder='Task Description'
                      multiline
                      onChange={onChange}
                      autoComplete='off'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='mdi:file-document-edit-outline' />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
                {errors.taskDescription && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.taskDescription.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-outlined-label' required>
                  Status
                </InputLabel>
                <Controller
                  name='taskStatusId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      required
                      label='Status'
                      id='demo-simple-select-outlined'
                      labelId='demo-simple-select-outlined-label'
                      value={value || 1}
                      defaultValue={1}
                      onChange={onChange}
                      autoComplete='off'
                      startAdornment={
                        <InputAdornment position='start'>
                          <Icon icon='mdi:list-status' />
                        </InputAdornment>
                      }
                    >
                      {_settings.ProjectStatus?.map((status, i) => (
                        <MenuItem key={i} className='gap-1' value={status.id}>
                          <CustomChip
                            key={i}
                            label={status.taskStatusName}
                            skin='light'
                            color={statusObj[status.id]?.color || 'primary'}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.taskStatusId && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.taskStatusId.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-outlined-label' required>
                  Type
                </InputLabel>
                <Controller
                  name='taskTypeId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      required
                      label='Task Type'
                      value={value || 1}
                      defaultValue={1}
                      onChange={onChange}
                      autoComplete='off'
                      startAdornment={
                        <InputAdornment position='start'>
                          <Icon icon='mdi:square-edit-outline' />
                        </InputAdornment>
                      }
                    >
                      {store.taskType?.map(
                        (
                          type,
                          i // Assuming `result` holds the response from API
                        ) => (
                          <MenuItem key={i} className='gap-1' value={type.taskTypeId}>
                            <CustomChip
                              key={i}
                              label={type.taskTypeName}
                              skin='light'
                              color={typeObj[type.taskTypeId].color}
                            />
                          </MenuItem>
                        )
                      )}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-outlined' required>
                  Priority
                </InputLabel>
                <Controller
                  name='taskPriorityId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      required
                      label='Priority'
                      id='demo-simple-outlined'
                      labelId='demo-simple-select-outlined'
                      value={value}
                      defaultValue={1}
                      onChange={onChange}
                      autoComplete='off'
                      startAdornment={
                        <InputAdornment position='start'>
                          <Icon icon='mdi:priority-high' />
                        </InputAdornment>
                      }
                    >
                      {TASK_PRIORITIES.map((prior, i) => (
                        <MenuItem key={i} className='gap-1' value={prior.id}>
                          <CustomChip key={i} label={prior.name} skin='light' color={prior.color} />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.taskPriorityId && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.taskPriorityId.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='dueDate'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <DatePickerWrapper>
                      <DatePicker
                        id='picker-filter-from-date'
                        selected={value || new Date()}
                        popperPlacement='auto'
                        onChange={date => {
                          const formattedDate = date instanceof Date ? date : new Date(date)
                          const year = formattedDate.getFullYear().toString()
                          if (year.length <= 4) {
                            onChange(date)
                          }
                        }}
                        autoComplete='off'
                        minDate={new Date()}
                        onKeyDown={e => {
                          if (e.key === 'Delete' || e.key === 'Backspace') {
                            return
                          }
                          if (!/[0-9]/.test(e.key) && e.key !== '/' && e.key !== '-') {
                            e.preventDefault()
                          }
                        }}
                        customInput={
                          <CustomInput
                            label='Due Date *'
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
                    </DatePickerWrapper>
                  )}
                />
                {errors.dueDate && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.dueDate.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='taskEstimateHours'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      type='number'
                      // value={Math.round(value * 100) / 100}
                      value={value}
                      onChange={onChange}
                      autoComplete='off'
                      label='Estimated Hours *'
                      placeholder='Estimated Hours'
                      onKeyDown={e => {
                        if (e.key === '-' || e.key === '+') {
                          e.preventDefault()
                        }
                      }}
                      inputProps={{ min: 0 }}
                      disabled={
                        store.editTask &&
                        project &&
                        !project.allowUsersToChangeEstHours &&
                        role == 4 &&
                        store.projectRoleId == 3
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon='mdi:clock-outline' />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
                {errors.taskEstimateHours && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.taskEstimateHours.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='taskAssignedUserId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      // options={store.users || []}
                      options={
                        store.projectMembers?.map(u => ({
                          userName: u.userName,
                          userId: u.userId
                        })) || []
                      }
                      // .filter(user => project && project.assignees.includes(user.id))}

                      id='autocomplete-limit-tags'
                      getOptionLabel={option => `${option?.userName} `}
                      defaultValue={
                        store.editTask && Object.keys(store.editTask).length > 0
                          ? store.users
                            ? store.users[index]
                            : null
                          : null
                      }
                      value={field.value}
                      autoComplete='off'
                      onChange={(event, value) => {
                        field.onChange(value)
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={Boolean(errors.taskAssignedUserId)}
                          label='Task owner *'
                          placeholder='Owner'
                        />
                      )}
                    />
                  )}
                />
                {errors.taskAssignedUserId && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.taskAssignedUserId.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl sx={{ mb: 6 }}>
                <Controller
                  name='isBillable'
                  control={control}
                  rules={{ required: false }}
                  defaultValue={category?.isBillable}
                  render={({ field: { value, onChange } }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value}
                          disabled={!category?.isBillable}
                          onChange={onChange}
                        />
                      }
                      label='Billable'
                    />
                  )}
                />
                {errors.isBillable && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.isBillable.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid columnGap={2} item xs={12} className='flex-right'>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='files'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <TaskFile
                        onFileAdded={handleFileAdded}
                        onFileDeleted={handleFileDeleted}
                        initialFile={value}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Button
                size='large'
                variant='outlined'
                color='secondary'
                onClick={() => {
                  setOpen(false), dispatch(setEditTask(null)), reset({})
                }}
              >
                Close
              </Button>
              <Button size='large' variant='contained' type='submit'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Dialog>
    </Box>
  )
}

export default NewTask
