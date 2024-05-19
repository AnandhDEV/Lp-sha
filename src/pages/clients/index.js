// ** React Imports
import { useState, useEffect, useCallback } from 'react'

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
import { DataGrid } from '@mui/x-data-grid'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
// ** Utils Import

// ** Actions Imports
import { fetchData, deleteUser, deleteClient, fetchClients, setClients } from 'src/store/clients'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import ClientTableHeader from 'src/views/clients/list/ClientTableHeader'
import AddClientDrawer from 'src/views/clients/list/AddClientDrawer'
import { useRouter } from 'next/router'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { handleResponse } from 'src/helpers/helpers'
import dynamic from 'next/dynamic'
import { NODATA } from 'src/helpers/constants'
import { BackdropSpinner } from 'src/@core/components/spinner'

const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false
})

// ** Vars
const userRoleObj = {
  admin: { icon: 'mdi:laptop', color: 'error.main' },
  author: { icon: 'mdi:cog-outline', color: 'warning.main' },
  editor: { icon: 'mdi:pencil-outline', color: 'info.main' },
  maintainer: { icon: 'mdi:chart-donut', color: 'success.main' },
  subscriber: { icon: 'mdi:account-outline', color: 'primary.main' }
}

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

const ClientList = ({ apiData }) => {
  // ** State
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [alert, setAlert] = useState(false)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [editedRowData, setEditedRowData] = useState(null)
  const [filteredData, setFilteredData] = useState([])

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.clients)
  useEffect(() => {
    if (store.clients == null) {
      setLoading(true)
      dispatch(fetchClients()).then(res => {
        setLoading(false)
      })
    }
  }, [])

  const handleFilter = useCallback(
    value => {
      setValue(value)
      const data =
        store.clients?.map(o => ({
          ...o,
          companyName: o.companyName.toLowerCase(),
          primaryContatctName: o.primaryContatctName?.toLowerCase(),
          phoneNumber: o.phoneNumber?.toLowerCase(),
          email: o.email?.toLowerCase(),
          address: o.address?.toLowerCase(),
          taxId: o.taxId?.toLowerCase()
        })) || []
      const filteredRows = data
        ? data.filter(
            o =>
              o.companyName.trim().includes(value.toLowerCase()) ||
              o.primaryContatctName?.trim().includes(value.toLowerCase()) ||
              o.phoneNumber?.trim().includes(value.toLowerCase()) ||
              o.email?.trim().includes(value.toLowerCase()) ||
              o.address?.trim().includes(value.toLowerCase()) ||
              o.taxId?.trim().includes(value.toLowerCase())
          )
        : []
      const _data = data?.filter(o => filteredRows.some(f => f.id == o.id)) || []
      setFilteredData(_data)
    },
    [value]
  )

  const columns = [
    {
      flex: 0.2,
      field: 'companyName',
      headerName: 'Company Name',
      renderCell: ({ row }) => {
        const { companyName } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <LinkStyled href=''>{companyName}</LinkStyled>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.175,
      field: 'email',
      headerName: 'Email',
      wrap: true,
      renderCell: params => <div style={{ whiteSpace: 'pre-line' }}>{params.value}</div>
    },
    {
      flex: 0.16,
      field: 'primaryContatctName',
      headerName: 'Contact Name',
      renderCell: params => <div style={{ whiteSpace: 'pre-line' }}>{params.value}</div>
    },
    {
      flex: 0.17,
      field: 'phoneNumber',
      minWidth: 150,
      headerName: 'Phone'
    },
    {
      flex: 0.15,
      field: 'taxId',
      minWidth: 150,
      headerName: 'Tax Id'
    },
    {
      flex: 0.1,
      minWidth: 120,
      headerName: 'Active',
      field: 'isActive',
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
      flex: 0.1,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton color='info' size='small' onClick={handleEdit(params.row)}>
            <Icon icon='mdi:edit-outline' fontSize={20} />
          </IconButton>
          <IconButton
            color='error'
            size='small'
            onClick={() => {
              setAddUserOpen(false), setAlert(true), setEditedRowData(params.row)
            }}
          >
            <Icon icon='mdi:trash-outline' fontSize={20} />
          </IconButton>
        </Box>
      )
    }
  ]

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const openNewClient = () => {
    setEditedRowData(null)
    toggleAddUserDrawer()
  }

  const handleEdit = rowData => e => {
    setEditedRowData({
      id: rowData.id ?? '',
      companyName: rowData.companyName ?? '',
      profilePhoto: rowData.profilePhoto ?? '',
      profilePictureName: rowData.profilePictureName ?? '',
      primaryContatctName: rowData.primaryContatctName ?? '',
      address: rowData.address ?? '',
      email: rowData.email ?? '',
      phoneNumber: rowData.phoneNumber ?? '',
      companyId: rowData.companyId ?? '',
      taxId: rowData.taxId ?? '',
      isActive: rowData.isActive ?? '',
      isAssociateWithProject: rowData.isAssociateWithProject ?? ''
    })
    toggleAddUserDrawer() // Open the drawer
  }

  const removeClient = row => {
    const clients = [...store.clients]
    const index = clients.indexOf(row)
    if (index !== -1) {
      clients.splice(index, 1)
    }
    dispatch(setClients(clients))
    setLoading(false)
  }

  const handleDelete = () => {
    setLoading(true)
    setAlert(false)

    dispatch(deleteClient(editedRowData.id))
      .then(unwrapResult)
      .then(res => {
        handleResponse('delete', res, removeClient, editedRowData)
      })
      .catch(err => {
        setLoading(false)

        toast.error(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      {isLoading && <BackdropSpinner />}
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader />
            {/* <Divider /> */}
            <ClientTableHeader setOpen={openNewClient} value={value} handleFilter={handleFilter} />
            <DataGrid
              autoHeight
              rows={value ? filteredData : store.clients || []}
              columns={columns}
              disableRowSelectionOnClick
              disableColumnMenu
              sortingMode='client'
              pageSizeOptions={[5, 10, 25, 50, 100]}
              localeText={{ noRowsLabel: NODATA.noData('client') }}
              // loading={isLoading}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 25
                  }
                },
                sorting: {
                  sortModel: [{ field: 'companyName', sort: 'asc' }]
                }
              }}
            />
          </Card>
        </Grid>

        <AddClientDrawer
          open={addUserOpen}
          toggle={toggleAddUserDrawer}
          handleEdit={handleEdit}
          editedRowData={editedRowData}
          setEditedRowData={setEditedRowData}
        />
        <DynamicDeleteAlert
          open={alert}
          setOpen={setAlert}
          title='Delete Client'
          content='Are you confirm to delete client?'
          action='Delete'
          handleAction={handleDelete}
        />
      </Grid>
    </>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default ClientList
