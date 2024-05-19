import { Grid, Typography, Card } from '@mui/material'
import React, { memo, useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectsReport } from 'src/store/apps/projects'
import { useRouter } from 'next/router'
// import { fetchBurnedCost } from 'src/store/apps/reports'
// import { fetchTaskProgress } from 'src/store/apps/reports'

import { unwrapResult } from '@reduxjs/toolkit'
import FallbackSpinner, { BackdropSpinner } from 'src/@core/components/spinner'
import toast from 'react-hot-toast'
import { NODATA } from 'src/helpers/constants'
import CustomBackButton from 'src/@core/components/back-button'
import NewDepartment from 'src/views/configuration/department/NewDepartment'

import Toolbar from './ToolBar'
import { TaskPerformance, setTaskPerformance } from 'src/store/timesheets'
import { DataGrid } from '@mui/x-data-grid'
import ReportsTableHeader from 'src/views/timesheets/ReportsTableHeader'

const TimeSheetExport = ({ id, tab }) => {
    const dispatch = useDispatch()
    const [loader, setLoader] = useState(false)
    const store = useSelector(state => state.timesheets)
    const router = useRouter()

    const [isLoading, setLoading] = useState(false)
    const [isOpen, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [rowData, setRowData] = useState({})
    const [alert, setOpenAlert] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)
    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false)


    useEffect(() => {
        dispatch(TaskPerformance(id))
    }, [])

    const columns = [
        {
            flex: 0.6,
            field: 'taskName',
            headerName: 'Task',
            renderCell: params => <div style={{ fontWeight: 'bold' }}>{params.value}</div>
        },
        {
            flex: 0.6,
            field: 'taskAssignedUserName',
            headerName: 'Assigned User',
            renderCell: params => <div style={{ fontWeight: 'bold' }}>{params.value}</div>
        },
        {
            flex: 0.6,
            field: 'estimatedTime',
            headerName: 'Estimated Time',
            renderCell: params => <div style={{ fontWeight: 'bold' }}>{params.value}</div>
        },
        {
            flex: 0.6,
            field: 'actualTime',
            headerName: 'Actual Time',
            renderCell: params => <div style={{ fontWeight: 'bold' }}>{params.value}</div>
        },
        {
            flex: 0.6,
            field: 'deviation',
            headerName: 'Deviation',
            renderCell: params => <div style={{ fontWeight: 'bold' }}>{params.value}</div>
        }
    ]

    const t_Performance = store.taskPerformance ?? [];

    let filteredRow = useMemo(() => {
        if (t_Performance.length > 0) {
            return t_Performance.filter(
                l =>
                    l.taskName?.toLowerCase().includes(searchValue.toLowerCase()) ||
                    l.taskAssignedUserName?.toLowerCase().includes(searchValue.toLowerCase())
            );
        } else {
            return [];
        }
    }, [t_Performance, searchValue]);



    const handleSearch = value => {
        setSearchValue(value)
    }

    const handleBack = () => {
        router.push({ pathname: `/projects/details/task/${id}` })
    }


    return (
        <>
            <Grid container spacing={6}>
                <Typography variant="h4" gutterBottom style={{ fontSize: '24px', color: '#8A2BE2' }}>
                    <CustomBackButton title={store.taskPerformance[0] && store.taskPerformance[0].projectName} onClickBack={handleBack} />
                </Typography>
            </Grid>

            <Card>
                <DataGrid
                    autoHeight
                    pagination
                    rows={
                        (searchValue ? filteredRow :
                            store.taskPerformance) || []}
                    columns={columns}
                    rowSelection={false}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    className='no-border'
                    // disableColumnMenu={true}
                    localeText={{ noRowsLabel: NODATA.noData('Task Performance') }}
                    slots={{
                        toolbar: () => {
                            return (
                                <Toolbar searchValue={searchValue} handleFilter={handleSearch} id={id} />
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

export default TimeSheetExport