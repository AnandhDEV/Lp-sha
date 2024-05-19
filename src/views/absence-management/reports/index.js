// ** React Imports
import { useEffect, useState, useCallback, useMemo } from 'react'

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
import { AvatarGroup, Button, Grid, IconButton, Popover, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getProjectDetails, setSelectedProject } from 'src/store/apps/projects'
import FallbackSpinner from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import ReportsHeader from './ReportsHeader'
import {
  fetchPolicies,
  fetchStatus,
  fetchUserReports,
  resetReport
} from 'src/store/absence-management'
import { formatLocalDate } from 'src/helpers/dateFormats'
import { LEAVE_STATUS, NODATA } from 'src/helpers/constants'

const LeaveReports = () => {
  // ** States
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')
  const [isLoading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const [report, setReport] = useState({
    user: null,
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  })

  useEffect(() => {
    return () => {
      dispatch(resetReport([]))
    }
  }, [])

  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'leavePolicyName',
      headerName: 'Request Type',
      renderCell: params => <div style={{ fontWeight: 'bold' }}>{params.value}</div>
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'requestReason',
      headerName: 'Reason',
      renderCell: params => <div style={{ whiteSpace: 'pre-line' }}>{params.value}</div>
    },
    {
      flex: 0.15,
      field: 'duration',
      headerName: 'Duration'
    },
    {
      flex: 0.15,
      field: 'fromDate',
      headerName: 'From',
      renderCell: params => <>{formatLocalDate(new Date(params.value))}</>
    },
    {
      flex: 0.15,
      field: 'toDate',
      headerName: 'To',
      renderCell: params => <>{formatLocalDate(new Date(params.value))}</>
    },
    {
      flex: 0.13,
      field: 'createdDate',
      headerName: 'Applied',
      renderCell: params => <>{formatLocalDate(new Date(params.value))}</>
    },
    {
      flex: 0.15,
      field: 'requestStatusName',
      headerName: 'Status',
      renderCell: params => {
        const status = LEAVE_STATUS.find(o => o.name == params.value)

        return <CustomChip size='small' skin='light' color={status.color} label={params.value} />
      }
    }
  ]

  const getReports = useCallback(
    (data, user) => {
      setLoading(true)
      dispatch(fetchUserReports(data)).then(() => {
        setReport(prev => ({ ...prev, start: data.fromDate, end: data.toDate, user: user }))
        setLoading(false)
      })
    },
    [store.reports]
  )

  return (
    <Card>
      <ReportsHeader
        getData={getReports}
        user={report.user}
        fromDate={new Date(report.start)}
        toDate={new Date(report.end)}
      />
      <DataGrid
        autoHeight
        pagination
        rows={store.reports || []}
        columns={columns}
        sortingMode='client'
        rowSelection={false}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        loading={isLoading}
        className='no-border'
        localeText={{ noRowsLabel: NODATA.noData('report') }}
        disableRowSelectionOnClick
        disableColumnMenu
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25
            }
          }
        }}
      />
    </Card>
  )
}

export default LeaveReports
