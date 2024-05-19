import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useState } from "react";
import { Avatar, Button, CardHeader, Chip, Grid, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import ReportsTableHeader from "./ReportsTableHeader";
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from "src/@core/utils/get-initials";



const ReportDetailsTable = () => {
  const store = useSelector(state => state.reports);
  const dispatch = useDispatch();

  const [table, setTable] = useState({
    isLoading: false,
    tableData: [],
    errorMessage: "No Data found",
    isDisabled: true,
  });

  // COLUMNS

  //USER
  const REPORT_USER_COLUMN = [
    {
      field: "timesheetDescription",
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
      field: "date",
      headerName: "Date & Time",
      headerClassName: "reports-table-header",
      width: 200,

      align: "left",
      flex: 1,
      renderCell: (params) => {
        return formatDate(params.value)
      },
    },
    {
      field: "burnHours",
      headerName: "Burned Hours",
      headerClassName: "reports-table-header",
      width: 200,

      align: "left",
      flex: 1,
    },
  ];


  //CLIENT
  const REPORT_CLIENT_COLUMN = [
    {
      field: "timesheetDescription",
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
      headerName: "User",
      headerClassName: "reports-table-header",
      width: 100,

      align: "left",
      flex: 0.5,

      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {renderUsers(params.row)}
        </div>
      ),
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
      field: "date",
      headerName: "Date & Time",
      headerClassName: "reports-table-header",
      width: 200,
      renderCell: (params) => {
        return formatDate(params.value)
      },

      align: "left",
      flex: 0.4,
    },
    {
      field: "burnHours",
      headerName: "Burned Hours",
      headerClassName: "reports-table-header",
      width: 200,

      align: "left",
      flex: 0.3,
    },
  ];


  //PROJECT
  const REPORT_PROJECT_COLUMN = [
    {
      field: "timesheetDescription",
      headerName: "Tasks",
      headerClassName: "reports-table-header",
      width: 300,

      align: "left",
      flex: 0.4,
      minWidth: 100,
    },
    {
      field: "userId",
      headerName: "User",
      headerClassName: "reports-table-header",
      width: 200,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {renderUsers(params.row)}
        </div>
      ),

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
      field: "date",
      headerName: "Date & Time",
      headerClassName: "reports-table-header",
      width: 200,
      renderCell: (params) => {
        return formatDate(params.value)
      },

      align: "left",
      flex: 0.3,
    },
    {
      field: "burnHours",
      headerName: "Burned Hours",
      headerClassName: "reports-table-header",
      width: 200,

      align: "left",
      flex: 0.3,
    },
  ];

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [day, month, year].join('-');
  }

  const renderUsers = row => {
    const stateNum = Math.floor(Math.random() * 6)
    const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
    const color = states[stateNum]
    const user = store.allUsers?.find(o => o.id === row.userId)
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
    switch (store.groupByValue?.toLowerCase()) {
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

  };

  // const exportToExcel = () => {
  //   try {
  //     const worksheet = XLSX.utils.json_to_sheet(
  //       store.groupByValue === "Project"
  //         ? projectReports
  //         : store.groupByValue === "Client"
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
        <ReportsTableHeader />
        <DataGrid
          autoHeight
          pageSizeOptions={[5, 10, 50, 100]}
          disableRowSelectionOnClick
          isRowSelectable={false}
          hideFooterSelectedRowCount
          getCellClassName={() => "indented-cell"}
          onRowClick={rowClickHandler}
          rows={
            store.groupByValue === "Project"
              ? store.projectReports
              : store.groupByValue === "Client"
                ? store.clientReports
                : store.userReports
          }
          columns={
            store.groupByValue === "Project"
              ? REPORT_PROJECT_COLUMN
              : store.groupByValue === "Client"
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
