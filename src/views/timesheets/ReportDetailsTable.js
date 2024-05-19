import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useState } from "react";
import { Avatar, Button, CardHeader, Chip, Grid, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import ReportsTableHeader from "./ReportsTableHeader";
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from "src/@core/utils/get-initials";
import { setReportType } from "src/store/timesheets";

import { setUserReports, setProjectReports, setClientReports } from "src/store/apps/reports";

const ReportDetailsTable = (id) => {
  const store = useSelector(state => state.reports);
  const dispatch = useDispatch();
  const { reportType, dateRange, selectedName } = useSelector(state => state.timesheets)
  const [searchValue, setSearchValue] = useState('')
  const [filteredRows, setFilteredRows] = useState([])

  const [table, setTable] = useState({
    isLoading: false,
    tableData: [],
    errorMessage: "No Data found",
    isDisabled: true,
  });

  //FILTER
  const handleSearch = value => {
    setSearchValue(value)
    const searchValue = value?.toLowerCase()
    if (reportType === "project") {
      const rows = store.projectReports?.projectTimeSheet?.filter(
        o =>
          o.userName?.toLowerCase().trim().includes(searchValue) ||
          o.taskDescription?.toLowerCase().trim().includes(searchValue)
      )
      setFilteredRows(rows)
    } else if (reportType === "client") {
      const rows = store.clientReports?.clientTimeSheet?.filter(
        o =>
          o.userName?.toLowerCase().trim().includes(searchValue) ||
          o.taskDescription?.toLowerCase().trim().includes(searchValue) ||
          o.projectName?.toLowerCase().trim().includes(searchValue)
      )
      setFilteredRows(rows)
    } else {
      const rows = store.userReports?.userTimeSheet?.filter(
        o =>
          o.projectName?.toLowerCase().trim().includes(searchValue) ||
          o.taskDescription?.toLowerCase().trim().includes(searchValue)
      )
      setFilteredRows(rows)
    }

  }

  // COLUMNS

  //USER
  const REPORT_USER_COLUMN = [
    {
      field: "taskDescription",
      headerName: "Task",
      headerClassName: "reports-table-header",
      width: 200,

      align: "left",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "projectName",
      headerName: "Project",
      headerClassName: "reports-table-header",
      width: 200,

      align: "left",
      flex: 1,
    },
    {
      field: "isBillable",
      headerName: "Billable",
      headerClassName: "reports-table-header",
      width: 200,

      align: "left",
      flex: 1,
      renderCell: (params) => (
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
      ),
    },
    {
      field: "timeSheetDate",
      headerName: "Date",
      headerClassName: "reports-table-header",
      width: 200,

      align: "left",
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toISOString().split('T')[0];

        return <span>{formattedDate}</span>;
      },
    },
    {
      field: "burnedHours",
      headerName: "Burned Hours",
      headerClassName: "reports-table-header",
      width: 200,

      align: "left",
      flex: 1,
      renderCell: (params) => {
        const [hours, minutes] = params.value.split(":");
        const formattedTime = `${hours}:${minutes}`;

        return <span>{formattedTime}</span>;
      },
    },
  ];


  //CLIENT
  const REPORT_CLIENT_COLUMN = [
    {
      field: "taskDescription",
      headerName: "Task",
      headerClassName: "reports-table-header",
      width: 200,

      align: "left",
      flex: 0.6,
      minWidth: 100,
    },
    {
      field: "projectName",
      headerName: "Project",
      headerClassName: "reports-table-header",
      width: 100,
      align: "left",
      flex: 0.3,
    },
    {
      field: "userName",
      headerName: "User Name",
      headerClassName: "reports-table-header",
      width: 100,

      align: "left",
      flex: 0.5,

      // renderCell: (params) => (
      //   <div style={{ display: "flex", alignItems: "center" }}>
      //     {renderUsers(params.row)}
      //   </div>
      // ),
    },
    {
      field: "isBillable",
      headerName: "Billable",
      headerClassName: "reports-table-header",
      width: 200,

      align: "left",
      flex: 0.3,
      renderCell: (params) => (
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
      ),
    },
    {
      field: "timeSheetDate",
      headerName: "Date",
      headerClassName: "reports-table-header",
      width: 200,
      align: "left",
      flex: 0.4,
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toISOString().split('T')[0];

        return <span>{formattedDate}</span>;
      },
    },
    {
      field: "burnedHours",
      headerName: "Burned Hours",
      headerClassName: "reports-table-header",
      width: 200,
      align: "left",
      flex: 0.3,
      renderCell: (params) => {
        const [hours, minutes] = params.value.split(":");
        const formattedTime = `${hours}:${minutes}`;

        return <span>{formattedTime}</span>;
      },
    },
  ];


  //PROJECT
  const REPORT_PROJECT_COLUMN = [
    {
      field: "taskDescription",
      headerName: "Tasks",
      headerClassName: "reports-table-header",
      width: 300,

      align: "left",
      flex: 0.4,
      minWidth: 100,
    },
    {
      field: "userName",
      headerName: "User Name",
      headerClassName: "reports-table-header",
      width: 200,
      // renderCell: (params) => (
      //   <div style={{ display: "flex", alignItems: "center" }}>
      //     {/* {renderUsers(params.row)} */}
      //   </div>
      // ),

      align: "left",
      flex: 0.4,
    },
    {
      field: "isBillable",
      headerName: "Billable",
      headerClassName: "reports-table-header",
      width: 200,

      align: "left",
      flex: 0.2,
      renderCell: (params) => (
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
      ),
    },
    {
      field: "timeSheetDate",
      headerName: "Date",
      headerClassName: "reports-table-header",
      width: 200,
      align: "left",
      flex: 0.3,
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toISOString().split('T')[0];

        return <span>{formattedDate}</span>;
      },
    },
    {
      field: "burnedHours",
      headerName: "Burned Hours",
      headerClassName: "reports-table-header",
      width: 200,
      align: "left",
      flex: 0.3,
      renderCell: (params) => {
        const [hours, minutes] = params.value.split(":");
        const formattedTime = `${hours}:${minutes}`;

        return <span>{formattedTime}</span>;
      },
    },
  ];

  // const formatDate = (date) => {
  //   var d = new Date(date),
  //     month = '' + (d.getMonth() + 1),
  //     day = '' + d.getDate(),
  //     year = d.getFullYear();

  //   if (month.length < 2)
  //     month = '0' + month;
  //   if (day.length < 2)
  //     day = '0' + day;

  //   return [day, month, year].join('-');
  // }

  const renderUsers = row => {
    const stateNum = Math.floor(Math.random() * 6)
    const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
    const color = states[stateNum]
    const user = store.userReports?.find(o => o.id === row.userId)
    const fullName = `${user?.firstName} ${user?.lastName}`

    return (
      <Grid className="gap-1">
        <CustomAvatar skin='light' color={color} sx={{ mr: 1, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}>
          {getInitials(fullName ? fullName : 'Unkown User')}
        </CustomAvatar>
        <label>{fullName}</label>
      </Grid>
    )
  }

  const handleGoBack = () => {
    dispatch(setSelectedRowData({}));
    dispatch(setIsDisableDatePicker(true));
    switch (reportType?.toLowerCase()) {
      case "user":
        dispatch(setUserReports([]));
        break;
      case "client":
        dispatch(setClientReports([]));
        break;
      case "project":
        dispatch(setProjectReports([]));
        break;

      default:
        break;
    }
  };

  const rowClickHandler = (data) => {
    // dispatch(setUserReports(data))
  };

  // const exportToExcel = () => {
  //   try {
  //     const worksheet = XLSX.utils.json_to_sheet(
  //       reportType === "Project"
  //         ? projectReports
  //         : reportType === "Client"
  //           ? clientReports
  //           : userReports
  //     );
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
  //     XLSX.writeFile(workbook, "exported_data.xlsx");
  //     toastMessage("success", "Excel Exported");
  //   } catch (error) {
  //     toastMessage("error", error);
  //   }
  // };

  return (
    <div>
      <Grid className="report-table" sx={{ width: "100%" }}>

        <ReportsTableHeader searchValue={searchValue} handleFilter={handleSearch} id={id} />

        <DataGrid
          autoHeight
          pageSizeOptions={[5, 10, 50, 100]}
          disableRowSelectionOnClick
          isRowSelectable={true}
          hideFooterSelectedRowCount
          getCellClassName={() => "indented-cell"}
          onRowClick={rowClickHandler}
          rows={searchValue ? filteredRows :
            reportType === "project"
              ? store.projectReports?.projectTimeSheet?.length > 0 ? store.projectReports?.projectTimeSheet : []
              : reportType === "client"
                ? store.clientReports?.clientTimeSheet.length > 0 ? store.clientReports?.clientTimeSheet : []
                : store.userReports?.userTimeSheet.length > 0 ? store.userReports?.userTimeSheet : []
          }
          columns={
            reportType === "project"
              ? REPORT_PROJECT_COLUMN
              : reportType === "client"
                ? REPORT_CLIENT_COLUMN
                : REPORT_USER_COLUMN
          }
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          sx={{
            boxShadow: "rgb(90 114 123 / 11%) 0px 7px 30px 0px",
            border: "none",
            borderRadius: "10px",
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                {table.errorMessage}
              </Stack>
            ),
            NoResultsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                filter returns no result
              </Stack>
            ),
          }}
        />
      </Grid>
    </div >
  );
};

export default ReportDetailsTable;
