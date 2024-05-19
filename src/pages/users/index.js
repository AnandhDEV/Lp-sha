// ** React Imports
import { useState, useEffect, useCallback, useMemo } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import Select from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser, fetchUsers, setUserId } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import { NODATA, roles } from 'src/helpers/constants'
import { useRouter } from 'next/router'
import SimpleBackdrop, { BackdropSpinner, Spinner } from 'src/@core/components/spinner'

// ** Vars

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

// ** renders client column
const renderClient = row => {
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  return (
    <CustomAvatar
      skin='light'
      color={color}
      sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
    >
      {getInitials(row ? row : 'John Doe')}
    </CustomAvatar>
  )

  // }
}

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'fullName',
    headerName: 'User',
    renderCell: ({ row }) => {
      // const { fullName, username } = row
      const fullName = `${row?.firstName} ${row?.lastName}`

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(fullName)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <LinkStyled href={`/users/${row.id}`}>{fullName}</LinkStyled>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'email',
    headerName: 'Email',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.email}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    field: 'roleId',
    minWidth: 150,
    headerName: 'Role',
    renderCell: ({ value }) => {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& svg': { mr: 3, color: roles[Number(value)]?.color }
          }}
        >
          <Icon icon={roles[Number(value)]?.icon} fontSize={20} />
          <CustomChip size='small' label={roles[value]?.name} skin='light' color='primary' />
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Cost',
    field: 'currentPlan',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ textTransform: 'capitalize' }}>
          {row.costPerHour}
        </Typography>
      )
    }
  }
]

const UserList = ({ apiData }) => {
  // ** State
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [filteredData, setFilteredData] = useState([])

  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  useEffect(() => {
    if (store.users == null) {
      setLoading(true)
      dispatch(fetchUsers()).then(res => setLoading(false))
    }
  }, [])

  const handleSearch = value => {
    setValue(value)
    const rowData = store.users ? [...store.users] : []

    const filtered = rowData?.filter(
      user =>
        (user.fullName && user.fullName.toLowerCase().includes(value.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(value.toLowerCase())) ||
        (user.costPerHour && user.costPerHour.toString().includes(value))
    )
    setFilteredData(filtered)
  }

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const onViewUser = data => {
    dispatch(setUserId(data?.row.id))
    router.push('/users/[id]', `/users/${data?.row.id}`)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader />
          <TableHeader
            title='Users'
            value={value}
            handleFilter={handleSearch}
            toggle={toggleAddUserDrawer}
          />
          <DataGrid
            autoHeight
            rows={value ? filteredData : store.users || []}
            columns={columns}
            disableRowSelectionOnClick
            onRowClick={onViewUser}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            loading={isLoading}
            localeText={{ noRowsLabel: NODATA.noData('user') }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25
                }
              },
              sorting: {
                sortModel: [{ field: 'fullName', sort: 'asc' }],
              },
            }}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export default UserList
