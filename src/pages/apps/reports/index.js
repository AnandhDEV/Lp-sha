// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select from '@mui/material/Select'
import { DataGrid } from '@mui/x-data-grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import AnalyticsTransactionsCard from 'src/views/dashboards/analytics/AnalyticsTransactionsCard'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { setPeriodRange, setGroupByValue } from 'src/store/apps/reports'


// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import TableHeader from 'src/views/apps/invoice/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import UtilizationCard from './charts/UtilizationCard'
import OverTimeCard from './charts/OverTimeCard'
import UtilizationChart from './charts/UtilizationChart'
import ResourceGrowthChart from './charts/ResourceGrowthChart'
import SalesOverview from './charts/SalesOverview'
import GroupedTable from 'src/views/apps/reports/GroupBytable'
import { GroupBy } from 'src/views/apps/reports/GroupBy'
import { useTheme } from '@emotion/react'
import PickersRange from 'src/views/apps/reports/PeriodPicker'
import ReportDetailsTable from "src/views/apps/reports/ReportDetailsTable"

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

/* eslint-disable */
const CustomInput = forwardRef((props, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates
  return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})

/* eslint-enable */
const InvoiceList = () => {
  // ** State
  const [dates, setDates] = useState([])
  const [value, setValue] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [endDateRange, setEndDateRange] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [rows, setrows] = useState([])
  const [columns, setcolumns] = useState([])
  const [startDateRange, setStartDateRange] = useState(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })


  return (
    < >
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6} lg={6}>
            <UtilizationCard />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <OverTimeCard />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <UtilizationChart />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ResourceGrowthChart />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <SalesOverview />
          </Grid>
        </Grid>
      </ApexChartWrapper><br />

    </>
  )
}

export default InvoiceList
