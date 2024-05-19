import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  TextField,
  useMediaQuery
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import SimpleBackdrop, { BackdropSpinner } from 'src/@core/components/spinner'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { fetchUsers } from 'src/store/apps/user'
import { setLoading } from 'src/store/authentication/register'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { fetchName, setDateRange, setReportType } from 'src/store/timesheets'
import dayjs from 'dayjs'

const ReportsHeader = ({ fromDate, toDate, getData }) => {


  const { reportType, dateRange } = useSelector(state => state.timesheets)

  var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  let firstDay = new Date(y, m, 1);
  let lastDay = new Date(y, m + 1, 0);

  const [report, setReport] = useState({
    type: "project",
    value: null,
    start: firstDay,
    end: lastDay,
    isExportDisabled: true
  })


  useEffect(() => {
    if (dateRange) {
      setReport({ ...report, start: dateRange.fromDate, end: dateRange.toDate })
    }

  }, [dateRange])




  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const _user = useSelector(state => state.user)
  const Projects = useSelector(state => state.Projects)
  const Clients = useSelector(state => state.Clients)

  const handleOnChange = (newValue) => {
    handleOnChangetest(newValue);
  }

  const handleOnChangetest = (newValue) => {
    dispatch(fetchName({
      type: newValue.type, startDate: dayjs(report.start).format("MM-DD-YYYY") || null,
      endDate: dayjs(report.end).format("MM-DD-YYYY") || null
    }))
      .then(() => { setLoading(false) })
    setReport(prev => ({ ...prev, type: newValue.type }))
    setReport(prev => ({ ...prev, value: newValue }))
    dispatch(setReportType(newValue.type))
  }

  useEffect(() => {
    getReports()
  }, [])

  const getReports = async () => {
    setLoading(true);
    dispatch(fetchName({ type: reportType, startDate: dayjs(dateRange.fromDate).format("MM-DD-YYYY") || null, endDate: dayjs(dateRange.toDate).format("MM-DD-YYYY") || null }));
    setLoading(false);
  };

  const options = [
    { label: 'Project', type: 'project' },
    { label: 'Client', type: 'client' },
    { label: 'User', type: 'user' }
  ];

  return (
    <>
      {isLoading ? <BackdropSpinner /> :
        <Grid display='flex' flexWrap='wrap' justifyContent='start' columnGap={6} sx={{ m: 5 }}>
          <Grid xs={12} sm={4} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
            <Autocomplete
              options={options}
              getOptionLabel={(option) => option.label}
              value={reportType ? options.find(option => option.type === reportType) : null}
              onChange={(e, newValue) => { setLoading(true), handleOnChange(newValue) }}
              renderInput={(params) => <TextField {...params} label='Select' />}
            />
          </Grid>
          <Grid xs={12} sm={4} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
            <DatePickerWrapper sx={{ '& .MuiFormControl-root': { width: '100%' } }}>
              <DatePicker
                selectsRange
                endDate={report.end}
                selected={report.start}
                startDate={report.start}
                id='date-range-picker'
                onChange={(dates) => {
                  setReport(prev => ({ ...prev, start: dates[0], end: dates[1] }))
                  dispatch(setDateRange({
                    fromDate: dates[0],
                    toDate: dates[1]
                  },))
                  dispatch(fetchName({
                    type: reportType,
                    startDate: dayjs(dates[0]).format("MM-DD-YYYY") || null,
                    endDate: dayjs(dates[1]).format("MM-DD-YYYY") || null
                  }));

                }}
                shouldCloseOnSelect
                popperPlacement='auto'
                dateFormat='dd-MMM-yy'
                customInput={<CustomInput label='Date Range' start={report.start} end={report.end} />}
              />
            </DatePickerWrapper>
          </Grid>

          {/* <Grid
        sx={{
          pt: theme => `${theme.spacing(4)} !important`,
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}
      >
        <Button variant='contained' onClick={getReports} disabled={!report.type || !report.value}>
          Get Report
        </Button>
      </Grid> */}
        </Grid>
      }
    </>
  )

}

export default ReportsHeader
