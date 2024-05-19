// ** React Imports
import { useEffect, useState, useCallback, useMemo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

// ** ThirdParty Components
import axios from 'axios'
import currencySymbols from 'src/views/projects/reports/chart/currencySymbols'


// ** Utils Import
import { AvatarGroup, Button, Grid, IconButton, Popover, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getProjectDetails, setSelectedProject } from 'src/store/apps/projects'
import { unwrapResult } from '@reduxjs/toolkit'
import ReportsHeader from './ReportsHeader'
import { fetchName, setName, setSelectedName } from 'src/store/timesheets'
import { formatLocalDate } from 'src/helpers/dateFormats'
import { NODATA } from 'src/helpers/constants'
import ReportDetailsTable from './ReportDetailsTable'
import { fetchClientReports, fetchProjectReports, setClientReports, setProjectReports, setSelectedRowData, setUserReports } from 'src/store/apps/reports'
import { setReportType } from 'src/store/timesheets'
import { fetchUserReports } from 'src/store/apps/reports'
import { BackdropSpinner } from 'src/@core/components/spinner'
import dayjs from 'dayjs'

const Report = () => {
    // ** States
    const [total, setTotal] = useState(0)
    const [sort, setSort] = useState('asc')
    const [isLoading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [sortColumn, setSortColumn] = useState('name')
    const { timesheetreports, reportType, dateRange } = useSelector(state => state.timesheets)
    const store = useSelector(state => state.reports)

    const dispatch = useDispatch();

    const columns = useMemo(() => {
        let headerName = '';
        switch (reportType) {
            case 'client':
                headerName = 'Client';
                break;
            case 'user':
                headerName = 'User';
                break;
            case 'project':
                headerName = 'Project'
        }

        const getCurrencySymbol = (currencyCode) => {
            return currencySymbols[currencyCode] || currencyCode
        }

        return [
            {
                flex: 0.5,
                minWidth: 230,
                field: 'name',
                headerName: headerName,
                renderCell: params => <div style={{ fontWeight: 'bold' }}>{params.value}</div>
            },
            {
                flex: 0.2,
                field: 'totalHours',
                headerName: 'Total Hours',
                renderCell: (params) => {
                    const totalHours = parseFloat(params.value);
                    const formattedTotalHours = Number.isInteger(totalHours) ? totalHours.toString() : totalHours.toFixed(2);

                    return <span>{formattedTotalHours}</span>;
                },
            },
            {
                flex: 0.15,
                field: 'totalCost',
                headerName: 'Amount',
                align: "right",
                headerAlign: 'right',
                renderCell: (params) => {
                    const currencyCode = params.row.currency;
                    const currencySymbol = getCurrencySymbol(currencyCode);
                    const totalCost = parseFloat(params.value);
                    const formattedTotalCost = Number.isInteger(totalCost) ? totalCost.toString() : totalCost.toFixed(2);

                    return (
                        <span sx={{ textAlign: 'right', display: 'block' }}>
                            {currencySymbol} {formattedTotalCost}
                        </span>
                    );
                },
            },
            {
                flex: 0.05,

            }

        ]
    }, [reportType]);


    const handleRowClick = (params) => {
        if (reportType === 'user') {
            setLoading(true)
            dispatch(fetchUserReports({ id: params.row.id, startDate: dayjs(dateRange.fromDate).format("MM-DD-YYYY"), endDate: dayjs(dateRange.toDate).format("MM-DD-YYYY") })).then(response => {
                dispatch(setUserReports(response.payload))
                dispatch(setSelectedRowData(params.row));
                dispatch(setSelectedName(response.payload?.userName))
                setLoading(false)
            })
        } else if (reportType === 'project') {
            setLoading(true)
            dispatch(fetchProjectReports({ id: params.row.id, startDate: dayjs(dateRange.fromDate).format("MM-DD-YYYY"), endDate: dayjs(dateRange.toDate).format("MM-DD-YYYY") })).then(response => {
                dispatch(setProjectReports(response.payload))
                dispatch(setSelectedRowData(params.row));
                dispatch(setSelectedName(response.payload?.projectName))
                setLoading(false)
            })
        } else {
            setLoading(true)
            dispatch(fetchClientReports({ id: params.row.id, startDate: dayjs(dateRange.fromDate).format("MM-DD-YYYY"), endDate: dayjs(dateRange.toDate).format("MM-DD-YYYY") }))
                .then(response => {
                    dispatch(setClientReports(response.payload))
                    dispatch(setSelectedRowData(params.row));
                    dispatch(setSelectedName(response.payload.clientName))

                    setLoading(false)
                })
        }
    }

    return (
        <>
            <Card>
                {isLoading && <BackdropSpinner />}
                <ReportsHeader
                    // getData={getReports}
                    // user={report.user}
                    // fromDate={new Date(report.start)}
                    // toDate={new Date(report.end)}
                    setReportType={setReportType}

                />
                <DataGrid
                    autoHeight
                    pagination
                    getRowId={(item) => item.id}
                    rows={timesheetreports || []}
                    columns={columns}
                    rowSelection={true}
                    hideFooterSelectedRowCount
                    getCellClassName={() => "indented-cell"}

                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    className='no-border'
                    localeText={{ noRowsLabel: NODATA.noData('report') }}
                    disableColumnMenu
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 25
                            }
                        },
                        sorting: {
                            sortModel: [{ field: 'name', sort: 'asc' }],
                          },
                        
                    }}
                    sx={{
                        boxShadow: "rgb(90 114 123 / 11%) 0px 7px 30px 0px",
                        border: "none",
                        borderRadius: "10px",
                        borderColor: "primary.light",
                        "& .MuiDataGrid-cell:hover": {
                            color: "primary.main",
                            cursor: 'pointer'
                        },
                    }}
                    onRowClick={handleRowClick}
                />
            </Card>
        </>
    )
}

export default Report
