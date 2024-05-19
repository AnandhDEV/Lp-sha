import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  TextField,
  useMediaQuery
} from '@mui/material'
import { de } from 'date-fns/locale'
import React, { memo, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import SimpleBackdrop from 'src/@core/components/spinner'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { fetchUsers } from 'src/store/apps/user'
import { setLoading } from 'src/store/authentication/register'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

const ReportsHeader = ({ user, fromDate, toDate, getData }) => {
  const [report, setReport] = useState({
    user: null,
    start: new Date(),
    end: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
    isExportDisabled: true
  })
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const _user = useSelector(state => state.user)
  const isSM = useMediaQuery(theme => theme.breakpoints.up('sm'))
 

  useEffect(() => {
    _user.users == null && dispatch(fetchUsers())
  }, [])

  useEffect(() => {
    setReport(prev => ({ ...prev, start: fromDate, end: toDate, user: user }))
    setLoading(false)
  }, [user])

  const handleOnChange = dates => {
    const [start, end] = dates
    setReport(prev => ({ ...prev, start: start, end: end }))
  }

  const getReports = async () => {
    setLoading(true)
    await getData(
      {
        userId: report.user?.id,
        fromDate: report.start?.toISOString(),
        toDate: report.end?.toISOString()
      },
      report.user
    )
  }

  return (
    <Grid display='flex' flexWrap='wrap' justifyContent='start' columnGap={6} sx={{ m: 5 }}>
      <Grid xs={12} sm={4} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
        <Autocomplete
          options={(_user.users || []).slice()
            .sort((a, b) => (a.fullName).localeCompare(b.fullName)).filter(o => o.isActive) }
          id='autocomplete-limit-tags'
          getOptionLabel={option => option.fullName}
          value={report.user}
          onChange={(e, value) => setReport(report => ({ ...report, user: value }))}
          autoComplete='off'
          renderInput={params => <TextField {...params} label='Search User' placeholder='User' />}
          noOptionsText='No Users'
          loading={_user.users == null}
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
            onChange={handleOnChange}
            autoComplete='off'
            shouldCloseOnSelect
            popperPlacement='auto'
            dateFormat='dd-MMM-yy'
            customInput={<CustomInput label='Date Range' start={report.start} end={report.end} />}
          />
        </DatePickerWrapper>
      </Grid>

      <Grid
        sx={{
          pt: theme => `${theme.spacing(4)} !important`,
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}
      >
        {/* <Button variant='outlined' color='secondary' disabled={report.isExportDisabled}>
          Export
        </Button> */}
        <Button variant='contained' onClick={getReports} disabled={report.user == null}>
          Get Report
        </Button>
      </Grid>
    </Grid>
  )
  
}

export default ReportsHeader
