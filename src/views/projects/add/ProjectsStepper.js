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
import * as React from 'react'
import currencySymbols from 'src/views/projects/reports/chart/currencySymbols'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import {
  Autocomplete,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Menu,
  Radio,
  RadioGroup,
  StepContent,
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
  postProject,
  postUser,
  postCategory,
  postTask,
  fetchCategories,
  fetchSkills,
  fetchRequiredSkills,
  postAssignee,
  fetchDepartment,
  updateProjectStatus,
  putProject,
  featchAssigneeRoles,
  setProjectRoles,
  fetchAssigneeRoles,
  fetchGetOnlyClientName
} from 'src/store/apps/projects'
import { fetchConfig } from 'src/store/settings'
import { Stack } from '@mui/system'
import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import UserTable from './UserTable' // Import the UserTable component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import Files from '../details/files'
import clsx from 'clsx'
import CustomPeoplePicker from 'src/views/components/autocomplete/CustomPeoplePicker'
import { projectAssigneeRequest, projectRequest } from 'src/helpers/requests'
import CustomSkillPicker from 'src/views/components/autocomplete/CustomSkillPicker'
import CustomChip from 'src/@core/components/mui/chip'
import { handleResponse } from 'src/helpers/helpers'
import { NODATA, errorMessage } from 'src/helpers/constants'
import { BackdropSpinner } from 'src/@core/components/spinner'
import { customErrorToast } from 'src/helpers/custom-components/toasts'
import { useSearchParams } from 'next/navigation'
import CustomBackButton from 'src/@core/components/back-button'

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
    title: 'Assignees',
    subtitle: 'Select Users'
  }
]

const defaultClientValues = {
  client: ''
}

const defaultProjectValues = {
  type: 2,
  name: '',
  plannedBudget: null,
  plannedHours: null,
  startDate: null,
  endDate: '',
  isBillable: true,
  departmentId: 0,
  allowUsersToChangeEstHours: false,
  allowUsersToCreateNewTask: false
}

const defaultAssigneeValues = []

const clientSchema = yup.object().shape({
  client: yup.string().required('Client is required')
})

const projectSchema = yup.object().shape({
  type: yup.number().required('Type required'),
  name: yup.string().required('Project name required'),
  // plannedBudget: yup.number().positive().integer().notRequired(),
  // plannedHours: yup.number().positive().integer().notRequired(),
  startDate: yup.date().required('Start Date is required').typeError(),
  // endDate: yup.date().nullable(),
  isBillable: yup.boolean().notRequired(),
  departmentId: yup.number().notRequired(),
  allowUsersToChangeEstHours: yup.boolean().notRequired(),
  allowUsersToCreateNewTask: yup.boolean().notRequired()
})

const assigneeSchema = yup.object().shape({})

