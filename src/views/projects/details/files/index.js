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
import { AvatarGroup, Button, Grid, IconButton, Popover, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProjects,
  fetchUsers,
  fetchClients,
  setProject,
  deleteProject,
  getProjectDetails,
  setSelectedProject,
  fetchProjectFiles,
  deleteFile,
  setProjectFiles
} from 'src/store/apps/projects'
import { Icon } from '@iconify/react'
import FallbackSpinner, { BackdropSpinner } from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import LeaveHeader from 'src/views/absence-management/LeaveHeader'
import Toolbar from 'src/views/absence-management/toolBar'
import { date } from 'yup'
import { formatLocalDate } from 'src/helpers/dateFormats'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { handleResponse } from 'src/helpers/helpers'
import { NODATA } from 'src/helpers/constants'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'

const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false
})

const Files = ({ id }) => {
  // ** States
  const [isLoading, setLoading] = useState(false)
  const [alert, setOpenAlert] = useState(false)
  const [rowData, setRowData] = useState(null)
  const [filteredRow, setFilteredRow] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)

  useEffect(() => {
    store.files == null && dispatch(fetchProjectFiles(id))
  }, [id])

  const columns = [
    {
      flex: 0.3,
      headerName: 'Name',
      field: 'fileName'
    },
    {
      flex: 0.3,
      field: 'uploadedByName',
      headerName: 'User',
      renderCell: ({ row, value }) => {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center'
            }}
          >
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
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      field: 'createdDate',
      headerName: 'Date',
      renderCell: params => formatLocalDate(new Date(params.value))
    },
    {
      flex: 0.14,
      headerName: 'Download',
      field: 'download',
      type: 'action',
      sortable: false,
      renderCell: params => {
        return (
          <IconButton
            color='info'
            onClick={() => {
              if (params.row.filePath && params.row.fileName) {
                customSuccessToast('File downloaded')
              } else {
                customErrorToast('File type not supported')
              }
            }}
            href={params.row.filePath}
            download={params.row.fileName}
          >
            <Icon icon='mdi:download' />
          </IconButton>
        )
      }
    },
    {
      flex: 0.1,
      headerName: 'Action',
      field: 'action',
      type: 'action',
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color='error'
            onClick={() => {
              setOpenAlert(!alert), setRowData(row)
            }}
          >
            <Icon icon='mdi:delete-outline' fontSize={20} />
          </IconButton>
        </Box>
      )
    }
  ]

  const handleSearch = value => {
    setSearchValue(value)
    const _files = [...store?.files]
    const searchValue = value?.toLowerCase()
    const rows = _files.filter(
      o =>
        o.filePath?.toLowerCase().trim().includes(searchValue) ||
        o.fileName?.toLowerCase().trim().includes(searchValue) ||
        o.uploadedByName?.toString().toLowerCase().trim().includes(searchValue) ||
        o.createdDate?.trim().includes(searchValue)
    )
    setFilteredRow(rows)
  }

  const handleDelete = () => {
    setOpenAlert(false)
    setLoading(true)
    const { id } = rowData
    dispatch(deleteFile(id))
      .then(unwrapResult)
      .then(res => {
        handleResponse('delete', res, removeFileFromTable, rowData)
      })
  }

  const removeFileFromTable = row => {
    let _files = [...store.files]
    const index = _files.indexOf(row)
    index != -1 && _files.splice(index, 1)
    dispatch(setProjectFiles(_files))
    setLoading(false)
  }

  return (
    <>
      {isLoading && <BackdropSpinner />}
      <Card>
        <DataGrid
          autoHeight
          pagination
          rows={searchValue ? filteredRow : store.files || []}
          columns={columns}
          sortingMode='client'
          rowSelection={false}
          disableColumnMenu={true}
          localeText={{ noRowsLabel: NODATA.noData('file') }}
          // loading={isLoading}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          className='no-border'
          slots={{
            toolbar: () => {
              return (
                <Toolbar
                  label='files'
                  searchValue={searchValue}
                  handleFilter={handleSearch}
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
      <DynamicDeleteAlert
        open={alert}
        setOpen={setOpenAlert}
        title='Delete File'
        action='Delete'
        handleAction={handleDelete}
      />
    </>
  )
}

export default Files
