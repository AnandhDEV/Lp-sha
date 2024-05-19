import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import { DataGrid} from '@mui/x-data-grid'

import { Grid, Typography } from '@mui/material'
import TextField from '@mui/material/TextField'
import timesheets, { UpdateData, DeleteData, setTimeSheets } from 'src/store/timesheets/index'
import { unwrapResult } from '@reduxjs/toolkit'
import dynamic from 'next/dynamic'
import { handleResponse } from 'src/helpers/helpers'
import { BackdropSpinner } from 'src/@core/components/spinner'
import { formatLocalDate } from 'src/helpers/dateFormats'
import { NODATA } from 'src/helpers/constants'


const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false
})

const TimeSheetApprovalTable = ({ popperPlacement, loading, timeSheets, disable }) => {
  const dispatch = useDispatch()
  const { data, isLoadingTimesheetApproval} = useSelector(state => state.timesheets)
  const [flattenedTimesheets, setFlattenedTimesheets] = useState([])
  const [alert, setAlert] = useState(false)
  const [row, setRow] = useState({})
  const [isLoading, setLoading] = useState(false)
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    if (timeSheets && timeSheets?.length > 0) {
      const _timeSheets = [...timeSheets].sort(
        (a, b) => new Date(b.timeSheetDate) - new Date(a.timeSheetDate)
      )
      setTableData(_timeSheets)
    }
    
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

  const columns = [

    {
      flex: 0.3,
      field: 'projectName',
      headerName: 'Project'
    },
   
    {
      flex: 0.6,
      field: 'taskName',
      headerName: ' Task Description',
      renderCell: params => params.row.taskDescription
    },

    {
      flex: 0.15,
      field: 'timeSheetDate',
      headerName: 'Date',
      renderCell: params => formatLocalDate(new Date(params.value))
    },
    {
      flex: 0.1,
      type: 'time',
      headerName: 'Hours',
      field: 'burnedHours',
      renderCell: params => (
        <div>{`${params.value?.split(':')[0]}:${params.value?.split(':')[1]}`}</div>
      )
    }
  ]

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
 

  return (
    <>
    <Box>
    {isLoadingTimesheetApproval && <BackdropSpinner />}
      <DataGrid
        autoHeight
        rows={timeSheets || []}
        columns={columns}
        editMode='cell'
        sortingMode='client'
        localeText={{ noRowsLabel: NODATA.noData('timesheet') }}
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
    </>
  )
}

export default TimeSheetApprovalTable
