// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import MenuItem from '@mui/material/MenuItem'
import StepLabel from '@mui/material/StepLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Menu,
  Radio,
  RadioGroup,
  Switch
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

/** store actions */
import {
  setClient,
  setCategory,
  setTasks,
  setProject,
  fetchClients,
  fetchUsers,
  setAssignees,
  setEditProject,
  putProject,
  putCategory,
  putTask,
  putProjectMap,
  fetchProjects
} from 'src/store/apps/projects'
import { Stack } from '@mui/system'
import AboutOverivew from 'src/views/pages/user-profile/profile/AboutOverivew'
import { unwrapResult } from '@reduxjs/toolkit'
import UserTable from './UserTable'
import { useRouter } from 'next/router'

const steps = [
  {
    title: 'Client',
    subtitle: 'Select Client'
  },
  {
    title: 'Projects',
    subtitle: 'Enter Project Details '
  },
  {
    title: 'Task category',
    subtitle: 'Enter Task Category'
  },
  {
    title: 'Tasks',
    subtitle: 'Enter Tasks'
  },
  {
    title: 'Assignees',
    subtitle: 'Select Users'
  }
]

const defaultAssigneeValues = []

const clientSchema = yup.object().shape({
  client: yup.string().required()
})

const projectSchema = yup.object().shape({
  name: yup.string().required(),
  plannedBudget: yup.number().required().positive().integer(),
  plannedHours: yup.number().required().positive().integer(),
  isBillable: yup.boolean(),
  allowOpenTasks: yup.boolean()
})

const categorySchema = yup.object().shape({
  name: yup.string().required(),
  isBillable: yup.boolean()
})

const taskSchema = yup.object().shape({
  name: yup.string().required(),
  category: yup.string().required(),
  hours: yup.number().required(),
  isBillable: yup.boolean()
})

const assigneeSchema = yup.object().shape({})

