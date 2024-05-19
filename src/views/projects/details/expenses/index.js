import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
// ** ThirdParty Components
import axios from 'axios'
// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { AvatarGroup, Button, Grid, IconButton, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import OptionsMenu from 'src/@core/components/option-menu'
import FallbackSpinner, { BackdropSpinner } from 'src/@core/components/spinner'
import SimpleBackdrop from 'src/@core/components/spinner'
import { deleteExpense, fetchExpenses, setEditExpenses, setExpenses } from 'src/store/apps/projects'
import { unwrapResult } from '@reduxjs/toolkit'
import Toolbar from 'src/views/absence-management/toolBar'
import dynamic from 'next/dynamic'
import { handleResponse } from 'src/helpers/helpers'
import { formatLocalDate } from 'src/helpers/dateFormats'
import { hide } from '@popperjs/core'
import { NODATA } from 'src/helpers/constants'
import toast from 'react-hot-toast'

const DynamicNewExpenses = dynamic(
  () => import('src/views/projects/details/expenses/NewExpenses'),
  {
    ssr: false
  }
)
const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false
})
const Expenses = ({ id }) => {
  const store = useSelector(state => state.projects)
  const [searchValue, setSearchValue] = useState('')
  const [selectedRow, setSelectedRow] = useState(null)
  const [isOpen, setOpen] = useState(false)
  const [alert, setOpenAlert] = useState(false)
  const [row, setRow] = useState({})
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [filteredRows, setFilteredRows] = useState([])
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })

  useEffect(() => {
    if (store.expenses == null) {
      setLoading(true)
      dispatch(fetchExpenses(id))
        .then(unwrapResult)
        .then(data => {
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching expenses:', error)
          setLoading(false)
        })
    }
  }, [id])

  const columns = [
    {
      flex: 0.15,
      minWidth: 110,
      field: 'expense',
      headerName: 'Expense'
    },
    {
      flex: 0.1,
      minWidth: 120,
      field: 'cost',
      headerName: 'Cost'
    },
    {
      flex: 0.17,
      minWidth: 100,
      headerName: 'Date',
      field: 'date',
      renderCell: params => {
        return formatLocalDate(new Date(params.value))
      }
    },
    {
      flex: 0.25,
      field: 'description',
      minWidth: 80,
      headerName: 'Description'
    },
    {
      flex: 0.08,
      headerName: 'Action',
      field: 'action',
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color='info' size='small' onClick={() => handleRowClick(row)}>
            <Icon icon='mdi:edit-outline' fontSize={20} />
          </IconButton>
          <IconButton
            onClick={e => {
              e.stopPropagation()
              setOpen(false)
              setRow(row)
              setOpenAlert(!alert)
            }}
            color='error'
          >
            <Icon icon='mdi:delete-outline' fontSize={20} />
          </IconButton>
        </Box>
      )
    }
  ]

  // const handleSearch = value => {
  //     setSearchValue(value)
  //     fetchTableData(sort, value, sortColumn)
  // }

  const handleSearch = value => {
    setSearchValue(value)
    const searchValue = value?.toLowerCase()
    const rows = store.expenses.filter(
      o =>
        o.expense?.toLowerCase().trim().includes(searchValue) ||
        o.description?.toLowerCase().trim().includes(searchValue) ||
        o.cost?.toString().toLowerCase().trim().includes(searchValue) ||
        o.date?.trim().includes(searchValue)
    )
    setFilteredRows(rows)
  }

  const handleRowClick = params => {
    const parsedDate = new Date(params.date)
    dispatch(setEditExpenses(true))
    setSelectedRow({
      ...params,
      date: parsedDate
    })
    setOpen(true)
    setDeleteAlertOpen(false)
  }

  const updateState = newReq => {
    let expense = [...store.expenses]
    let index = expense.findIndex(o => o.id == newReq.id)
    if (index !== -1) {
      expense.splice(index, 1)
    }
    dispatch(setExpenses(expense))
    setLoading(false)
  }

  const handleDelete = () => {
    // try {
    setOpenAlert(!alert)
    setLoading(true)

    dispatch(deleteExpense(row?.id))
      .then(unwrapResult)
      .then(res => {
        handleResponse('delete', res, updateState, row)
        setLoading(false)
      })
    // } catch (error) {
    //   toast.error(res.data)
    // }
  }

  // const handleRowSelection = data => {
  //   dispatch(setEditExpenses(true))
  //   setOpen(true)
  //   setRow(data)
  // }

  return (
    <>
      {isLoading && <BackdropSpinner />}
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <DataGrid
              autoHeight
              pagination
              rows={searchValue ? filteredRows : store.expenses || []}
              columns={columns}
              rowSelection={false}
              disableColumnMenu
              pageSizeOptions={[5, 10, 25, 50, 100]}
              localeText={{ noRowsLabel: NODATA.noData('Expense') }}
              isLoading={isLoading}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 25
                  }
                }
              }}
              sx={{
                '&:hover': {
                  cursor: 'pointer'
                }
              }}
              slots={{
                toolbar: () => {
                  return (
                    <Toolbar
                      label='expense'
                      searchValue={searchValue}
                      handleFilter={handleSearch}
                    />
                  )
                }
              }}
            />
          </Card>
        </Grid>
      </Grid>
      {isOpen && <DynamicNewExpenses isOpen={isOpen} setOpen={setOpen} rowData={selectedRow} />}
      <DynamicDeleteAlert
        open={alert}
        setOpen={setOpenAlert}
        title='Delete Request'
        action='Delete'
        handleAction={handleDelete}
      />
    </>
  )
}

export default Expenses
