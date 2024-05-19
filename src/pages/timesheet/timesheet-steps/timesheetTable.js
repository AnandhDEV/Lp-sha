import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'
import timesheets, {
  fetchData,
  fetchTaskData,
  fetchProjectData,
  UpdateData,
  DeleteData,
  fetchAssignedProject,
  fetchAssignedTask,
  setTimeSheets
} from 'src/store/timesheets/index'
import Autocomplete from '@mui/material/Autocomplete'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePicker from 'react-datepicker'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { Button } from '@mui/material'
import { Icon } from '@iconify/react'
import toast from 'react-hot-toast'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { IconButton, Tooltip } from '@mui/material'
import dayjs from 'dayjs'
import { unwrapResult } from '@reduxjs/toolkit'
import dynamic from 'next/dynamic'
import FallbackSpinner from 'src/layouts/components/LogoSpinner'
import { ConvertHoursToTime, handleResponse } from 'src/helpers/helpers'
import SimpleBackdrop, { BackdropSpinner } from 'src/@core/components/spinner'
import { setLoading } from 'src/store/authentication/register'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'
import { timeSheetRequest } from 'src/helpers/requests'
import { NODATA } from 'src/helpers/constants'

const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false
})

const TimeSheetTable = ({ popperPlacement, loading, timeSheets }) => {
  const dispatch = useDispatch()
  const { data, taskData, projectData } = useSelector(state => state.timesheets)
  const [flattenedTimesheets, setFlattenedTimesheets] = useState([])
  const [alert, setAlert] = useState(false)
  const [row, setRow] = useState({})
  const [isLoading, setLoading] = useState(false)
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    dispatch(fetchAssignedTask())
  }, [dispatch, loading])

  useEffect(() => {
    setLoading(true)
    if (timeSheets && timeSheets?.length > 0) {
      const _timeSheets = [...timeSheets].sort(
        (a, b) => new Date(b.timeSheetDate) - new Date(a.timeSheetDate)
      )
      setTableData(_timeSheets)
    }
    setLoading(false)

  }, [timeSheets])

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

  const handleTimeInputChange = (value, params) => {
    handleUpdate({ ...params, row: { ...params.row, burnedHours: value } })
  }

  const handleDateChange = (date, params) => {
    setDate(date)
    if (date instanceof Date && !isNaN(date)) {
      handleUpdate({ ...params, row: { ...params.row, timeSheetDate: date } })
    }
  }

  const handleAutocompleteChange = (e, params) => {
    setDescription(e.target.value)
    handleUpdate({ ...params, row: { ...params?.row, taskId: e.target.value || '' } })
  }

  const handleUpdate = params => {
    const data = {
      id: params?.row?.id,
      burnedHours: params?.row?.burnedHours,
      timeSheetDate: formatDateString(params?.row?.timeSheetDate),
      isBillable: true,
      taskId: params?.row?.taskId,
      projectId: params?.row?.projectId,
      taskCategoryId: params?.row?.taskCategoryId
    }
    dispatch(UpdateData(data))
      .then(unwrapResult)
      .then(() => {
        setDate('')
        setDescription('')
        setTimeInput('')
      })
  }

  const mappedUsers = projectData?.map(user => {
    const mappedProjects = user?.projects?.map(project => {
      const mappedTaskCategories = project?.taskCategory?.map(category => {
        const mappedTasks = category?.tasks?.map(task => {
          return {
            taskId: task.uniqueId,
            description: task.description
          }
        })

        return {
          categoryId: category.uniqueId,
          categoryName: category.name,
          tasks: mappedTasks
        }
      })

      return {
        projectId: project.uniqueId,
        projectName: project.name,
        taskCategories: mappedTaskCategories
      }
    })

    return {
      projects: mappedProjects
    }
  })

  const columns = [
    {
      flex: 0.25,
      field: 'projectId',
      headerName: 'Project',
      renderCell: params => {
        const project = projectData?.find(o => o.projectId == params.value)

        return <div>{project?.projectName}</div>
      }
    },
    {
      flex: 0.3,
      editable: false,
      field: 'taskId',
      headerName: ' Task Description',
      renderCell: params => params.row.taskDescription
    },

    {
      flex: 0.15,
      editable: true,
      type: 'date',
      field: 'timeSheetDate',
      headerName: 'Date',
      valueGetter: params => new Date(params.value)
      // editField: 'timeSheetDate',
      // renderEditCell: params => (
      //   <DatePicker
      //     selected={date || new Date()}
      //     id='basic-input'
      //     popperPlacement={popperPlacement}
      //     onChange={date => handleDateChange(date, params)}
      //     customInput={<CustomInput fullWidth sx={{ m: 0, p: 0 }} />}
      //   />
      // )
    },
    {
      flex: 0.15,
      type: 'time',
      editable: true,
      headerName: 'Hours',
      field: 'burnedHours'
      // renderEditCell: params => (
      //   <TimeSheetTextField
      //     style={{ width: 100 }}
      //     handlechange={(e, value) => {
      //       handleTimeInputChange(value.concat(':00') || params.value, params)
      //     }}
      //     value={params.value}
      //   />
      // )
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'action',
      headerName: 'Actions',
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size='small'
            onClick={() => {
              setRow(params.row), setAlert(true)
            }}
            color='error'
          >
            <Icon icon='mdi:delete-outline' fontSize={20} />
          </IconButton>
        </Box>
      )
    }
  ]

  const handleStatusChange = (api, id, field, value) => {
    // Implement the logic to update the status value in your data
    api.setEditCellValue({ id, field, value })
  }

  //remove timesheet
  const removeTimeSheet = ts => {
    let timeSheets = [...data]
    var index = timeSheets.indexOf(ts)
    if (index !== -1) timeSheets.splice(index, 1)
    setLoading(false)
    dispatch(setTimeSheets(timeSheets))
  }

  //delete
  const handleDelete = () => {
    setAlert(false)
    setLoading(true)

    dispatch(DeleteData(row?.id))
      .then(unwrapResult)
      .then(res => {
        handleResponse('delete', res, removeTimeSheet, row)
      })
  }

  const updateTimeSheetTableData = newData => {
    const timeSheets = [...data]
    const index = timeSheets.findIndex(o => o.id == newData.id)
    timeSheets[index] = newData
    dispatch(setTimeSheets(timeSheets))
  }

  //process update
  const processRowUpdate = async newRow => {
    setLoading(true)
    const timeSheets = [...data]
    const burns = isNaN(newRow.burnedHours) ? newRow.burnedHours : Number(newRow.burnedHours)
    const _date =
      typeof newRow.timeSheetDate == 'string'
        ? new Date(newRow.timeSheetDate)
        : newRow.timeSheetDate
    const index = timeSheets.findIndex(d => d.id === newRow.id)
    const date = formatDateString(_date)
    const hours = await ConvertHoursToTime(burns)
    timeSheets[index] = {
      ...newRow,
      timeSheetDate: date,
      burnedHours: hours
    }

    const request = timeSheetRequest(timeSheets[index])
    await dispatch(UpdateData(request))
      .then(unwrapResult)
      .then(res => {
        setLoading(false)
        if (res?.hasError == null) {
          customErrorToast(res?.title)
        } else {
          handleResponse('update', res, updateTimeSheetTableData)
        }
      })
    setLoading(false)

    dispatch(setTimeSheets(timeSheets))

    return timeSheets[index]
  }

  return (
    <Box>
      {isLoading && <BackdropSpinner />}
      <DataGrid
        autoHeight
        rows={timeSheets || []}
        loading={loading}
        columns={columns}
        editMode='cell'
        sortingMode='client'
        localeText={{ noRowsLabel: NODATA.noData('timesheet') }}
        processRowUpdate={processRowUpdate}
        disableRowSelectionOnClick
        disableColumnMenu
        hideFooter
        sx={{
          '&, [class^=MuiDataGrid]': { border: 'none' },
          '&:hover': { cursor: 'pointer' },
          '& .MuiDataGrid-columnHeaders': {
            display: 'none'
          }
        }}
      />

      <DynamicDeleteAlert
        open={alert}
        setOpen={setAlert}
        title='Delete Timesheet'
        action='Delete'
        handleAction={handleDelete}
      />
    </Box>
  )
}

export default TimeSheetTable
