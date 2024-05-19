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
  postTsApproval,
  fetchTimeSheetApprovals,
  putTsApproval,
  setTimeSheetApprovals,
  resetTimeSheetApproval
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
import { MONTHS } from 'src/helpers/constants'
import { timeSheetApprovalRequest } from 'src/helpers/requests'
import { formatDateToYYYYMMDD } from 'src/helpers/dateFormats'
import WeekApprovalHeader from './WeekApprovalHeader'
import {
  setTimeSheetApprovalsRowId,
  setIsLoadingTimesheetApproval
} from 'src/store/timesheets/index'
import CustomBackButton from 'src/@core/components/back-button'

const DynamicTimeSheetApprovalTable = dynamic(() =>
  import('src/views/timesheets/TimeSheetApprovalTable')
)
const DynamicSubmitAlert = dynamic(() => import('src/views/components/alerts/SubmitAlert'), {
  ssr: false
})

const TimeSheetsApproval = () => {
  const dispatch = useDispatch()
  const { timeSheetApprovals, timeSheetApprovalsRowId, isLoadingTimesheetApproval } = useSelector(
    state => state.timesheets
  )
  const theme = useTheme()

  const [date, setDate] = useState(new Date())
  const [selectedTask, setDescription] = useState('')
  const [timeInput, setTimeInput] = useState('')
  const [selectedValue, setSelectedValue] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [submitData, setSubmitData] = useState(null)
  const [timeSheetsList, setTimeSheets] = useState([])

  useEffect(() => {
    timeSheetApprovals == null && dispatch(fetchTimeSheetApprovals(timeSheetApprovalsRowId.id))
    if (timeSheetApprovals != null) {
      let sortedArray = timeSheetApprovals
        .flatMap(o => {
          let timeSheets = o.timeSheets.map(e => ({ ...e, userName: o.userName }))

          return timeSheets
        })
        ?.sort((a, b) => {
          return new Date(b.timeSheetDate).getTime() - new Date(a.timeSheetDate).getTime()
        })
      setTimeSheets(sortedArray || [])
      dispatch(setIsLoadingTimesheetApproval(false))
    }
    // return ()=>{
    //   dispatch(resetTimeSheetApproval())
    // }
  }, [timeSheetApprovals])

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

  const handleMenuItemClick = uniqueId => {
    setSelectedValue(uniqueId)
  }

  //Add new timeSheet
  const addNewTimeSheet = newTs => {
    const timeSheets = [...data]
    const updatedTimeSheets = [...timeSheets, newTs]
    dispatch(setTimeSheets(updatedTimeSheets))
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
    if ((isNaN(timeInput) && !timeInput.includes(':')) || !timeInput) {
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
        timeInput.split(':').length == 3
          ? timeInput
          : ConvertHoursToTime(isNaN(timeInput) ? timeInput : Number(timeInput)),
      timeSheetDate: date ? formatDateString(date) : new Date()?.toISOString(),
      isBillable: true,
      taskId: selectedTask?.id,
      projectId: selectedValue,
      taskCategoryId: selectedTask?.taskCategoryId
    }

    if (selectedTask && timeInput && selectedValue) {
      try {
        dispatch(postData(data))
          .then(unwrapResult)
          .then(res => {
            handleResponse('create', res, addNewTimeSheet)
            setLoading(false)
          })
        setDescription('')
        setTimeInput('')
        setSelectedValue('')
      } catch (error) {
        toast.error(error)
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

  // Approval
  const onApproveOrReject = async (name, ts) => {
    const _ts = []
    await timeSheetApprovals.forEach((item, i) => {
      const _timeSheet = item.timeSheetId.find(o => ts.some(t => t.id == o))
      if (_timeSheet) {
        _ts.push(...item.timeSheetApprovalId)
      }
    })
    setOpen(true)
    setSubmitData({
      timeSheets: _ts,
      name: name
    })
  }

  const updateTimeSheets = async newData => {
    let _temp = []
    const b = JSON.stringify(newData?.timesheetApprovalId)
    if (newData?.isTimeSheetApproved) {
      await timeSheetApprovals?.forEach(ts => {
        const a = JSON.stringify(ts.timeSheetApprovalId)
        if (a == b) {
          const newItem = ts.timeSheets.map(o => ({
            ...o,
            isTimeSheetApproved: true,
            isTimeSheetRejected: false
          }))
          _temp.push({ ...ts, timeSheets: [...newItem] })
        } else {
          _temp.push(ts)
        }
      })
    } else if (newData?.isTimeSheetRejected) {
      await timeSheetApprovals?.forEach(ts => {
        const a = JSON.stringify(ts.timeSheetApprovalId)
        if (a == b) {
          const newTs = ts.timeSheets.map(o => ({
            ...o,
            isTimeSheetApproved: false,
            isTimeSheetRejected: true
          }))
          _temp.push({ ...ts, timeSheets: [...newTs] })
        } else {
          _temp.push(ts)
        }
      })
    }
    dispatch(setTimeSheetApprovals(_temp))
    setLoading(false)
  }

  const handleSubmitApproval = (action, comment) => {
    setOpen(false)
    setLoading(true)
    const approvalStatusId = submitData.name == 'Approve' ? 2 : 3
    const request = timeSheetApprovalRequest({
      ...submitData,
      approvalStatusId,
      comment
    })
    dispatch(putTsApproval(request))
      .then(unwrapResult)
      .then(res => {
        handleResponse('update', res, updateTimeSheets)
      })
  }

  const checkTimeSheetsApproved = weekTs => {
    const isApproved = weekTs.some(ts => ts?.isTimeSheetApproved)

    return isApproved
  }
  const checkTimeSheetsRejected = weekTs => {
    const isRejected = weekTs.some(ts => ts?.isTimeSheetRejected)

    return isRejected
  }
  const handleGoBack = () => {
    setIsLoadingTimesheetApproval(true)
    dispatch(setTimeSheetApprovalsRowId(null))
    dispatch(fetchTimeSheetApprovals(null))
    setTimeSheets([])
  }

  return (

    
    <>
      <Box
        sx={{
          p: 5,
          pb: 5,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 0
        }}
      >
        <Grid className='gap-1'>
          <CustomBackButton
            sx={{ mb: 2 }}
            title={timeSheetApprovalsRowId.userName}
            onClickBack={handleGoBack}
          />
        </Grid>
      </Box>
      <Grid className='gap-1' flexDirection='column'>
        {isLoadingTimesheetApproval && <BackdropSpinner />}
        {!timeSheetsList && <Spinner />}

        {timeSheetsList?.length > 0 &&
          Object.entries(groupTimeSheetsByWeek(timeSheetsList))?.map(([weekKey, timeSheets]) => {
            const totalBurns = calculateTotalBurnedHours(timeSheets)
            const isApproved = checkTimeSheetsApproved(timeSheets)
            const isRejected = checkTimeSheetsRejected(timeSheets)

            return (
              <>
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
                        <WeekApprovalHeader
                          week={weekKey}
                          total={totalBurns || 0}
                          isApproved={isApproved}
                          isRejected={isRejected}
                          onApproval={name => onApproveOrReject(name, timeSheets)}
                        />
                        <DynamicTimeSheetApprovalTable
                          timeSheets={timeSheets}
                          loading={isLoading}
                        />
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              </>
            )
          })}
        {timeSheetsList?.length == 0 && <NoTimeSheets />}
        <DynamicSubmitAlert
          open={open}
          setOpen={setOpen}
          title={submitData?.name}
          content='Almost there! Hit submit to finalize your submission.'
          action={submitData?.name}
          handleAction={handleSubmitApproval}
        />
      </Grid>
    </>
  )
}

export default TimeSheetsApproval
