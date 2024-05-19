// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

// ** Third Party Imports
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import DatePicker from 'react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchClientReports,
  fetchUserReports,
  fetchProjectReports,
  setDateRanges
} from 'src/store/apps/reports'
import { FormControl } from '@mui/material'

const PickersRange = ({ popperPlacement }) => {
  // ** States
  const [startDateRange, setStartDateRange] = useState(addDays(new Date(), -7))
  const [endDateRange, setEndDateRange] = useState(new Date())
  const dispatch = useDispatch()
  const store = useSelector(state => state.reports)

  useEffect(() => {
    if (startDateRange != null && endDateRange != null) {
      dispatch(setDateRanges([startDateRange.toISOString(), endDateRange.toISOString()]))
    }
  }, [startDateRange, endDateRange, dispatch])

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)
    if (start != null && end != null) {
      const _dates = [start.toISOString(), end.toISOString()]
      store.groupByValue === 'Project'
        ? dispatch(fetchProjectReports(_dates))
        : store.groupByValue === 'Client'
          ? dispatch(fetchClientReports(_dates))
          : dispatch(fetchUserReports(_dates))
    }
  }

  const CustomInput = forwardRef((props, ref) => {
    const startDate = format(props.start, 'MM/dd/yyyy')
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return <TextField fullWidth inputRef={ref} label={props.label || ''} {...props} value={value} />
  })

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
      <DatePicker
        selectsRange
        monthsShown={2}
        endDate={endDateRange}
        selected={startDateRange}
        startDate={startDateRange}
        shouldCloseOnSelect={false}
        id='date-range-picker-months'
        onChange={handleOnChangeRange}
        popperPlacement={popperPlacement}
        customInput={
          <CustomInput label='Date Range Filters' end={endDateRange} start={startDateRange} />
        }
      />
    </Box>
  )
}

export default PickersRange
