// ** React Imports
import React, { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import toast from 'react-hot-toast'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'

import FormHelperText from '@mui/material/FormHelperText'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { Button, useTheme } from '@mui/material'
import { Icon } from '@iconify/react'
import DatePicker from 'react-datepicker'
import timesheets, {
  fetchTaskData,
  fetchProjectData,
  postData,
  fetchData,
  fetchAssignedProject,
  fetchAssignedTask,
  setTimeSheets,
  postTsApproval,
  setTimeSheetApproval,
  resetTimeSheets,
  fetctTasksForProjectAndUserAssignee
} from 'src/store/timesheets/index'
import FallbackSpinner, { BackdropSpinner, Spinner } from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import SimpleBackdrop from 'src/@core/components/spinner'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {
  ConvertHoursToTime,
  calculateTotalBurnedHours,
  getCurrentWeekStartEndDate,
  groupTimeSheetsByWeek,
  groupTimesheetsByWeek,
  handleResponse
} from 'src/helpers/helpers'
import { customErrorToast } from 'src/helpers/custom-components/toasts'
import WeekHeader from 'src/views/timesheets/WeekHeader'
import NoTimeSheets from 'src/views/timesheets/NoTimeSheets'
import dynamic from 'next/dynamic'
import { MONTHS, errorMessage } from 'src/helpers/constants'
import { timeSheetApprovalRequest, timeSheetSubmitRequest } from 'src/helpers/requests'
import { formatDateToYYYYMMDD } from 'src/helpers/dateFormats'

const DynamicTimeSheetTable = dynamic(() => import('src/views/timesheets/TimeSheetTable'))
const DynamicSubmitAlert = dynamic(() => import('src/views/components/alerts/SubmitAlert'), {
  ssr: false
})

const TimeSheets = () => {
  const dispatch = useDispatch()
  const { taskData, projectData, data } = useSelector(state => state.timesheets)
  const theme = useTheme()

  useEffect(() => {
    data == null && dispatch(fetchData())
    projectData == null &&
      dispatch(fetchAssignedProject())
        .then(unwrapResult)
        .then(() => {
          setLoading(false)
        })
  }, [])

  const [date, setDate] = useState(new Date())
  const [selectedTask, setDescription] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [selectedValue, setSelectedValue] = useState(null)
  const [descriptionError, setDescriptionError] = useState(false)
  const [timeError, setTimeError] = useState(false)
  const [selectedValueError, setSelectedValueError] = useState(false)
  const [selectedProjectTasks, setSelectedProjectTasks] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [submitData, setSubmitData] = useState(null)

  const formatDateString = date => {
    if (date == null || date === '') {
      return new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19)
        .concat('Z')
    } else {
      return new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19)
        .concat('Z')
    }
  }

  const handleAutocompleteChange = (event, newValue) => {
    setDescription(newValue ? newValue : '')
  }

  const handleMenuItemClick = projectId => {
    setSelectedProjectTasks(null)
    setDescription('')
    setSelectedValue(projectId)
    if (projectId)
      //dispatch(fetchAssignedTask(projectId))
      dispatch(fetctTasksForProjectAndUserAssignee(projectId))
        .then(unwrapResult)
        .then(res => {
          if (res?.hasError) {
            customErrorToast(res?.responseMessage)
          } else {
            setSelectedProjectTasks(
              (res?.result.tasksByCategory.flatMap(o => o.tasks) || [])
                .slice()
                .sort((a, b) => a.taskName.localeCompare(b.taskName))
            )
            //setSelectedProjectTasks(res?.result || [])
          }
        })
  }

  //Add new timeSheet
  const addNewTimeSheet = newTs => {
    const timeSheets = [...data]
    const updatedTimeSheets = newTs ? [newTs, ...timeSheets] : timeSheets
    dispatch(setTimeSheets(updatedTimeSheets))
    setLoading(false)
    setDescription('')
    setTimeInput('')
    setSelectedValue(null)
  }

  const handleSubmit = () => {
    setDescriptionError(false)
    setTimeError(false)
    setSelectedValueError(false)

    // Checking each field and setting error states if empty
    if (!selectedTask) {
      setDescriptionError(true)
    }

    if (!selectedValue) {
      setSelectedValueError(true)
    }
    if ((isNaN(timeInput) && !timeInput.includes(':')) || !timeInput || timeInput == '00:00') {
      setTimeError(true)

      return
    }
    // const selectedTask = taskData.find(task => task.description === description)

    if (timeInput.split(':')[0] > 24) {
      customErrorToast('Hours Should be less than 24 hours')
      setDescription(selectedTask)

      return
    }

    const data = {
      id: 0,
      burnedHours:
        timeInput.split(':').length == 2
          ? timeInput.concat(':00')
          : ConvertHoursToTime(isNaN(timeInput) ? timeInput : Number(timeInput)),
      timeSheetDate: date ? formatDateString(date) : new Date()?.toISOString(),
      isBillable: true,
      taskId: selectedTask?.taskId,
      projectId: selectedValue,
      taskCategoryId: selectedTask?.taskCategoryId
    }

    if (selectedTask && timeInput && selectedValue) {
      setLoading(true)

      try {
        dispatch(postData(data))
          .then(unwrapResult)
          .then(res => {
            if ([200, 201].includes(res.responseCode))
              handleResponse('create', res, addNewTimeSheet)
            else {
              customErrorToast(res.responseMessage)
              setLoading(false)
            }
          })
      } catch (error) {
        customErrorToast(errorMessage.default)
        setLoading(false)
      }
    }
  }

  function parseDateRange(input) {
    const dateRangeRegex =
      /^([a-zA-Z]+)\s+(\d+),\s+(\d{4})\s*-\s*([a-zA-Z]+)\s+(\d+),\s+(\d{4})$|^([a-zA-Z]+)\s+(\d+)-([a-zA-Z]+)\s+(\d+),(\d{4})$/
    const match = input.match(dateRangeRegex)

    if (match) {
      const [
        ,
        startMonth,
        startDay,
        startYear,
        endMonth,
        endDay,
        endYear,
        altStartMonth,
        altStartDay,
        altEndMonth,
        altEndDay,
        altYear
      ] = match

      const startDate = new Date(
        startYear || altYear,
        MONTHS.indexOf(startMonth || altStartMonth),
        startDay || altStartDay
      )
      const endDate = new Date(
        endYear || altYear,
        MONTHS.indexOf(endMonth || altEndMonth),
        endDay || altEndDay
      )

      return { startDate, endDate }
    } else {
      // Handle invalid input
      console.error('Invalid date range format')

      return null
    }
  }
  //hours

  const handleSaveHours = e => {
    if (e.key === 'Enter' || e.type == 'blur') {
      const burns = isNaN(e.target.value) ? e.target.value : Number(e.target.value)
      const hours = ConvertHoursToTime(burns)
      setTimeInput(hours)
    }
  }

  //data Approval
  const collectWeekDataForApproval = (week, ts) => {
    setOpen(true)
    const { startDate, endDate } =
      week == 'This Week' ? getCurrentWeekStartEndDate() : parseDateRange(week)
    setSubmitData({
      startDate: formatDateToYYYYMMDD(startDate),
      endDate: formatDateToYYYYMMDD(endDate),
      timeSheets: ts?.map(t => t.id)
    })
  }

  const updateTimeSheets = async newData => {
    var _ts = []
    await data.forEach((ts, i) => {
      if (newData?.timeSheetId.includes(ts.id)) {
        _ts.push({ ...ts, isTimeSheetApproval: true })
      } else {
        _ts.push(ts)
      }
    })
    dispatch(setTimeSheets(_ts))
    setLoading(false)
  }

  const handleSubmitApproval = () => {
    setOpen(false)
    setLoading(true)
    const request = timeSheetSubmitRequest(submitData)
    dispatch(postTsApproval(request))
      .then(unwrapResult)
      .then(res => {
        handleResponse('update', res, updateTimeSheets)
      })
  }

  const checkTimeSheetsApproved = weekTs => {
    const isApproved = weekTs.some(ts => ts.isTimeSheetApproval)

    return isApproved
  }

  return (
    <Grid className='gap-1' flexDirection='column'>
      {isLoading && <BackdropSpinner />}
      <Grid position='sticky' zIndex={1} top={80}>
        {/* WEEK FILTER */}

        <Grid container spacing={3} justifyContent='flex-start'>
          {/* DatePicker */}
          {/* <Grid item xs={12} sm={4} md={4}>
            <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
              <DatePicker
                selectsRange
                endDate={new Date()}
                selected={new Date()}
                startDate={new Date()}
                id='date-range-picker'
                onChange={() => {}}
                shouldCloseOnSelect
                popperPlacement='auto'
                dateFormat='dd-MMM-yy'
                customInput={
                  <CustomInput label='Week Filter' start={new Date()} end={new Date()} />
                }
              />
            </DatePickerWrapper>
          </Grid> */}
        </Grid>

        {/* TIMESHEET */}

        <Card sx={{ pt: 1, pb: 1 }}>
          <CardContent>
            <Grid container spacing={3} justifyContent='space-evenly'>
              {/* Button */}
              <Grid item xs={12} sm={2.5} md={2.5}>
                <FormControl fullWidth size='small'>
                  <InputLabel id='demo-simple-select-helper-label'>Project</InputLabel>
                  <Select
                    label='Project'
                    defaultValue=''
                    value={selectedValue ? selectedValue : null}
                    onChange={event =>
                      handleMenuItemClick(event.target.value, event.target.innerText)
                    }
                    sx={{ borderRadius: 0 }}
                  >
                    {projectData?.length === 0 || !projectData ? (
                      <MenuItem disabled>No Projects</MenuItem>
                    ) : (
                      projectData
                        .slice()
                        .sort((a, b) => a.projectName.localeCompare(b.projectName))
                        .map(project => (
                          <MenuItem
                            key={project?.projectId}
                            value={project?.projectId}
                            onClick={() => handleMenuItemClick(project?.projectId)}
                          >
                            {project?.projectName}
                          </MenuItem>
                        ))
                    )}
                  </Select>
                </FormControl>
                {selectedValueError && !selectedValue && (
                  <FormHelperText sx={{ color: 'error.main', position: 'absolute' }}>
                    Please select a value
                  </FormHelperText>
                )}{' '}
              </Grid>

              {/* Autocomplete */}
              <Grid item xs={12} sm={5} md={5}>
                <Autocomplete
                  fullWidth
                  size='small'
                  options={selectedProjectTasks || []}
                  getOptionLabel={option => option?.taskName || ''}
                  value={selectedTask}
                  onChange={handleAutocompleteChange}
                  noOptionsText='No Tasks'
                  loading={!selectedProjectTasks}
                  disabled={!selectedValue}
                  renderInput={params => (
                    <TextField
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                      {...params}
                      label='Task'
                    />
                  )}
                />
                {descriptionError && !selectedTask && (
                  <FormHelperText sx={{ color: 'error.main', position: 'absolute' }}>
                    Please fill Task
                  </FormHelperText>
                )}
              </Grid>
              {/* DatePicker */}
              <Grid item xs={12} sm={1.5} md={1.5}>
                <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
                  <DatePicker
                    selected={date}
                    id='basic-input'
                    popperPlacement={'auto'}
                    onChange={date => setDate(date)}
                    placeholderText='Click to select a date'
                    maxDate={new Date()}
                    customInput={
                      <CustomInput
                        label='Date'
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                        size='small'
                      />
                    }
                  />
                </DatePickerWrapper>
              </Grid>
              <Grid item xs={12} sm={1.5} md={1.5}>
                <TextField
                  fullWidth
                  value={timeInput}
                  size='small'
                  onKeyDown={handleSaveHours}
                  onBlur={handleSaveHours}
                  label='Time'
                  autoComplete='off'
                  onChange={e => setTimeInput(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />
                {timeError && (
                  <FormHelperText sx={{ color: 'error.main', position: 'absolute' }}>
                    Time is invalid or empty
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={1} md={1} className='d-flex' justifyContent='space-evenly'>
                <Button fullWidth variant='contained' size='medium' onClick={handleSubmit}>
                  Add
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* {data == null && <Spinner />} */}
      {data?.length > 0 &&
        Object.entries(groupTimeSheetsByWeek(data))?.map(([weekKey, timeSheets]) => {
          const totalBurns = calculateTotalBurnedHours(timeSheets)
          const isApproved = checkTimeSheetsApproved(timeSheets)

          return (
            <Grid key={weekKey}>
              <Card
                sx={{
                  boxShadow: theme =>
                    theme.palette.mode == 'light'
                      ? 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'
                      : 'rgba(99, 99, 99, 0) 0px 2px 8px 0px'
                }}
              >
                <Box>
                  <Grid item xs={12}>
                    <WeekHeader
                      week={weekKey}
                      total={totalBurns || 0}
                      isApproved={isApproved}
                      confirmSubmit={() => collectWeekDataForApproval(weekKey, timeSheets)}
                    />
                    <DynamicTimeSheetTable
                      disable={isApproved}
                      timeSheets={timeSheets}
                      loading={isLoading}
                    />
                  </Grid>
                </Box>
              </Card>
            </Grid>
          )
        })}
      {data?.length == 0 && <NoTimeSheets />}
      <DynamicSubmitAlert
        open={open}
        setOpen={setOpen}
        title='Submit'
        content='Almost there! Hit submit to finalize your submission.'
        action='Submit'
        handleAction={handleSubmitApproval}
      />
    </Grid>
  )
}

export default TimeSheets
