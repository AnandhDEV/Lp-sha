import { Card, CardHeader, Grid } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { setGroupByValue, setPeriodRange } from 'src/store/apps/reports'
import { GroupBy } from 'src/views/apps/reports/GroupBy'
import GroupedTable from 'src/views/apps/reports/GroupBytable'
import ReportDetailsTable from 'src/views/apps/reports/ReportDetailsTable'

const TimeReports = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.reports)

  function isEmptyObject(obj) {
    return obj == null || obj == undefined || Object.keys(obj).length === 0;
  }

  return (
    <div>
      <DatePickerWrapper sx={{ mt: 5, mb: 5 }}>
        <Card xs={12}>
          <CardHeader title="Filter" />
          <Grid item className='d-flex'>
            <GroupBy />

          </Grid>
        </Card>
      </DatePickerWrapper>
      <Card xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {
              isEmptyObject(store.selectedRow) ? <GroupedTable /> : <ReportDetailsTable />
            }
          </Grid>
        </Grid>
      </Card>
    </div>
  )
}

export default TimeReports