const ProjectsEditStepper = ({ id }) => {

  // ** States
  const [activeStep, setActiveStep] = useState(0)
  const [setEdit, setIsEdit] = useState(false)

  const [state, setState] = useState({
    password: '',
    password2: '',
    showPassword: false,
    showPassword2: false,
    isAnotherCategory: false,
    anotherCategories: []
  })
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)

  const defaultProjectValues = {
    name: '',
    plannedBudget: '',
    plannedHours: null,
    isBillable: true,
    allowOpenTasks: false
  }

  const defaultCategoryValues = {
    name: '',
    isBillable: true
  }

  const defaultTaskValues = {
    name: '',
    category: '',
    hours: ''
  }

  // ** Hooks
  useEffect(() => {
    dispatch(fetchClients())
    dispatch(fetchUsers())
    const projects = [...store.allProjects]
    const editProject = projects.find(p => p.id === Number(id ? id : ''))
    const tasks = editProject?.taskCategory?.flatMap(o => o.tasks)
    dispatch(setTasks(tasks))
    dispatch(setEditProject(editProject))
    dispatch(setAssignees(editProject?.assignee ?? []))
  }, [dispatch, id, store.allProjects])

  const {
    reset: clientReset,
    control: clientControl,
    watch: clientWatch,
    handleSubmit: handleClientSubmit,
    formState: { errors: clientErrors }
  } = useForm({
    resolver: yupResolver(clientSchema)
  })

  const {
    reset: projectReset,
    control: projectControl,
    watch: projectWatch,
    handleSubmit: handleProjectSubmit,
    formState: { errors: projectErrors }
  } = useForm({
    defaultValues: defaultProjectValues,
    resolver: yupResolver(projectSchema)
  })

  const {
    reset: categoryReset,
    control: categoryControl,
    watch: categoryWatch,
    handleSubmit: handleCategorySubmit,
    formState: { errors: categoryErrors }
  } = useForm({
    defaultValues: defaultCategoryValues,
    resolver: yupResolver(categorySchema)
  })

  const {
    reset: taskReset,
    control: taskControl,
    watch: taskWatch,
    handleSubmit: handleTaskSubmit,
    formState: { errors: taskErrors }
  } = useForm({
    defaultValues: defaultTaskValues,
    resolver: yupResolver(taskSchema)
  })

  const {
    reset: assigneeReset,
    control: assigneeControl,
    watch: assigneeWatch,
    handleSubmit: handleAssigneeSubmit,
    formState: { errors: assigneeErrors }
  } = useForm({
    defaultValues: defaultAssigneeValues,
    resolver: yupResolver(assigneeSchema)
  })

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
    clientReset({ client: '' })
    projectReset({
      name: '',
      plannedBudget: '',
      plannedHours: '',
      isBillable: true,
      allowOpenTasks: false
    })
    categoryReset([{ index: 0, name: '', isBIllable: false }])
    taskReset([{ index: 0, name: '', category: '', hours: '' }])
    assigneeReset([])
  }

  const onSubmit = () => {
    setActiveStep(activeStep + 1)
    if (activeStep === steps.length - 1) {
      // toast.success('Form Submitted')
    }
  }

  const handleProjectType = e => {
    dispatch(setProject({ projectType: e.target.value }))
  }

  const onSaveProject = async e => {
    e.preventDefault()

    const { uniqueId, name, budget, hours, isBillable, projectTypeId, clientId } = store.editProject
    const clientUId = store.allClients?.find(o => o.id === clientId).uniqueId

    const request = {
      id: uniqueId,
      name: name,
      budget: budget,
      projectType: projectTypeId,
      hours: hours,
      clientUid: clientUId,
      isBillable: isBillable,
      isUndifinedTasksAllowed: false
    }
    dispatch(putProject({ request: request, afterSubmit: onSubmit }))
  }

  const onSaveCategory = e => {
    e.preventDefault()

    const { uniqueId, name, budget, hours, isBillable, projectTypeId, clientId, taskCategory } =
      store.editProject

    const request = {
      projectUId: uniqueId,
      taskCategory: taskCategory.map(category => ({
        name: category.name,
        taskCategoryUid: category.uniqueId,
        isBillable: category.isBillable
      }))
    }

    dispatch(putCategory({ request: request, afterSubmit: onSubmit }))
  }

  const onSaveTasks = e => {
    e.preventDefault()

    const { uniqueId, name, budget, hours, isBillable, projectTypeId, clientId, taskCategory } =
      store.editProject

    const request = {
      projectUid: uniqueId,
      taskResponse: taskCategory
        .flatMap(o => o.tasks)
        .map(t => ({
          taskUid: t.uniqueId,
          taskCategoryUid: t.taskCategoryId,
          description: t.description,
          hours: t.hours,
          dateTime: new Date().toISOString()
        }))
    }

    dispatch(putTask({ request: request, afterSubmit: onSubmit }))
  }

  const onSaveAssignee = async e => {
    e.preventDefault()

    const { uniqueId } = store.editProject

    const request = {
      project_id: uniqueId,
      mapping: managerAssignments.map(user => ({
        email: user.email,
        cost: user.allocatedProjectCost,
        projectRoleId: user.projectRoleId
      }))
    }
    dispatch(setEditProject({ ...store.editProject, assignee: managerAssignments }))
    dispatch(putProjectMap(request))
      .then(unwrapResult)
      .then(response => {
        toast.success('Assignees Updated', { duration: 3000, position: 'top-right' })
        setAssignees([])
        router.replace('/projects/list')
      })
      .catch(e => toast.error(error, { duration: 3000, position: 'top-right' }))
  }

  const onChangeCategoryOrTaskName = (e, index, name) => {
    var project = store.editProject
    var category = [...store.editProject.taskCategory]
    var tasks = [...store.editProject.taskCategory.flatMap(o => o.tasks)]

    switch (name?.toLowerCase()) {
      case 'category':
        category[index] = { ...category[index], name: e.target.value }
        dispatch(setEditProject({ ...store.editProject, taskCategory: category }))
        break
      case 'task':
        tasks[index] = {
          index: index,
          name: e.target.value,
          hours: tasks[index].hours,
          category: tasks[index].taskCategoryId
        }

        dispatch(setTasks(tasks))
        project = { ...project, taskCategory: category }
        dispatch(setEditProject(project))
        break

      default:
        break
    }
  }

  const onChangeTasks = (index, e, name) => {
    var project = store.editProject
    var categories = [...project.taskCategory]
    var tasks = [...categories.flatMap(o => o.tasks)]
    switch (name?.toLowerCase()) {
      case 'category':
        const category = categories.find(o => o.taskCategotyId === e.target.value)
        tasks[index] = { ...tasks, taskCategoryId: category.uniqueId }
        break
      case 'hours':
        tasks[index] = { ...tasks, hours: e.target.value.toString().trim() }

        break
      default:
        break
    }
    project = { ...project, taskCategory: categories }
    dispatch(setEditProject(project))
  }
  const [managerAssignments, setManagerAssignments] = useState([])

  const onChangeAssignees = (params, assignees) => {
    dispatch(setAssignees(assignees))
  }

  const addCategoryOrTask = name => {
    switch (name?.toLowerCase()) {
      case 'category':
        const categories = [
          ...store.editProject.taskCategory,
          { index: store.editProject.taskCategory?.length + 1, name: '', isBillable: false }
        ]

        dispatch(setEditProject({ ...store.editProject, taskCategory: categories }))
        break
      case 'task':
        const tasks = [
          ...store.tasks,
          {
            index: store.tasks?.length + 1,
            name: '',
            category: '',
            hours: ''
          }
        ]
        dispatch(setTasks(tasks))
        break

      default:
        break
    }
  }

  const onRemoveCategoryorTask = (index, name) => {
    switch (name?.toLowerCase()) {
      case 'category':
        const categories = [...store.editProject.taskCategory]
        var _category = []
        categories.forEach((element, i) => {
          if (i !== index)
            _category.push({
              ...element,
              index: i,
              name: element.name,
              isBillable: element.isBillable
            })
        })
        dispatch(setEditProject({ ...store.editProject, taskCategory: _category }))
        break
      case 'task':
        const tasks = [...store.tasks]
        var _tasks = []
        tasks.forEach((element, i) => {
          if (i !== index)
            _tasks.push({
              index: i,
              name: element.name,
              category: element.category,
              hours: element.hours
            })
        })
        dispatch(setTasks(_tasks))
        break

      default:
        break
    }
  }

  const handleIsBillable = (e, index, name) => {
    switch (name?.toLowerCase()) {
      case 'category':
        var c = [...store.editProject.taskCategory]
        c[index] = { index: index, name: c[index].name, isBillable: e.target.checked }
        dispatch(setEditProject({ ...store.editProject, taskCategory: c }))
        break
      case 'task':
        var task = [...store.tasks]
        task[index] = { index: index, name: task[index].name, isBillable: e.target.checked }
        dispatch(setTasks(task))
        break

      default:
        break
    }
  }

  const handleSkip = () => {
    onSubmit()
  }

  const onClearCategoryOrTask = name => {
    switch (name?.toLowerCase()) {
      case 'category':
        dispatch(setCategory([]))
        break
      case 'task':
        dispatch(setTasks([{ index: 0, name: '', category: '', hours: '' }]))
        break

      default:
        break
    }
  }

  const onChnageClient = e => {
    var project = store.editProject
    const client = store.allClients?.find(o => o.id === e.target.value)
    const editProject = { ...project, clientId: client?.id, clientName: client?.name }
    dispatch(setEditProject(editProject))
  }

  const onChangeProject = (name, value) => {
    var project = store.editProject
    switch (name) {
      case 'name':
        dispatch(setEditProject({ ...store.editProject, name: value }))
        break
      case 'budget':
        dispatch(setEditProject({ ...store.editProject, budget: isNaN(value) ? 0 : Number(value) }))
        break
      case 'hours':
        dispatch(setEditProject({ ...store.editProject, hours: isNaN(value) ? 0 : Number(value) }))
        break
      case 'isBillable':
        dispatch(setEditProject({ ...store.editProject, isBillable: value }))
        break
      case 'projectType':
        dispatch(setEditProject({ ...store.editProject, projectTypeId: value }))
        break

      default:
        break
    }
  }

  const [requiredskill, setRequiredskill] = useState([])

  const handleChange = event => {
    setRequiredskill(event.target.value)
  }

  const router = useRouter()

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={onSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[0].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[0].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='stepper-linear-client' htmlFor='stepper-linear-client'>
                    Client
                  </InputLabel>

                  <Select
                    value={store.editProject?.clientId ?? ''}
                    label='Client'
                    onChange={onChnageClient}
                    labelId='stepper-linear-client'
                    aria-describedby='stepper-linear-client'
                  >
                    {store.allClients?.map(client => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    )) || <></>}
                  </Select>

                  {store.editProject?.clientName == '' && (
                    <FormHelperText
                      sx={{ color: 'error.main' }}
                      id='stepper-linear-personal-country-helper'
                    >
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  size='large'
                  variant='outlined'
                  color='secondary'
                  onClick={() => router.replace('//projects/list/')}
                >
                  Back
                </Button>
                <Button size='large' type='submit' variant='contained'>
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 1:
        return (
          <form key={1} onSubmit={onSaveProject}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Grid>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {steps[1].title}
                  </Typography>
                  <Typography variant='caption' component='p'>
                    {steps[1].subtitle}
                  </Typography>
                </Grid>
                <Grid>
                  <RadioGroup
                    row
                    aria-label='controlled'
                    name='controlled'
                    value={store.editProject?.projectTypeId}
                    onChange={e => onChangeProject('projectTypeId', e.target.value)}
                  >
                    <FormControlLabel value={2} control={<Radio />} label='Fixed Price' />
                    <FormControlLabel value={1} control={<Radio />} label='T & M' />
                  </RadioGroup>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    value={store.editProject?.name ?? ''}
                    label='Project Name'
                    onChange={e => onChangeProject('name', e.target.value)}
                    placeholder='Enter Project Name'
                    error={Boolean(!store.editProject?.name)}
                    aria-describedby='stepper-linear-project-name'
                  />
                  {store.editProject?.name == '' && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-project-name'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    value={store.editProject?.budget ?? ''}
                    label='Planned Budget'
                    type='number'
                    onChange={e => onChangeProject('budget', e.target.value)}
                    placeholder='Enter Budget'
                    error={Boolean(!store.editProject?.budget)}
                    aria-describedby='stepper-linear-project-budget'
                  />
                  {store.editProject?.budget == '' && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-project-budget'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    value={store.editProject?.hours}
                    label='Planned Hours'
                    onChange={e => onChangeProject('hours', e.target.value)}
                    placeholder='Enter Hours'
                    error={Boolean(!store.editProject?.hours)}
                    aria-describedby='stepper-linear-project-hours'
                  />
                  {store.editProject?.hours == '' && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-project-hours'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label'>Required Skill</InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-multiple-select'
                    multiple
                    value={requiredskill}
                    label='Required Skill'
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>React</MenuItem>
                    <MenuItem value={20}>SharePoint</MenuItem>
                    <MenuItem value={30}>.Net</MenuItem>
                    <MenuItem value={40}>Python</MenuItem>
                    <MenuItem value={50}>Angular</MenuItem>
                    <MenuItem value={60}>SQL</MenuItem>
                    <MenuItem value={70}>Flutter</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    value={store.editProject?.isBillable}
                    onChange={e => onChangeProject('isBillable', e.target.checked)}
                    label='Billable'
                    id='stepper-linear-project-isBillable'
                  />
                </FormControl>
                {/*
                <FormControl fullWidth>
                  <FormControlLabel
                    control={<Switch />}
                    value={value}
                    onChange={() => {}}
                    label='Allow Open Tasks'
                    id='stepper-linear-project-allowOpenTasks'
                  />
                  {projectErrors.allowOpenTasks && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-project-allowOpenTasks'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl> */}
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  size='large'
                  variant='outlined'
                  color='secondary'
                  onClick={handleBack}
                  type='button'
                >
                  Back
                </Button>
                <Button size='large' type='submit' variant='contained'>
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 2:
        return (
          <form key={2} onSubmit={onSaveCategory}>
            <Grid container spacing={5}>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Box>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {steps[2].title}
                  </Typography>
                  <Typography variant='caption' component='p'>
                    {steps[2].subtitle}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                  <Button variant='text' onClick={() => onClearCategoryOrTask('category')}>
                    Clear
                  </Button>
                  <Button
                    variant='outlined'
                    startIcon={<Icon icon='mdi:add' />}
                    onClick={() => addCategoryOrTask('category')}
                  >
                    Add Category
                  </Button>
                </Box>
              </Grid>

              {store.editProject?.taskCategory?.map((category, index) => (
                <>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField
                        value={category.name}
                        label='Task Category'
                        onChange={e => onChangeCategoryOrTaskName(e, index, 'category')}
                        placeholder='Enter Task category'
                        aria-describedby='stepper-linear-category-name'
                      />
                    </FormControl>
                  </Grid>
                  <Grid sx={{ display: 'flex', alignItems: 'center', margin: '20px 0 0 20px' }}>
                    <IconButton
                      aria-label='capture screenshot'
                      color='error'
                      onClick={e => onRemoveCategoryorTask(index, 'category')}
                    >
                      <Icon icon='mdi:close-circle-outline' />
                    </IconButton>
                    &nbsp;
                    <FormControlLabel
                      label='Billable'
                      checked={category.isBillable}
                      control={
                        <Checkbox
                          size='medium'
                          name='color-primary'
                          color='success'
                          onChange={e => handleIsBillable(e, index, 'category')}
                        />
                      }
                    />
                  </Grid>
                </>
              ))}

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
                  Back
                </Button>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                  <Button size='large' type='button' variant='outlined' onClick={handleSkip}>
                    Skip
                  </Button>
                  <Button
                    size='large'
                    type='submit'
                    variant='contained'
                    disabled={store.editProject?.taskCategory?.length === 0}
                    onClick={onSaveCategory}
                  >
                    Next
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )
      case 3:
        return (
          <form key={3} onSubmit={onSaveTasks}>
            <Grid container spacing={5}>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Box>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {steps[3].title}
                  </Typography>
                  <Typography variant='caption' component='p'>
                    {steps[3].subtitle}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                  <Button variant='text' onClick={() => onClearCategoryOrTask('task')}>
                    Clear
                  </Button>
                  <Button
                    variant='outlined'
                    startIcon={<Icon icon='mdi:add' />}
                    onClick={() => addCategoryOrTask('task')}
                  >
                    Add Tasks
                  </Button>
                </Box>
              </Grid>

              {store.editProject?.taskCategory.map((category, index) => {
                return category?.tasks?.map((task, key) => {
                  return (
                    <Fragment key={key}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <TextField
                            value={task.description}
                            label='Task'
                            onChange={e => onChangeCategoryOrTaskName(e, key, 'task')}
                            placeholder='Enter Task'
                            aria-describedby='stepper-linear-category-name'
                          />
                        </FormControl>
                      </Grid>
                      {store.editProject?.taskCategory?.length > 0 && (
                        <Grid item xs={12} sm={2}>
                          <Select
                            fullWidth
                            value={category.taskCategotyId}
                            onChange={newValue => onChangeTasks(key, newValue, 'category')}
                            aria-describedby='stepper-task-category'
                          >
                            {store.editProject?.taskCategory.map(cat => (
                              <MenuItem key={cat.name} value={cat.taskCategotyId}>
                                {cat.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                      )}

                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          value={task.hours}
                          label='Hours'
                          onChange={e => onChangeTasks(index, e, 'hours')}
                          placeholder='Enter Task'
                          aria-describedby='stepper-linear-category-name'
                        />
                      </Grid>

                      {store.editProject?.taskCategory.flatMap(o => o.tasks).length > 1 && (
                        <Grid
                          sx={{ display: 'flex', alignItems: 'center', margin: '20px 0 0 20px' }}
                        >
                          <IconButton
                            aria-label='capture screenshot'
                            color='error'
                            onClick={e => onRemoveCategoryorTask(index, 'task')}
                          >
                            <Icon icon='mdi:close-circle-outline' />
                          </IconButton>
                        </Grid>
                      )}
                    </Fragment>
                  )
                })
              })}

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
                  Back
                </Button>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                  <Button size='large' type='button' variant='outlined' onClick={handleSkip}>
                    Skip
                  </Button>
                  <Button size='large' type='submit' variant='contained'>
                    Next
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )
      case 4:
        return (
          <form key={4} onSubmit={onSaveAssignee}>
            <Grid container spacing={5}>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Box>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {steps[4].title}
                  </Typography>
                  <Typography variant='caption' component='p'>
                    {steps[4].subtitle}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Stack spacing={3} sx={{ minWidth: 500 }}>
                  <Autocomplete
                    multiple
                    fullWidth
                    limitTags={3}
                    options={
                      store.users.map(item => ({
                        email: item.email,
                        userName: `${item.firstName} ${item.lastName}`,
                        allocatedProjectCost: '',
                        projectRoleId: 0
                      })) ?? []
                    }
                    id='autocomplete-limit-tags'
                    filterSelectedOptions
                    getOptionLabel={option => option?.userName}
                    defaultValue={
                      store.editProject?.assignee.map(item => ({
                        allocatedProjectCost: item.allocatedProjectCost,
                        email: item.email,
                        projectRoleId: item.projectRoleId,
                        userName: item.userName
                      })) || null
                    }
                    renderInput={params => (
                      <TextField {...params} label='Users' placeholder='Assignees' />
                    )}
                    onChange={onChangeAssignees}
                  />
                  <UserTable
                    selectedUsers={store?.assignees}
                    setManagerAssignments={setManagerAssignments}
                    managerAssignments={managerAssignments}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size='large' variant='outlined' color='secondary' onClick={handleBack}>
                  Back
                </Button>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                  <Button
                    size='large'
                    type='submit'
                    variant='contained'
                    disabled={store?.assignees?.length === 0}
                    onClick={() => { }}
                  >
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='large' variant='contained' onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps = {}
              if (index === activeStep) {
                labelProps.error = false
                if (store.editProject?.clientId == null && activeStep === 0) {
                  labelProps.error = true
                } else if (
                  (store.editProject?.name == '' ||
                    store.editProject?.hours == '' ||
                    store.editProject?.budget == null) &&
                  activeStep === 1
                ) {
                  labelProps.error = true
                } else if (
                  (categoryErrors.google ||
                    categoryErrors.twitter ||
                    categoryErrors.facebook ||
                    categoryErrors.linkedIn) &&
                  activeStep === 2
                ) {
                  labelProps.error = true
                } else {
                  labelProps.error = false
                }
              }

              return (
                <Step key={index}>
                  <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number'>{`${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <Divider sx={{ m: '0 !important' }} />

      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}

export default ProjectsEditStepper
