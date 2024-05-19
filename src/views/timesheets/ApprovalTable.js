// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

// ** Utils Import
import { AvatarGroup, Button, Grid, IconButton, Popover, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { NODATA } from 'src/helpers/constants'
import {
  setTimeSheetApprovalsRowId,
  fetchTimeSheetApprovals,
  setIsLoadingTimesheetApproval
} from 'src/store/timesheets/index'
import { fetchGetTimeSheetUser } from 'src/store/apps/reports'
import { BackdropSpinner } from 'src/@core/components/spinner'
import CustomChip from 'src/@core/components/mui/chip'

const ApprovalTable = () => {
  // ** States
  const [loading, setLoading] = useState(false)
  const { timesheetreports, reportType, dateRange, isLoadingTimesheetApproval } = useSelector(
    state => state.timesheets
  )
  const { getTimesheetUsers } = useSelector(state => state.reports)
  const dispatch = useDispatch()

  useEffect(() => {
    // getReports()
    dispatch(fetchGetTimeSheetUser())
  }, [])

  // const getReports = async () => {
  //   setLoading(true)

  //   setLoading(false)
  // }

  const columns = [
    {
      flex: 0.5,
      minWidth: 230,
      field: 'userName',
      headerName: 'User',
      renderCell: params => <div style={{ fontWeight: 'bold' }}>{params.value}</div>
    },
    {
      flex: 0.11,
      field: 'isSubmited',
      headerName: '',
      renderCell: params => {
        if (params.value === false) {

          return (
            ""
          )
        } else {

          return (
            <CustomChip size='small' skin='light' color='success' label='Request for Approval' />
          )
        }
      }
    }
  ]

  const handleRowClick = params => {
    dispatch(setIsLoadingTimesheetApproval(true))
    dispatch(fetchTimeSheetApprovals(params.row.userId))
    dispatch(setTimeSheetApprovalsRowId({ id: params.row.userId, userName: params.row.userName }))
  }

  return (
    <>
      {loading && <BackdropSpinner />}
      <Card>
        <DataGrid
          autoHeight
          pagination
          getRowId={item => item?.userId ?? ''}
          rows={getTimesheetUsers ?? []}
          columns={columns}
          rowSelection={true}
          hideFooterSelectedRowCount
          getCellClassName={() => 'indented-cell'}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          className='no-border'
          localeText={{ noRowsLabel: NODATA.noData('report') }}
          disableColumnMenu
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25
              }
            },
            sorting: {
              sortModel: [{ field: 'name', sort: 'asc' }]
            }
          }}
          sx={{
            boxShadow: 'rgb(90 114 123 / 11%) 0px 7px 30px 0px',
            border: 'none',
            borderRadius: '10px',
            borderColor: 'primary.light',
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
              cursor: 'pointer'
            }
          }}
          onRowClick={handleRowClick}
        />
      </Card>
    </>
  )
}

export default ApprovalTable
