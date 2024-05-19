// ** React Imports
import { useState, useEffect, useMemo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

// ** Third Party Imports
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectsByUser } from 'src/store/apps/projects'
import { unwrapResult } from '@reduxjs/toolkit'
import { NODATA } from 'src/helpers/constants'

const Img = styled('img')(({ theme }) => ({
  width: 34,
  height: 34,
  borderRadius: '50%',
  marginRight: theme.spacing(3)
}))

const columns = [
  {
    flex: 1,
    field: 'projectName',
    headerName: 'Project',
    renderCell: ({ row }) => (
      // <Box sx={{ display: 'flex', alignItems: 'center' }}>
      // <Img src={row.img} alt={`project-${row.projectTitle}`} />
      // <Box sx={{ display: 'flex', flexDirection: 'column' }}>

      <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
        {row.projectName}
      </Typography>

      // <Typography variant='caption'>{row.projectType}</Typography>
      // </Box>
      // </Box>
    )
  }
]

const InvoiceListTable = ({ currentUser }) => {
  // ** State
  const [value, setValue] = useState('')
  const [data, setData] = useState(null)
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)

  useEffect(() => {
    if (store.userProjects == null || store.userProjects?.length == 0) {
      dispatch(fetchProjectsByUser(currentUser.id))
        .then(unwrapResult)
        .then(res => {
          setData(res.result)
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      setData(store.userProjects)
    }
  }, [])


  const filteredData = useMemo(() => {
    let filtered = data

    if (value) {
      filtered = filtered.filter(
        item => item.projectName && item.projectName.toLowerCase().includes(value.toLowerCase())
      )
    }

    return filtered
  }, [data, value])

  return (
    <Card>
      <CardHeader title='Projects List' />
      <DataGrid
        autoHeight
        rows={data ? data : []}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25, 50]}
        getRowId={row => row.projectId}
        disableColumnMenu
        loading={store.userProjects == null}
        localeText={{ noRowsLabel: NODATA.noData('project') }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25
            }
          },
          sorting: {
            sortModel: [{ field: 'projectName', sort: 'asc' }],
          },
        }}

      />
    </Card>
  )
}

export default InvoiceListTable
