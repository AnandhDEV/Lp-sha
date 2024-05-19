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
import {
  deleteProjectStatus,
  fetchProjectStatus,
  setEditProjectStatus,
  setProjectStatus
} from 'src/store/settings'
import { NODATA } from 'src/helpers/constants'
import NewProjectStatus from './NewProjectStatus'
import { handleResponse } from 'src/helpers/helpers'
import { setProjectMembers } from 'src/store/apps/projects'
import { useMemo } from 'react'

const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false
})

const ProjectStatus = ({ data }) => {
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
    if (store.ProjectStatus == null) {
      dispatch(fetchProjectStatus())
    }
  }, [])

  let filteredRow = useMemo(
    () =>
      store.ProjectStatus?.filter(l =>
        l.taskStatusName.toLowerCase().includes(searchValue.toLowerCase())
      ) || [],
    [store.ProjectStatus, searchValue]
  )

  const columns = [
    {
      flex: 0.6,
      field: 'taskStatusName',
      headerName: 'Status',
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
    dispatch(deleteProjectStatus(rowData?.id))
      .then(unwrapResult)
      .then(res => {
        if (res.res.responseCode === 200) {
          handleResponse('delete', res.res, updateState, rowData)
          setLoading(false)
        } else {
          toast.error('Cannot delete the project status. It is being used.')
        }
      })
      .catch(error => {
        toast.error('Cannot delete the project status. It is being used.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleSearch = value => {
    setSearchValue(value)
  }

  const handleRowSelection = data => {
    dispatch(setEditProjectStatus(true))
    setSelectedRow({
      ...data.row
    })
    setOpen(true)
    setRowData(data)
  }

  return (
    <>
      {isLoading && <BackdropSpinner />}
      {isOpen && <NewProjectStatus isOpen={isOpen} setOpen={setOpen} rowData={rowData} />}
      <DynamicDeleteAlert
        open={alert}
        setOpen={setOpenAlert}
        title='Delete Status'
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
          pageSizeOptions={[5, 10, 25, 50, 100]}
          className='no-border'
          disableColumnMenu={true}
          localeText={{ noRowsLabel: NODATA.noData('Task Status') }}
          slots={{
            toolbar: () => {
              return (
                <Toolbar
                  searchValue={searchValue}
                  handleFilter={handleSearch}
                  label='Task Status'
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

export default ProjectStatus
