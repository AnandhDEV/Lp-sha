// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'

// ** Utils Import
import { IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import FallbackSpinner, { BackdropSpinner } from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import Toolbar from 'src/views/absence-management/toolBar'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import axios from 'axios'
import { deleteDepartment, setDepartment, setEditDepartment } from 'src/store/settings'
import { NODATA } from 'src/helpers/constants'
import { handleResponse } from 'src/helpers/helpers'
import { setProjectMembers } from 'src/store/apps/projects'
import { useMemo } from 'react'
import { fetchDepartment } from 'src/store/apps/projects'
import NewDepartment from './NewDepartment'

const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false
})

const DepartmentConfig = ({ data }) => {
  const { departments } = useSelector(state => state.projects)
  const store = useSelector(state => state.settings)

  // ** States
  const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [rowData, setRowData] = useState({})
  const [alert, setOpenAlert] = useState(false)
  const dispatch = useDispatch()
  const [selectedRow, setSelectedRow] = useState(null)
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchDepartment())
      .then(unwrapResult)
      .then(res => dispatch(setDepartment(res.result)))
  }, [])

  let filteredRow = useMemo(
    () =>
      store.department?.filter(l => l.name.toLowerCase().includes(searchValue.toLowerCase())) || [],
    [store.department, searchValue]
  )

  const columns = [
    {
      flex: 0.6,
      field: 'name',
      headerName: 'Department',
      renderCell: params => <div style={{ fontWeight: 'bold' }}>{params.value}</div>
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

  //delete
  const updateState = newReq => {
    setLoading(false)
  }

  const handleDelete = () => {
    setLoading(true)
    setOpenAlert(false)
    dispatch(deleteDepartment(rowData?.id))
      .then(unwrapResult)
      .then(res => {
        handleResponse('delete', res.res, updateState, rowData)
        setLoading(false)
        //  else {
        //   toast.error('Cannot delete the department. It is being used.')
        // }
      }).catch(error => {
        toast.error('Error occurred while deleting the department.')
        setLoading(false)
      })
  }


  const handleSearch = value => {
    setSearchValue(value)
  }

  const handleRowSelection = data => {
    dispatch(setEditDepartment(true))

    setOpen(true)
    setRowData(data)
  }

  return (
    <>
      {isLoading && <BackdropSpinner />}
      {isOpen && <NewDepartment isOpen={isOpen} setOpen={setOpen} rowData={rowData} />}
      <DynamicDeleteAlert
        open={alert}
        setOpen={setOpenAlert}
        title='Delete Department'
        action='Delete'
        handleAction={handleDelete}
      />

      <Card>
        <DataGrid
          autoHeight
          pagination
          rows={filteredRow}
          columns={columns}
          rowSelection={false}
          // onCellClick={data => data.field != 'action' && handleRowSelection(data)}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          className='no-border'
          disableColumnMenu={true}
          localeText={{ noRowsLabel: NODATA.noData('Department') }}
          slots={{
            toolbar: () => {
              return (
                <Toolbar
                  searchValue={searchValue}
                  handleFilter={handleSearch}
                  label='Department'
                />
              )
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
    </>
  )
}

export default DepartmentConfig
