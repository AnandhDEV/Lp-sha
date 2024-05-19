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
import {
  fetchProjects,
  fetchUsers,
  fetchClients,
  setProject,
  deleteProject,
  getProjectDetails,
  setSelectedProject
} from 'src/store/apps/projects'
import { Icon } from '@iconify/react'
import OptionsMenu from 'src/@core/components/option-menu'
import FallbackSpinner from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import Toolbar from 'src/views/absence-management/toolBar'
import LeaveDashboard from 'src/views/absence-management/dashboard/Dashboard'
import SimpleBackdrop from 'src/@core/components/spinner'

const AllRequests = () => {
  // ** States
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('asc')


  const [isLoading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)

  const columns = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 80,
      headerName: 'S.NO'
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'userName',
      headerName: 'User',
      renderCell: ({ row, value }) => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <CustomAvatar
              src={row.image}
              skin='light'
              color='primary'
              sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
            >
              {getInitials(value ? value : 'John Doe')}
            </CustomAvatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant=''>{value}</Typography>
              <Typography variant='caption'>{row.email}</Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'request',
      headerName: 'Request'
    },
    {
      flex: 0.17,
      minWidth: 100,
      headerName: 'Date',
      field: 'date'
    },

    {
      flex: 0.125,
      field: 'approvalDate',
      minWidth: 80,
      headerName: 'Approval Date'
    },
    {
      flex: 0.12,
      minWidth: 100,
      headerName: 'Status',
      field: 'status',
      renderCell: params => {
        return (
          <CustomChip
            size='small'
            skin='light'
            color={
              params.value === 'Approved'
                ? 'success'
                : params.value === 'Rejected'
                  ? 'error'
                  : 'warning'
            }
            label={params.value}
          />
        )
      }
    }
  ]

  const handleSortModel = newModel => {
    if (newModel.length) {
      setSort(newModel[0].sort)
      setSortColumn(newModel[0].field)
      fetchTableData(newModel[0].sort, searchValue, newModel[0].field)
    } else {
      setSort('asc')
      setSortColumn('full_name')
    }
  }

  const handleSearch = value => {
    setSearchValue(value)
    fetchTableData(sort, value, sortColumn)
  }

  const handleProjectSelection = data => {
    dispatch(getProjectDetails(data.row.uniqueId))
    dispatch(setSelectedProject(data.row))
  }

  return (
    <>
      {isLoading ? (
        <SimpleBackdrop />
      ) : (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <DataGrid
                autoHeight
                pagination
                rows={rows}
                rowCount={rows.length}
                columns={columns}
                rowSelection={false}
                onRowClick={() => { }}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                paginationModel={paginationModel}
                onSortModelChange={() => { }}
                slots={{
                  toolbar: () => {
                    return <Toolbar />
                  }
                }}
                onPaginationModelChange={setPaginationModel}
                loading={rows.length === 0}
                slotProps={{
                  baseButton: {
                    variant: 'outlined'
                  },
                  toolbar: {
                    value: searchValue,
                    clearSearch: () => handleSearch(''),
                    onChange: event => handleSearch(event.target.value)
                  }
                }}
              />
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default AllRequests
