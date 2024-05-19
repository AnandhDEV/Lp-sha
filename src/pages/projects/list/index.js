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
import Toolbar from 'src/views/projects/list/toolBar'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { Grid } from '@mui/material'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchClients,
  fetchProjects,
  fetchUsers,
  setSelectedProject
} from 'src/store/apps/projects'
import { Icon } from '@iconify/react'
import OptionsMenu from 'src/@core/components/option-menu'
import FallbackSpinner, { BackdropSpinner } from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import { NODATA } from 'src/helpers/constants'
import currencySymbols from 'src/views/projects/reports/chart/currencySymbols'
import { useAuth } from 'src/hooks/useAuth'

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const TableServerSide = () => {
  // ** States
  const [sort, setSort] = useState('asc')
  const [filteredRows, setRows] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [sortColumn, setSortColumn] = useState('name')
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const router = useRouter()
  const [role, setRole] = useState(0)
  const [isUser, setIsUser] = useState(true)
  const auth = useAuth()
  const roleId = auth.user?.roleId
  const IsUser = auth.user?.roleId == 4
  useEffect(() => {
    setRole(roleId)
    setIsUser(IsUser)
  }, [])

  useEffect(() => {
    dispatch(fetchProjects()).then(res => setLoading(false))
  }, [dispatch, searchValue, sort, sortColumn])

  const getCurrencySymbol = (currencyCode) => {
    return currencySymbols[currencyCode] || currencyCode
  }

  let columns = []
  if (role == 1 || role == 3) {

    columns = [
      {
        flex: 0.3,
        minWidth: 200,
        field: 'name',
        headerName: 'Name',

        renderCell: params => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <LinkStyled href=''>{params.value}</LinkStyled>
            </Box>
          )
        }
      },
      {
        flex: 0.2,
        minWidth: 120,
        headerName: 'Client',
        field: 'clientName'
      },

      {
        flex: 0.1,
        minWidth: 110,
        field: 'budget',
        headerName: 'Budget',
        align: "right",
        headerAlign: 'center',
        renderCell: (params) => {
          const currency = params.row.currency;
          const currencySymbol = getCurrencySymbol(currency);
          const budget = parseFloat(params.value);
          const formattedBudget = budget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          return (
            <span>
              {currencySymbol} {formattedBudget}
            </span>
          );
        }
      },

      {
        flex: 0.1,
        field: 'estimatedHours',
        minWidth: 80,
        headerName: 'Hours',
        align: 'center',
        headerAlign: 'center'

      },
      {
        flex: 0.08,
        minWidth: 100,
        field: 'isBillable',
        headerName: 'Billable',
        headerAlign: 'center',
        align: 'center',

        renderCell: params => (
          <Grid>
            {params.value ? (
              <CustomAvatar skin='light' color='success'>
                <Icon icon='mdi:checkbox-marked-circle-outline' />
              </CustomAvatar>
            ) : (
              <CustomAvatar skin='light' color='error'>
                <Icon icon='mdi:close-circle-outline' />
              </CustomAvatar>
            )}
          </Grid>
        )
      },
      {
        flex: 0.08,
        minWidth: 100,
        field: 'isActive',
        headerName: 'Active',
        headerAlign: 'center',
        align: 'center',

        renderCell: params => (
          <Grid>
            {params.value ? (
              <CustomAvatar skin='light' color='success'>
                <Icon icon='mdi:checkbox-marked-circle-outline' />
              </CustomAvatar>
            ) : (
              <CustomAvatar skin='light' color='error'>
                <Icon icon='mdi:close-circle-outline' />
              </CustomAvatar>
            )}
          </Grid>
        )
      }
    ]
  } else {
    columns = [
      {
        flex: 0.3,
        minWidth: 200,
        field: 'name',
        headerName: 'Name',

        renderCell: params => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <LinkStyled href=''>{params.value}</LinkStyled>
            </Box>
          )
        }
      },
      {
        flex: 0.2,
        minWidth: 120,
        headerName: 'Client',
        field: 'clientName'
      },
      {
        flex: 0.08,
        minWidth: 100,
        field: 'isBillable',
        headerName: 'Billable',
        headerAlign: 'center',
        align: 'center',

        renderCell: params => (
          <Grid>
            {params.value ? (
              <CustomAvatar skin='light' color='success'>
                <Icon icon='mdi:checkbox-marked-circle-outline' />
              </CustomAvatar>
            ) : (
              <CustomAvatar skin='light' color='error'>
                <Icon icon='mdi:close-circle-outline' />
              </CustomAvatar>
            )}
          </Grid>
        )
      },
      {
        flex: 0.08,
        minWidth: 100,
        field: 'isActive',
        headerName: 'Active',
        headerAlign: 'center',
        align: 'center',

        renderCell: params => (
          <Grid>
            {params.value ? (
              <CustomAvatar skin='light' color='success'>
                <Icon icon='mdi:checkbox-marked-circle-outline' />
              </CustomAvatar>
            ) : (
              <CustomAvatar skin='light' color='error'>
                <Icon icon='mdi:close-circle-outline' />
              </CustomAvatar>
            )}
          </Grid>
        )
      }
    ]

  }

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

  //SEARCH
  const handleSearch = value => {
    setSearchValue(value)
    const rows = store.allProjects.filter(
      o =>
        o.name?.toLowerCase().trim().includes(value?.toLowerCase()) ||
        o.clientName?.toLowerCase().trim().includes(value?.toLowerCase()) ||
        o.budget?.toString().toLowerCase().trim().includes(value?.toLowerCase()) ||
        o.estimatedHours?.toString().toLowerCase().trim().includes(value?.toLowerCase())
    )
    setRows(rows)
  }

  const handleProjectSelection = data => {
    setLoading(true)
    dispatch(setSelectedProject(data.row))

    localStorage.setItem(
      'project',
      JSON.stringify({ ...data.row, skillId: data.row.skills.map(item => item.skillId) })
    )
    // localStorage.setItem('projectId', data.row.id)
    // localStorage.setItem('projectName', data.row?.name)

    router.push({
      pathname: `/projects/details/${'task'}/${data.row.projectId}`
    })

    // router.push({
    //   pathname: '/projects/details',
    //   query: { Tab: 'task', projectId: data.row.projectId },
    // })

    setLoading(false)
  }

  return (
    <>
      <Card>
        <DataGrid
          autoHeight
          pagination
          rows={searchValue ? filteredRows : store.allProjects || []}
          columns={columns}
          sortingMode='client'
          rowSelection={false}
          onRowClick={handleProjectSelection}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          loading={isLoading}
          disableColumnMenu
          localeText={{ noRowsLabel: NODATA.noData('project') }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25
              }
            },
            sorting: {
              sortModel: [{ field: 'name', sort: 'asc' }],
            },
          }}
          slots={{
            toolbar: () => {
              return (
                <Toolbar title='Projects' searchValue={searchValue} isUser={isUser} handleFilter={handleSearch} />
              )
            }
          }}
          sx={{
            '&:hover': {
              cursor: 'pointer'
            }
          }}
        />
      </Card>
    </>
  )
}

export default TableServerSide
