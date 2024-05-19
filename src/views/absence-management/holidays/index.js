// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DatePicker from 'react-datepicker'
import { DataGrid } from '@mui/x-data-grid'
import TextField from '@mui/material/TextField'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** ThirdParty Components
import axios from 'axios'
import dayjs from 'dayjs'

// ** Custom Table Components Imports
import SidebarAddHoliday from 'src/views/pages/account-settings/holiday/AddHolidayDrawer'

// ** Apimethod and Endpoints
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'

import {
  fetchHolidays,
  deleteHoliday,
  updateHoliday,
  setHolidays
} from 'src/store/apps/accountSetting/index'
import SimpleBackdrop, { BackdropSpinner } from 'src/@core/components/spinner'
import { formatDateToYYYYMMDD, formatLocalDate } from 'src/helpers/dateFormats'
import HolidayForm from './HolidayForm'
import FallbackSpinner from 'src/layouts/components/LogoSpinner'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import { unwrapResult } from '@reduxjs/toolkit'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'
import { handleResponse } from 'src/helpers/helpers'
import { NODATA } from 'src/helpers/constants'
import Toolbar from 'src/views/absence-management/toolBar'

const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false
})

const Holidays = ({ popperPlacement }) => {
  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const { holidays } = useSelector(state => state.accountSetting)
  const [row, setRowData] = useState({})
  const [rows, setRows] = useState([])
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [formOpen, setForm] = useState(false)
  const [alert, setAlert] = useState(false)
  const [filteredRows, setFilteredRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [isUser, setIsUser] = useState(true)

  const dispatch = useDispatch()

  useEffect(() => {
    setIsUser(JSON.parse(localStorage.getItem('isUser')))
  }, [])

  const columns = isUser
    ? [
      {
        field: 'date',
        headerName: 'Holiday',
        type: 'date',
        width: 300,
        editable: true,
        renderCell: params => <div>{formatLocalDate(params.value)}</div>
      },
      {
        flex: 1,
        field: 'leaveDescription',
        headerName: 'Description',
        editable: true,
        renderCell: params => <div style={{ fontWeight: '600' }}>{params.value}</div>
      }
    ]
    : [
      {
        field: 'date',
        headerName: 'Holiday',
        type: 'date',
        width: 300,
        editable: true,
        renderCell: params => <div>{formatLocalDate(params.value)}</div>
      },
      {
        flex: 1,
        field: 'leaveDescription',
        headerName: 'Description',
        editable: true,
        renderCell: params => <div style={{ fontWeight: '600' }}>{params.value}</div>
      },
      {
        flex: 0.3,
        field: 'action',
        type: 'actions',
        headerName: 'Actions',
        cellClassName: 'actions',
        renderCell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color='info' size='small' onClick={() => handleRowClick(row)}>
              <Icon icon='mdi:edit-outline' fontSize={20} />
            </IconButton>
            <IconButton
              size='small'
              color='error'
              onClick={() => {
                setAlert(true), setRowData(row)
              }}
            >
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          </Box>
        )
      }
    ]
  useEffect(() => {
    let holidaysvalues = holidays?.map(e => ({
      ...e,
      date: new Date(e?.date)
    }))
    setRows(holidaysvalues)
  }, [holidays])

  const toggleAddUserDrawer = () => {
    setAddUserOpen(!addUserOpen)
  }

  const handleRowClick = data => {
    if (!isUser) {
      setRowData(data)
      setForm(true)
    }
  }

  const handleSearch = value => {
    setSearchValue(value)
    const data = rows.map(o => ({ ...o, leaveDescription: o.leaveDescription.toLowerCase() }))
    const filteredRows = data.filter(
      o =>
        o.leaveDescription.trim().includes(value.toLowerCase()) ||
        formatLocalDate(o.date).includes(value)
    )
    const _data = rows.filter(o => filteredRows.some(f => f.id == o.id))
    setFilteredRows(_data)
  }

  //UPDATE Holiday STATE
  const updateHolidayState = holiday => {
    let holidays = [...rows]
    const index = holidays.findIndex(item => item.id === holiday.id)
    if (index != -1) {
      holidays.splice(index, 1)
    }
    dispatch(setHolidays(holidays))
  }

  const handleDelete = () => {
    setLoading(true)
    setAlert(false)
    try {
      dispatch(
        deleteHoliday([
          {
            id: row.id,
            date: formatDateToYYYYMMDD(row.date),
            leaveDescription: row.leaveDescription
          }
        ])
      )
        .then(unwrapResult)
        .then(res => {
          handleResponse('delete', res, updateHolidayState, row)
          setLoading(false)
        })
    } catch (error) {
      customErrorToast(res.data)
      setLoading(false)
    }
  }

  return (
    <>
      {isLoading && <BackdropSpinner />}
      <Card>
        <DatePickerWrapper>
          {/* <Box
          sx={{
            p: 5,
            pb: 3,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'end'
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size='small'
              sx={{ mr: 4, mb: 2 }}
              placeholder='Search Holiday'
              onChange={e => handleSearch(e.target.value)}
            />
          </Box>
        </Box> */}
          <Grid>
            <Toolbar
              title='Holidays'
              searchValue={searchValue}
              handleFilter={handleSearch}
              label='Holiday'
            />
            <DataGrid
              autoHeight
              pagination
              rows={searchValue ? filteredRows : rows || []}
              columns={columns}
              disableRowSelectionOnClick
              // onRowClick={handleRowClick}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              localeText={{ noRowsLabel: NODATA.noData('holiday') }}
              loading={rows == null}
              disableColumnMenu
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 25
                  }
                }
              }}
            />
          </Grid>
        </DatePickerWrapper>

        <HolidayForm isOpen={formOpen} row={row} setOpen={setForm} />
        <DynamicDeleteAlert
          open={alert}
          setOpen={setAlert}
          title='Delete Holiday'
          action='Delete'
          handleAction={handleDelete}
        />
      </Card>
    </>
  )
}

export default Holidays
