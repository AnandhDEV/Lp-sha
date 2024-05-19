// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

// ** ThirdParty Components
import axios from 'axios'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { AvatarGroup, Button, Grid, IconButton, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import OptionsMenu from 'src/@core/components/option-menu'
import FallbackSpinner, { BackdropSpinner } from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import Toolbar from 'src/views/absence-management/toolBar'
import LeaveDashboard from 'src/views/absence-management/dashboard/Dashboard'
import LeaveDetails from '../dashboard/LeaveDetails'
import LeaveApplyForm from './LeaveApplyForm'
import {
  fetchMyLeaves,
  fetchStatus,
  fetchPolicies,
  fetchUsers,
  fetchUserReports,
  fetchDashboard,
  deleteRequest,
  setMyleaves,
  setDashboards
} from 'src/store/absence-management'
import { formatLocalDate } from 'src/helpers/dateFormats'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import SimpleBackdrop from 'src/@core/components/spinner'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'
import Error404 from 'src/pages/404'
import { handleResponse } from 'src/helpers/helpers'
import { LEAVE_STATUS, NODATA } from 'src/helpers/constants'

const DynamicEditLeaveRequest = dynamic(
  () => import('src/views/absence-management/apply/EditLeaveRequest'),
  {
    ssr: false
  }
)

const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false
})

const LeaveApply = () => {
  // ** States
  const [row, setRow] = useState({})
  const [sort, setSort] = useState('asc')
  const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [alert, setOpenAlert] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [filteredRows, setFilteredRows] = useState([])
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const _userStore = useSelector(state => state.user)

  useEffect(() => {
    if (store.dashboards == null) {
      const userId = Number(localStorage.getItem('userId'))
      if (userId != 0) dispatch(fetchDashboard(userId))
    }
    store.myLeaves == null && dispatch(fetchMyLeaves())
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [alert])

  const columns = [
    {
      flex: 0.15,
      minWidth: 120,
      field: 'leavePolicyName',
      headerName: 'Request'
    },
    {
      flex: 0.17,
      minWidth: 120,
      field: 'requestReason',
      headerName: 'Reason',
      renderCell: params => <div style={{ whiteSpace: 'pre-line' }}>{params.value}</div>
    },
    {
      flex: 0.1,
      headerName: 'From Date',
      field: 'fromDate',
      renderCell: params => {
        return formatLocalDate(new Date(params.value))
      }
    },
    {
      flex: 0.1,
      headerName: 'To Date',
      field: 'toDate',
      renderCell: params => {
        return formatLocalDate(new Date(params.value))
      }
    },
    {
      flex: 0.1,
      headerName: 'Duration',
      field: 'duration',
      renderCell: params => {
        return <div>{params.value <= 1 ? `${params.value} day` : `${params.value} days`}</div>
      }
    },

    {
      flex: 0.12,
      headerName: 'Status',
      field: 'requestStatusId',
      renderCell: params => {
        const status = LEAVE_STATUS.find(o => o.id == params.value)

        return <CustomChip size='small' skin='light' color={status.color} label={status.name} />
      }
    },
    {
      flex: 0.08,
      headerName: 'Action',
      field: 'action',
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {row.requestStatusId == 4 ?
            <IconButton color='info' size='small' onClick={() => handleRowSelection(row)}>
              <Icon icon='mdi:edit-outline' fontSize={20} />
            </IconButton> : ''}

          {[2, 5, 8].includes(row.requestStatusId) ? (
            <Button
              variant='text'
              color='secondary'
              size='small'
              onClick={() => {
                setOpen(false), setRow(row), setOpenAlert(!alert)
              }}
            >
              Cancel
            </Button>
          ) : [1, 4].includes(row.requestStatusId) ? (

            <IconButton
              onClick={() => {
                setOpen(false), setRow(row), setOpenAlert(!alert)
              }}
              color='error'
            >
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          ) : null}
        </Box>
      )
    }
  ]

  const handleSearch = value => {
    setSearchValue(value)
    const data = store.myLeaves?.map(o => ({
      ...o,
      requestReason: o.requestReason.toLowerCase(),
      leavePolicyName: o.leavePolicyName.toLowerCase()
    }))
    const filteredRows = data.filter(
      o =>
        o.requestReason.trim().includes(value.toLowerCase()) ||
        o.leavePolicyName.trim().includes(value.toLowerCase())
    )
    const _data = store.myLeaves.filter(o => filteredRows.some(f => f.id == o.id))
    setFilteredRows(_data)
  }

  const handleRowSelection = data => {
    setOpen(true)
    setRow(data)
  }

  //UPDATE Request STATE
  const updateRequestsState = newReq => {
    let myleaves = [...store.myLeaves]
    let dashboards = [...store.dashboards]
    const index = myleaves.findIndex(item => item.id === newReq.id)
    let boardIndex = dashboards.findIndex(o => newReq.leavePolicyName === o.name)
    if (boardIndex != -1)
      dashboards[boardIndex] = {
        ...dashboards[boardIndex],
        balanceCount: dashboards[boardIndex]?.balanceCount + 1
      }

    if (index !== -1) {
      myleaves.splice(index, 1)
    }
    dispatch(setMyleaves(myleaves))
    dispatch(setDashboards(dashboards))
    setLoading(false)
  }

  //delete

  const handleDelete = () => {
    try {
      setLoading(true)
      setOpenAlert(!alert)
      dispatch(deleteRequest(row?.id))
        .then(unwrapResult)
        .then(res => {
          handleResponse('delete', res, updateRequestsState, row)
        })
    } catch (error) {
      toast.error(res.data)
      setLoading(false)
    }
  }

  return (
    <>
      {isLoading && <BackdropSpinner />}
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={6}>
          <LeaveDashboard />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <LeaveDetails />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <Toolbar
              title='My Requests'
              searchValue={searchValue}
              handleFilter={handleSearch}
              label='Request'
            />
            <DataGrid
              autoHeight
              pagination
              rows={searchValue ? filteredRows : store.myLeaves || []}
              columns={columns}
              rowSelection={false}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              loading={store.myLeaves == null}
              localeText={{ noRowsLabel: NODATA.noData('leave') }}
              disableColumnMenu
              // onCellClick={data =>
              //   data.row.requestStatusId == 1 || data.field != 'action'
              //     ? handleRowSelection(data)
              //     : null
              // }
              sx={{
                '&:hover': {
                  cursor: 'pointer'
                }
              }}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 25
                  }
                }
              }}
            />
          </Card>
        </Grid>
      </Grid>

      <DynamicEditLeaveRequest isOpen={isOpen} row={row} setOpen={setOpen} />
      <DynamicDeleteAlert
        open={alert}
        setOpen={setOpenAlert}
        title='Withdraw Request'
        action='Withdraw'
        content='Are you sure you want to withdraw the request?'
        handleAction={handleDelete}
      />
    </>
  )
}

export default LeaveApply
