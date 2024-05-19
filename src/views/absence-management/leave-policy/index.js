// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import FallbackSpinner, { BackdropSpinner } from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import Toolbar from 'src/views/absence-management/toolBar'
import { deletePolicy, fetchPolicies, setPolicies } from 'src/store/absence-management'
import instance, { base, identifyURL } from 'src/store/endpoints/interceptor'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import { endpoints } from 'src/store/endpoints/endpoints'
import axios from 'axios'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'
import { handleResponse } from 'src/helpers/helpers'
import { NODATA } from 'src/helpers/constants'
import { useAuth } from 'src/hooks/useAuth'

const DynamicEditLeavePolicy = dynamic(
  () => import('src/views/absence-management/leave-policy/EditLeavePolicy'),
  {
    ssr: false
  }
)

const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false
})

const LeavePolicy = ({ data }) => {
  // ** States
  const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [rowData, setRowData] = useState({})
  const [alert, setOpenAlert] = useState(false)
  const [filteredRows, setFilteredRows] = useState([])
  const [isUser, setIsUser] = useState(true)
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const auth = useAuth()
  const IsUser = auth.user.roleId == 4


  useEffect(() => {
    setIsUser(IsUser)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [alert])

  const columns = isUser
    ? [
      {
        flex: 0.3,
        field: 'typeOfLeave',
        headerName: 'Policy',
        renderCell: params => <div style={{ fontWeight: 'bold' }}>{params.value}</div>
      },
      {
        flex: 0.2,
        minWidth: 120,
        headerName: 'Allowance',
        field: 'allowanceCount'
      },
      {
        flex: 0.2,
        minWidth: 120,
        headerName: 'Permission Hours',
        field: 'allowanceTime'
      },
      {
        flex: 0.2,
        headerName: 'Period',
        field: 'period',
        renderCell: params => {
          return (
            <>
              {params.value?.toLowerCase() === 'month' ? (
                <Typography variant='body2' color='secondary'>
                  Month
                </Typography>
              ) : (
                <Typography variant='body2' color='primary'>
                  Year
                </Typography>
              )}
            </>
          )
        }
      },

      {
        flex: 0.2,
        headerName: 'Carry Forward Count',
        field: 'carryForwardCount'
      }
    ]
    : [
      {
        flex: 0.3,
        field: 'typeOfLeave',
        headerName: 'Policy',
        renderCell: params => <div style={{ fontWeight: 'bold' }}>{params.value}</div>
      },
      {
        flex: 0.2,
        minWidth: 120,
        headerName: 'Allowance',
        field: 'allowanceCount'
      },
      {
        flex: 0.2,
        minWidth: 120,
        headerName: 'Permission Hours',
        field: 'allowanceTime'
      },
      {
        flex: 0.2,
        headerName: 'Period',
        field: 'period',
        renderCell: params => {
          return (
            <>
              {params.value?.toLowerCase() === 'month' ? (
                <Typography variant='body2' color='secondary'>
                  Month
                </Typography>
              ) : (
                <Typography variant='body2' color='primary'>
                  Year
                </Typography>
              )}
            </>
          )
        }
      },

      {
        flex: 0.2,
        headerName: 'Carry Forward Count',
        field: 'carryForwardCount'
      },
      {
        flex: 0.08,
        minWidth: 120,
        headerName: 'Action',
        field: 'action',
        sortable: false,
        renderCell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color='info' size='small' onClick={() => handleRowSelection(row)}>
              <Icon icon='mdi:edit-outline' fontSize={20} />
            </IconButton>
            <IconButton
              onClick={() => {
                setOpen(false), setRowData(row), setOpenAlert(!alert)
              }}
              color='error'
            >
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          </Box>
        )
      }
    ]

  //UPDATE POLICY STATE
  const updatePolicyState = newPolicy => {
    let policies = [...store.policies]
    const index = policies.findIndex(item => item.id === newPolicy.id)

    if (index !== -1) {
      policies.splice(index, 1)
    }
    dispatch(setPolicies(policies))
    setLoading(false)
  }

  //delete

  const handleDelete = () => {
    try {
      setLoading(true)
      setOpenAlert(!alert)
      dispatch(deletePolicy(rowData?.id))
        .then(unwrapResult)
        .then(res => {
          handleResponse('delete', res, updatePolicyState, rowData)
          setLoading(false)
        })
    } catch (error) {
      customErrorToast(res.data)
      setLoading(false)
    }
  }

  const handleSearch = value => {
    setSearchValue(value)

    const rows = store.policies.map(l => ({
      ...l,
      typeOfLeave: l.typeOfLeave.toLowerCase(),
      period: l.period.toLowerCase(),
      allowanceCount: l.allowanceCount.toString(),
      allowanceTime: l.allowanceTime.toString(),
      carryForwardCount: l.carryForwardCount.toString()
    }))

    const filteredRows = rows.filter(
      o =>
        o.typeOfLeave.trim().includes(value.toLowerCase()) ||
        o.period.trim().includes(value.toLowerCase()) ||
        o.allowanceCount.trim().includes(value) ||
        o.allowanceTime.trim().includes(value) ||
        o.carryForwardCount.trim().includes(value)
    )
    const _data = store.policies.filter(o => filteredRows.some(f => f.id == o.id))
    setFilteredRows(_data)
  }

  const handleRowSelection = data => {
    setOpen(true)
    setRowData(data)
  }

  return (
    <>
      {isLoading ? <BackdropSpinner /> :

        <Card>
          <DataGrid
            autoHeight
            pagination
            rows={searchValue ? filteredRows : store.policies ? store.policies : []}
            columns={columns}
            rowSelection={false}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            localeText={{ noRowsLabel: NODATA.noData('policy') }}
            className='no-border'
            loading={store.policies == null}
            disableColumnMenu
            slots={{
              toolbar: () => {
                return (
                  <Toolbar
                    title='Leave Policies'
                    searchValue={searchValue}
                    handleFilter={handleSearch}
                    label='Policy'
                  />
                )
              }
            }}
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
              },
              sorting: {
                sortModel: [{ field: 'typeOfLeave', sort: 'asc' }],
              },
            }}
          />
        </Card>
      }
      <DynamicEditLeavePolicy isOpen={isOpen} row={rowData} setOpen={setOpen} />
      <DynamicDeleteAlert
        open={alert}
        setOpen={setOpenAlert}
        title='Delete Policy'
        action='Delete'
        handleAction={handleDelete}
      />

    </>
  )
}

export async function getStaticProps() {
  // Use Axios to fetch data from an API with headers
  const response = await axios.get(base.url + endpoints.getLeavePolicy, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
    }
  })
  const { data } = response

  return {
    props: {
      data
    }
  }
}

export default LeavePolicy
