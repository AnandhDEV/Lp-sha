import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import React, { useState } from 'react'
import { Card, Grid } from '@mui/material'
import Stack from '@mui/material/Stack'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setReportClients,
  setReportProjects,
  setReportUsers,
  setSelectedRowData,
  setUserReports,
  setProjectReports,
  setClientReports,
  setSelectedClient,
  setSelectedUser,
  setSelectedProject,
  fetchUserData,
  fetchUserReports,
  fetchClient,
  fetchProject,
  setGroupByValue,
  fetchClientReports,
  fetchProjectReports
} from 'src/store/apps/reports/index'
import { endpoints } from 'src/store/endpoints/endpoints'
import { unwrapResult } from '@reduxjs/toolkit'
import { setReportType } from 'src/store/timesheets'

export const GroupedTable = () => {
  const store = useSelector(state => state.reports)
  const { reportType } = useSelector(state => state.timesheets)
  const dispatch = useDispatch()

  const [table, setTable] = useState({
    isLoading: false,
    tableData: [],
    errorMessage: 'No users found'
  })

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchUserData())
        .then(unwrapResult)
        .then(() => {
          tableRowHandler()
        })
    }
    fetchData().catch(e => e)
  }, [dispatch, reportType])

  // COLUMNS

  //USER
  const REPORT_USER_COLUMN = [
    {
      field: 'fullName',
      headerName: 'Users',
      headerClassName: 'reports-table-header',
      width: 200,
      editable: false,
      align: 'left',
      flex: 0.3,
      minWidth: 100
    },

    // {
    //   field: "employeeMailId",
    //   headerName: "Email Address",
    //   headerClassName: "reports-table-header",
    //   width: 200,
    //   editable: false,
    //   align: "left",
    //   flex: 0.6,
    // },
    {
      field: 'totalBurnedHours',
      headerName: 'Burned Hours',
      headerClassName: 'reports-table-header',
      width: 200,
      editable: false,
      align: 'left',
      flex: 0.3
    }
  ]

  //CLIENT
  const REPORT_CLIENT_COLUMN = [
    {
      field: 'clientName',
      headerName: 'Clients',
      headerClassName: 'reports-table-header',
      width: 300,
      editable: false,
      align: 'left',
      flex: 0.3,
      minWidth: 100
    },
    {
      field: 'totalBurnedHours',
      headerName: 'Total Burned Hours',
      headerClassName: 'reports-table-header',
      width: 200,
      editable: false,
      align: 'left',
      flex: 0.3
    }
  ]

  //PROJECT
  const REPORT_PROJECT_COLUMN = [
    {
      field: 'name',
      headerName: 'Projects',
      headerClassName: 'reports-table-header',
      width: 300,
      editable: false,
      align: 'left',
      flex: 0.3,
      minWidth: 100
    },
    {
      field: 'totalBurnedHours',
      headerName: 'Burned Hours',
      headerClassName: 'reports-table-header',
      width: 200,
      editable: false,
      align: 'left',
      flex: 0.3
    }
  ]

  //SET TABLE DATA
  const tableRowHandler = async (data) => {
    switch (reportType.toLowerCase()) {
      case 'user':
        dispatch(fetchUserReports(data))
        break
      case 'client':
        dispatch(fetchClientReports(store.dateRanges))
        break
      case 'project':
        dispatch(fetchProjectReports(store.dateRanges))
        break

      default:
        dispatch(fetchUserReports())
        dispatch(setReportType('User'))
        break
    }
  }

  //STRUCTERING CLIENTS
  const customizeAndMapClients = async (row, _clients) => {
    const clientReports = []
    await _clients
      .filter(o => o.clientUId === row?.clientUId)
      .forEach((client, i) => {
        client.project.forEach((p, j) => {
          p.tasks
            .flatMap(t => t.timeSheet)
            .forEach((ts, k) => {
              clientReports.push({
                ...ts,
                projectName: p.projectName,
                isBillable: ts.isBillable,
                date: ts.timesheetentryDate,
                id: k,
                key: k
              })
            })
        })
      })

    return clientReports
  }

  //STRUCTERING USERS
  const customizeAndMapUsers = async (row, _users) => {
    const userReports = []
    var index = 0
    await _users
      .filter(o => o.employeeId === row?.employeeId)
      .forEach((user, i) => {
        user.projects.forEach((p, j) => {
          p.tasks
            .flatMap(o => o.timesheets)
            .forEach(ts => {
              userReports.push({
                ...ts,
                projectName: p.name,
                isBillable: ts.isBillable,
                date: ts.timesheetentryDate, //dummy
                id: index,
                key: index
              })
              index += 1
            })
        })
      })

    return userReports
  }

  //STRUCTERING PROJECTS
  const customizeAndMapProjects = async (row, _projects) => {
    const projectReports = []
    await _projects
      .flatMap(o => o.tasks)
      .flatMap(t => t.timesheet)
      .forEach((ts, j) => {
        projectReports.push({
          ...ts,
          isBillable: ts.isBillable,
          date: ts.timesheetEntryDate,
          id: j,
          key: j
        })
      })

    return projectReports
  }

  //SELECT ROW
  const rowClickHandler = async data => {
    dispatch(setSelectedRowData(data && data.row))

    switch (store.groupByValue.toLowerCase()) {
      case 'user':
        dispatch(fetchUserReports(data))

        break
      case 'project':
        dispatch(setSelectedProject(data.row?.name))
        const projectReports = await customizeAndMapProjects(data.row, store.projects)
        projectReports != null && dispatch(setProjectReports(projectReports))
        break
      case 'client':
        dispatch(setSelectedClient(data.row?.name))
        const clientReports = await customizeAndMapClients(data.row, store.clients)
        clientReports != null && dispatch(setClientReports(clientReports))
        break
      default:
        break
    }
  }

  return (
    <Card className='flex-nowrap'>
      <Grid xs={12}>
        {/* <h4 className="report-title">{store.groupByValue.concat("s")}</h4> */}
        <DataGrid
          autoHeight
          pageSizeOptions={[5, 25, 50, 100]}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          getCellClassName={() => 'indented-cell'}
          onRowClick={rowClickHandler}
          rows={
            store.groupByValue === 'Project'
              ? store.projects
              : store.groupByValue === 'Client'
                ? store.clients
                : store.users
          }
          columns={
            store.groupByValue === 'Project'
              ? REPORT_PROJECT_COLUMN
              : store.groupByValue === 'Client'
                ? REPORT_CLIENT_COLUMN
                : REPORT_USER_COLUMN
          }
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5
              }
            }
          }}
          components={{
            NoRowsOverlay: () => (
              <Stack height='100%' alignItems='center' justifyContent='center'>
                {store.groupByValue === 'Project'
                  ? store.projects.length === 0
                  : store.groupByValue === 'Client'
                    ? store.clients.length === 0
                    : store.users.length === 0 && table.errorMessage}
              </Stack>
            ),
            NoResultsOverlay: () => (
              <Stack height='100%' alignItems='center' justifyContent='center'>
                filter returns no result
              </Stack>
            )
          }}
        />
      </Grid>
    </Card>
  )
}

export default GroupedTable
