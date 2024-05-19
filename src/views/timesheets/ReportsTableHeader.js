// ** MUI Imports
import { Grid, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useDispatch, useSelector } from 'react-redux'
import CustomBackButton from 'src/@core/components/back-button'
import { GridToolbarExport } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { setClientReports, setProjectReports, setSelectedRowData, setUserReports } from 'src/store/apps/reports'
import { fetchTimesheetExport, setReportType } from 'src/store/timesheets'
import Toolbar from './toolbar'
import { useEffect, useState } from 'react'

const ReportsTableHeader = props => {
  // ** Props
  const { handleFilter, toggle, value, isExport, searchValue, id } = props
  const store = useSelector(state => state.reports)
  const { reportType, dateRange, selectedName } = useSelector(state => state.timesheets)
  const idValue = id.id;
  const dispatch = useDispatch();

  const handleExport = () => {
    dispatch(fetchTimesheetExport(idValue)).then(res => {
      const base64String = res.payload?.base64String;

      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TimeSheet Report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };


  const handleGoBack = () => {
    dispatch(setSelectedRowData(null));
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


  return (
    <>
      {/* <Typography variant='h6' fontWeight='bold' sx={{ marginRight: 10 }} color='gray'>
        {selectedName}
      </Typography> */}
      <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 0 }}>

        <Grid className='gap-1'>
          <CustomBackButton sx={{ mb: 2, }} title={selectedName} onClickBack={handleGoBack} />
        </Grid>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            sx={{ mr: 4, mb: 2 }}
            color='secondary'
            variant='outlined'
            // onClick={handleExport}
            startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
          >Export
          </Button>

          <Box
            sx={{
              gap: 2,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: isExport ? 'space-between' : 'flex-end',
              p: theme => theme.spacing(4)
            }}
          >
            {isExport && (
              <GridToolbarExport
                color='secondary'
                size='normal'
                printOptions={{ disableToolbarButton: true }}
              />
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size='small'
                sx={{ mr: 4 }}
                placeholder='Search '
                value={searchValue}
                autoFocus
                onChange={e => handleFilter(e.target.value)}
              />
            </Box>
          </Box>

        </Box>
      </Box >
    </>
  )
}

export default ReportsTableHeader