const ProjectsStepper = ({ isEdit, id }) => {
  // ** States
  const [activeStep, setActiveStep] = useState(0)

  const [state, setState] = useState({
    projectType: 2
  })

  const [createdProjectId, setcreatedProjectId] = useState('')

  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const setting = useSelector(state => state.settings)
  const router = useRouter()

  const [selectedUsers, setSelectedUsers] = useState([])
  const [managerAssignments, setManagerAssignments] = useState([])
  const [assigneeRole, setAssineeRole] = useState([])
  const [departments, setDepartments] = useState([])
  const [requiredskills, setRequiredskill] = React.useState([])
  const [items, setItems] = React.useState([])
  const [isLoading, setLoading] = React.useState(false)
  const searchParams = useSearchParams()

  const projId = searchParams.get('projectId')

  // ** Hooks
  useEffect(() => {
    dispatch(fetchGetOnlyClientName())
    // dispatch(fetchClients())
    dispatch(fetchUsers())
    dispatch(fetchRequiredSkills())
    dispatch(fetchDepartment())
  }, [dispatch])
  useEffect(() => {
    setItems(store.requiredSkills)
  }, [store.requiredSkills])

  useEffect(() => {
    dispatch(fetchAssigneeRoles())
  }, [])

  useEffect(() => {
    localStorage.removeItem('projectId')
  }, [])
  useEffect(() => {
    dispatch(fetchConfig())
  }, [])

  const getCurrencySymbol = (currencyCode) => {
    return currencySymbols[currencyCode] || currencyCode
  }

  const {
    reset: clientReset,
    control: clientControl,
    watch: clientWatch,
    handleSubmit: handleClientSubmit,
    formState: { errors: clientErrors }
  } = useForm({
    defaultValues: defaultClientValues,
    resolver: yupResolver(clientSchema)
  })

  const handleChange = event => {
    setRequiredskill(event.target.value)
  }

  const {
    setValue,
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
    reset: assigneeRest,
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
  const backToList = () => {
    router.push('/projects/list')
  }

  const handleReset = () => {
    setActiveStep(0)
    clientReset({ client: '' })
    projectReset({
      name: '',
      plannedBudget: '',
      plannedHours: '',
      isBillable: false,
      allowOpenTasks: false
    })
    categoryReset([{ index: 0, name: '', isBIllable: false }])
    taskReset([{ index: 0, name: '', category: '', hours: '' }])
    assigneeReset([])
  }

  const handleNext = () => {
    setActiveStep(activeStep + 1)
    if (activeStep === steps.length - 1) {
      // toast.success('Form Submitted')
    }
  }

  const handleProjectType = e => {
    setState(state => ({ ...state, projectType: e.target.value }))

    dispatch(setProject({ projectType: e.target.value }))
  }

  const onSaveAssignee = () => {
    if (managerAssignments.some(item => !item.allocatedProjectCost || !item.availablePercentage)) {
      toast.error('Cost and Availability cannot be null')
    } else {
      assignUsers()
    }
  }

  const onChangeCategoryOrTaskName = (e, index, name) => {
    switch (name?.toLowerCase()) {
      case 'category':
        var category = [...store.category]
        category[index] = {
          index: index,
          name: e.target.value,
          isBillable: category[index].isBillable
        }
        dispatch(setCategory(category))
        break
      case 'task':
        var tasks = [...store.tasks]
        tasks[index] = {
          index: index,
          name: e.target.value,
          hours: tasks[index].hours,
          category: tasks[index].category
        }
        dispatch(setTasks(tasks))
        break

      default:
        break
    }
  }

  const onChangeTasks = (index, e, name) => {
    var tasks = [...store.tasks]
    switch (name?.toLowerCase()) {
      case 'category':
        tasks[index] = {
          index: index,
          name: tasks[index].name,
          category: e.target.value,
          hours: tasks[index].hours
        }
        break
      case 'hours':
        tasks[index] = {
          index: index,
          name: tasks[index].name,
          category: tasks[index].category,
          hours: e.target.value
        }
        break
      default:
        break
    }
    dispatch(setTasks(tasks))
  }

  const onChangeAssignees = (event, newValue, reason) => {
    dispatch(setAssignees(newValue))
    setManagerAssignments(newValue)
  }

  //CLIENT
  const onSaveClient = () => {
    clientWatch('client') && dispatch(setClient(clientWatch('client')))
  }

  // PROEJCT
  const onSaveProject = (values, event) => {
    event.preventDefault() // Prevent the form from submitting

    const enteredProjectName = values.name.trim().toLowerCase()

    const existingProject = store.allProjects?.some(
      project => project.name.trim().toLowerCase() === enteredProjectName
    )

    if (existingProject) {
      toast.error('A project with the same name already exists.')
    } else {
      createProject(values)
    }
  }

  const handleProjectFormKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  //CATEGORY
  const onSaveCategory = async () => {
    const request = {
      projectUid: createdProjectId,
      taskCategory: store.category.map(c => ({
        name: c.name,
        isBillable: c.isBillable
      }))
    }

    // dispatch(postCategory({ request: request, afterSubmit: onSubmit }))
    dispatch(postCategory(request))
      .then(unwrapResult)
      .then(() => {
        toast.success('Task Category Created', { position: 'top-right', duration: 3000 })
        onSubmit()
      })
      .catch(error => {
        toast.error(NODATA.error, { position: 'top-right', duration: 3000 })
      })
  }
  //TASKS
  const onSaveTasks = async () => {
    dispatch(fetchCategories(createdProjectId))
      .then(unwrapResult)
      .then(response => {
        const request = {
          projectUid: store.project.uniqueId,
          taskRequest: store.tasks.map(task => {
            const category = response.find(c => c.name.trim() === task.category.trim())

            return {
              taskCategoryUid: category?.uniqueId,
              description: task.name,
              hours: task.hours,
              dateTime: new Date().toISOString()
            }
          })
        }

        dispatch(postTask(request))
          .then(unwrapResult)
          .then(() => {
            toast.success('Tasks Created', { position: 'top-right', duration: 3000 })
            onSubmit()
          })
          .catch(error => {
            toast.error(NODATA.error, { position: 'top-right', duration: 3000 })
          })
      })
  }

  const saveChanges = data => {
    localStorage.setItem('projectId', data.id)
    handleNext()
    setLoading(false)
    router.replace(`/projects/add/?projectId=${data.projectId}`)
  }

  //CREATE PROJECT
  const createProject = project => {
    setLoading(true)
    const client = store.allClientsName?.find(o => o.companyName === clientWatch('client'))
    const req = {
      client: client.id,
      skills: requiredskills.map(o => o.id),
      ...projectWatch()
    }

    const request = projectRequest(req)

    const projectId = localStorage.getItem('projectId')
    if (projectId) {
      dispatch(putProject({ ...request, id: Number(projectId) }))
        .then(unwrapResult)
        .then(res => {
          handleResponse('update', res, saveChanges)
        })
        .catch(error => {
          setLoading(false)
        })
    } else {
      dispatch(postProject(request))
        .then(unwrapResult)
        .then(res => {
          handleResponse('create', res, saveChanges)
        })
        .catch(error => {
          setLoading(false)
        })
    }
  }

  const assignUsers = () => {
    const projectId = projId
    const request = managerAssignments.map(item => ({
      allocatedProjectCost: item.allocatedProjectCost,
      projectId: projectId,
      userId: store.users.find(o => o.email === item.email).id,
      projectRoleId: item.projectRoleId === '' ? 3 : item.projectRoleId,
      // projectRoleId: item.projectRoleId || 3 ,
      availablePercentage: item.availablePercentage
    }))

    setLoading(true)
    dispatch(postAssignee(request))
      .then(unwrapResult)
      .then(response => {
        if (response?.result != null && !response?.hasError) {
          handleResponse('create', response, () => {
            router.push('/projects/list')
            setcreatedProjectId('')
            setLoading(false)
          })
        }
      })
      .catch(error => {
        setLoading(false)
        customErrorToast(errorMessage.default)
      })
  }

  const handleDepartments = value => {
    setDepartments(value)
  }

  const handleSkills = values => {
    setRequiredskill(values.slice().sort())
    const _items = [...items]
    const lastId = values[values.length - 1]?.id
    const _index = _items.findIndex(o => o.id === lastId)

    if (_index !== -1) {
      _items.splice(_index, 1)
      setItems(_items)
    }
  }

  let activeClient = store.allClients?.filter(c => c.IsActive === true)

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleClientSubmit(onSaveClient)}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='client'
                    control={clientControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        options={(store.allClientsName || [])
                          .filter(c => c.isActive)
                          .sort((a, b) => a.companyName.localeCompare(b.companyName))}
                        id='autocomplete-limit-tags'
                        getOptionLabel={option => option.companyName || option}
                        onChange={(e, v) => onChange(v ? v.companyName : '')}
                        value={value}
                        loading={!store.allClientsName}
                        loadingText='Loading...'
                        renderInput={params => (
                          <TextField {...params} label='Client *' placeholder='Client' />
                        )}
                        noOptionsText={store.allClientsName ? 'No Clients' : ''}
                      />
                    )}
                  />
                  {clientErrors.client && (
                    <FormHelperText
                      sx={{ color: 'error.main' }}
                      id='stepper-linear-personal-country-helper'
                    >
                      {clientErrors.client.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <div className='button-wrapper'>
              <Button
                size='small'
                color='secondary'
                variant='outlined'
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Button
                size='small'
                variant='contained'
                type='sumbit'
                onClick={() => {
                  clientWatch('client') && handleNext()
                }}
                sx={{ ml: 4 }}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </form>
        )
      case 1:
        return (
          <form
            key={1}
            onSubmit={handleProjectSubmit(onSaveProject)}
            onKeyPress={handleProjectFormKeyPress}
          >
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Grid className='d-flex'>
                  <Controller
                    name='type'
                    control={projectControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <RadioGroup
                        row
                        aria-label='controlled'
                        name='controlled'
                        value={value}
                        onChange={onChange}
                        defaultChecked={2}
                      >
                        <FormControlLabel value={2} control={<Radio />} label='Fixed Price' />
                        <FormControlLabel value={1} control={<Radio />} label='T & M' />
                      </RadioGroup>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='name'
                    control={projectControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Project Name *'
                        onChange={onChange}
                        autoComplete='off'
                        placeholder='Enter Project Name'
                        error={Boolean(projectErrors.name)}
                        aria-describedby='stepper-linear-project-name'
                      />
                    )}
                  />
                  {projectErrors.name && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-project-name'>
                      {projectErrors.name.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <Controller
                    name='plannedBudget'
                    control={projectControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='number'
                        value={value}
                        label={`Planned Budget ${getCurrencySymbol(setting.configuration.currency)}`}
                        defaultValue={0}
                        onChange={onChange}
                        autoComplete='off'
                        placeholder='Enter Budget'
                        aria-describedby='stepper-linear-project-budget'
                        onKeyDown={e => {
                          if (e.key === '-' || e.key === '+') {
                            e.preventDefault()
                          }
                        }}
                        inputProps={{ min: 0 }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <Controller
                    name='plannedHours'
                    control={projectControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='number'
                        value={value}
                        label='Planned Hours'
                        defaultValue={0}
                        autoComplete='off'
                        onChange={onChange}
                        placeholder='Enter Hours'
                        aria-describedby='stepper-linear-project-hours'
                        onKeyDown={e => {
                          if (e.key === '-' || e.key === '+') {
                            e.preventDefault()
                          }
                        }}
                        inputProps={{ min: 0 }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <DatePickerWrapper>
                    <Controller
                      name='startDate'
                      control={projectControl}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <ReactDatePicker
                          id='picker-filter-to-date'
                          selected={value}
                          label='Start Date *'
                          placeholder='Start Date'
                          autoComplete='off'
                          popperPlacement='auto'
                          onChange={e => {
                            onChange(e)
                            setValue('endDate', '')
                          }}
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
                  </DatePickerWrapper>
                  {projectErrors.startDate && (
                    <FormHelperText
                      sx={{ color: 'error.main' }}
                      id='stepper-linear-project-startDate'
                    >
                      {projectErrors.startDate.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <FormControl fullWidth>
                  <DatePickerWrapper>
                    <Controller
                      name='endDate'
                      rules={{ required: false }}
                      control={projectControl}
                      render={({ field: { value, onChange } }) => (
                        <ReactDatePicker
                          id='picker-filter-to-date'
                          selected={value}
                          popperPlacement='auto'
                          onChange={onChange}
                          autoComplete='off'
                          onKeyDown={e => {
                            if (e.key === 'Delete' || e.key === 'Backspace') {
                              return
                            }
                            if (!/[0-9]/.test(e.key) && e.key !== '/' && e.key !== '-') {
                              e.preventDefault()
                            }
                          }}
                          minDate={projectWatch('startDate')}
                          disabled={!projectWatch('startDate')}
                          customInput={
                            <CustomInput
                              label='End Date'
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
                  </DatePickerWrapper>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-outlined-label'>Department</InputLabel>
                  <Controller
                    name='departmentId'
                    control={projectControl}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        label='Department'
                        id='demo-simple-select-outlined'
                        labelId='demo-simple-select-outlined-label'
                        value={value}
                        autoComplete='off'
                        onChange={onChange}
                      >
                        {store.departments != null &&
                          [{ id: 0, name: 'None' }, ...store.departments].map((dept, i) => (
                            <MenuItem key={dept.id} className='gap-1' value={dept.id}>
                              <CustomChip
                                key={dept.id}
                                label={dept.name}
                                skin='light'
                                color='primary'
                              />
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  {projectErrors.departmentId && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {projectErrors.departmentId.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <CustomSkillPicker
                    values={requiredskills}
                    items={items}
                    label='Required Skills'
                    setSkills={handleSkills}
                    originalItems={store.requiredSkills}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <FormControl>
                  <Controller
                    name='isBillable'
                    control={projectControl}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        control={<Switch defaultChecked={value} />}
                        value={value}
                        onChange={onChange}
                        autoComplete='off'
                        label='Billable'
                        id='stepper-linear-project-isBillable'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <FormControl>
                  <Controller
                    name='allowUsersToChangeEstHours'
                    control={projectControl}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        control={<Switch defaultChecked={value} />}
                        value={value}
                        onChange={onChange}
                        autoComplete='off'
                        label='Allow Users To Change Est.Hours'
                        id='stepper-linear-project-isBillable'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <FormControl>
                  <Controller
                    name='allowUsersToCreateNewTask'
                    control={projectControl}
                    render={({ field: { value, onChange } }) => (
                      <FormControlLabel
                        control={<Switch defaultChecked={value} />}
                        value={value}
                        onChange={onChange}
                        label='Allow Users To Create New Task'
                        id='stepper-linear-project-isBillable'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <div className='button-wrapper'>
              <Button
                size='small'
                color='secondary'
                variant='outlined'
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Button size='small' variant='contained' sx={{ ml: 4 }} type='submit'>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </form>
        )

      case 2:
        return (
          <form
            key={2}
            onSubmit={handleAssigneeSubmit(onSaveAssignee)}
            onKeyPress={e => {
              if (e.key === 'Enter') e.preventDefault()
            }}
          >
            <Grid container spacing={5}>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              ></Grid>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Stack direction={'column'} spacing={5} sx={{ minWidth: 500 }}>
                  <Autocomplete
                    multiple
                    fullWidth
                    value={managerAssignments}
                    limitTags={3}
                    options={
                      // store.users?.map(item => ({
                      //   email: item.email,
                      //   userName: `${item.firstName} ${item.lastName}`,
                      //   allocatedProjectCost: '0',
                      //   availablePercentage: '0',
                      //   projectRoleId: ''
                      // })) || []
                      (store.users || [])
                        ?.filter(c => c.isActive)
                        .filter(
                          user =>
                            !managerAssignments?.some(assignee => assignee.email === user.email)
                        )
                        .slice()
                        .sort((a, b) =>
                          (a.firstName + ' ' + a.lastName).localeCompare(
                            b.firstName + ' ' + b.lastName
                          )
                        )
                        .map(item => ({
                          email: item.email,
                          userName: `${item.firstName} ${item.lastName}`,
                          allocatedProjectCost: '0',
                          availablePercentage: '100',
                          projectRoleId: ''
                        })) || []
                    }
                    id='autocomplete-limit-tags'
                    filterSelectedOptions
                    getOptionLabel={option => option.userName}
                    defaultValue={[] || null}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Users'
                        placeholder='Assignees'
                        sx={{ width: '40%' }}
                      />
                    )}
                    onChange={(e, data, reason) => onChangeAssignees(e, data, reason)}
                  // renderOption={(option) => (
                  //   <div>
                  //     {option.projectRoleId !== 'user' ? (
                  //       <div>{option.projectRoleId}</div>
                  //     ) : (
                  //       <div>{option.userName}</div>
                  //     )}
                  //   </div>
                  // )}
                  />
                  <UserTable
                    selectedUsers={store.assignees || []}
                    setManagerAssignments={setManagerAssignments}
                    managerAssignments={managerAssignments}
                  />
                </Stack>
                {/* Render the UserTable component passing the selected users */}
              </Grid>
            </Grid>
            <div className='button-wrapper'>
              <Button
                size='small'
                color='secondary'
                variant='outlined'
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Button
                size='small'
                variant='contained'
                // onClick={assignUsers}
                sx={{ ml: 4 }}
                type='submit'
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </form>
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      // return (
      //   <Fragment>
      //     <Typography>All steps are completed!</Typography>
      //     <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
      //       <Button size='large' variant='contained' onClick={handleReset}>
      //         Reset
      //       </Button>
      //     </Box>
      //   </Fragment>
      // )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <>
      {isLoading && <BackdropSpinner />}
      <CustomBackButton title='Back to list' onClickBack={backToList} />
      <Card>
        <CardHeader title='Create New Project' />
        <CardContent>
          <StepperWrapper>
            <Stepper activeStep={activeStep} orientation='vertical'>
              {steps.map((step, index) => {
                return (
                  <Step key={index} className={clsx({ active: activeStep === index })}>
                    <StepLabel StepIconComponent={StepperCustomDot}>
                      <div className='step-label'>
                        <Typography className='step-number'>{`${index + 1}`}</Typography>
                        <div>
                          <Typography className='step-title'>{step.title}</Typography>
                          <Typography className='step-subtitle'>{step.subtitle}</Typography>
                        </div>
                      </div>
                    </StepLabel>
                    <StepContent>
                      <Grid xs={12}>{renderContent()}</Grid>
                    </StepContent>
                  </Step>
                )
              })}
            </Stepper>
          </StepperWrapper>
          {/* {activeStep === steps.length && (
          <Box sx={{ mt: 2 }}>
            <Typography>All steps are completed!</Typography>
            <Button size='small' sx={{ mt: 2 }} variant='contained' onClick={handleReset}>
              Reset
            </Button>
          </Box>
        )} */}
        </CardContent>
      </Card>
    </>
  )
}

export default ProjectsStepper
