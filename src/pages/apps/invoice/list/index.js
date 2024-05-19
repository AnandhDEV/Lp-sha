/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */

// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, deleteInvoice } from 'src/store/apps/invoice'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/views/apps/invoice/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import dayjs from 'dayjs'
import Toolbar from 'src/views/apps/invoice/list/toolBar'
import SimpleBackdrop from 'src/@core/components/spinner'

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// ** Vars
const invoiceStatusObj = {
  Sent: { color: 'secondary', icon: 'mdi:send' },
  Paid: { color: 'success', icon: 'mdi:check' },
  Draft: { color: 'primary', icon: 'mdi:content-save-outline' },
  'Partial Payment': { color: 'warning', icon: 'mdi:chart-pie' },
  'Past Due': { color: 'error', icon: 'mdi:information-outline' },
  Downloaded: { color: 'info', icon: 'mdi:arrow-down' }
}

// ** renders client column
const renderClient = row => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(row.name || 'John Doe')}
      </CustomAvatar>
    )
  }
}

const defaultColumns = [
  {
    flex: 0.3,
    field: 'uniqueId',
    minWidth: 250,
    headerName: '#',
    renderCell: ({ row }) => (
      <LinkStyled
        href={`/apps/invoice/preview?projectId=${row.projectId}&period=${row.period}&duedate=${row.dueDate}`}
      >{`#${row.uniqueId}`}</LinkStyled>
    )
  },
  {
    flex: 0.2,
    field: 'clientName',
    minWidth: 200,
    headerName: 'Client',
    renderCell: ({ row }) => {
      const { clientName } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* {renderClient(row)} */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {clientName}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.25,
    field: 'projectName',
    minWidth: 200,
    headerName: 'Project Name',
    renderCell: ({ row }) => {
      const { projectName } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* {renderClient(row)} */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {projectName}
            </Typography>
          </Box>
        </Box>
      )
    }
  },

  {
    flex: 0.15,
    minWidth: 125,
    field: 'dueDate',
    headerName: 'Due Date',
    renderCell: ({ row }) => (
      <Typography variant='body2'>{dayjs(row.dueDate).format('DD/MM/YYYY')}</Typography>
    )
  }
]
/* eslint-disable */
const CustomInput = forwardRef((props, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates
  return (
    <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
  )
})

/* eslint-enable */
const InvoiceList = () => {
  // ** State
  const [dates, setDates] = useState([])
  const [value, setValue] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [endDateRange, setEndDateRange] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [startDateRange, setStartDateRange] = useState(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [filteredRows, setRows] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setLoading] = useState(false)

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.invoice)
  useEffect(() => {
    setLoading(true)
    dispatch(fetchData()).then(res => setLoading(false))
  }, [dispatch])

  const handleFilter = val => {
    setValue(val)
  }

  const handleStatusValue = e => {
    setStatusValue(e.target.value)
  }

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const handleSearch = value => {
    setSearchValue(value)
    const rows = store.data.filter(
      o =>
        o.clientName?.toLowerCase().trim().includes(value) ||
        o.projectName?.toLowerCase().trim().includes(value) ||
        o.uniqueId?.toLocaleLowerCase().trim().includes(value)
    )
    setRows(rows)
  }

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Tooltip title='View'>
            <IconButton
              size='small'
              component={Link}
              href={`/apps/invoice/preview?projectId=${row.projectId}&period=${row.period}&duedate=${row.dueDate}`}
            >
              <Icon icon='mdi:eye-outline' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {isLoading ? (
            <SimpleBackdrop />
          ) : (
            <Card>
              <DataGrid
                autoHeight
                pagination
                rows={searchValue ? filteredRows : store.data || []}
                //
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                pageSizeOptions={[5,10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={rows => setSelectedRows(rows)}
                getRowId={row => row?.uniqueId}
                slots={{
                  toolbar: () => {
                    return <Toolbar searchValue={searchValue} handleFilter={handleSearch} />
                  }
                }}
                loading={store.data ? false : true}
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
          )}
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default InvoiceList
