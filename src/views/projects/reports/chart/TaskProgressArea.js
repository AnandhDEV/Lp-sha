// ** React Imports
import { forwardRef, useMemo, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { deleteTask } from 'src/store/apps/projects'

const areaColors = {
  series1: '#ab7efd',
  series2: '#b992fe',
  series3: '#e0cffe'
}

const series = [
  {
    name: 'Planned',
    data: [100, 20, 99, 4, 20, 60, 140, 240, 220, 180, 270]
  },
  {
    name: 'Actual',
    data: [1, 2, 3, 4, 5, 6, 160, 140, 200, 220, 275]
  }
]

const TaskProgressArea = ({ details }) => {


  const dates = useMemo(() => {
    let list = []
    details?.taskProgressData?.forEach(item => {
      if (item.dueDate && item.completedDate) {
        list = [...list, dayjs(item.dueDate).format("DD/MM"), dayjs(item.completedDate).format("DD/MM")]
      }
    })

    return [...new Set([...list])].sort()
  }, [details])



  const seriesNew = useMemo(() => {
    let plannedlist = []
    let actualList = []

    dates.forEach(item => {
      plannedlist = [...plannedlist, details.taskProgressData.filter(x => dayjs(x.dueDate).format("DD/MM") === item).length]
      actualList = [...actualList, details.taskProgressData.filter(x => dayjs(x.completedDate).format("DD/MM") === item).length]
    })

    return [{
      name: 'Planned',
      data: plannedlist
    },
    {
      name: 'Actual',
      data: actualList
    }]
  }, [dates])


  // ** States
  const [endDate, setEndDate] = useState(null)
  const [startDate, setStartDate] = useState(null)

  // ** Hook
  const theme = useTheme()

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { shared: false },
    dataLabels: { enabled: false },
    stroke: {
      show: false,
      curve: 'straight'
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: { colors: theme.palette.text.secondary },
      markers: {
        offsetY: 1,
        offsetX: -3
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    colors: [areaColors.series3, areaColors.series2, areaColors.series1],
    fill: {
      opacity: 1,
      type: 'solid'
    },
    grid: {
      show: true,
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true }
      }
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      crosshairs: {
        stroke: { color: theme.palette.divider }
      },
      labels: {
        style: { colors: theme.palette.text.disabled }
      },
      categories: dates
    }
  }

  const CustomInput = forwardRef((props, ref) => {
    const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return (
      <TextField
        {...props}
        size='small'
        value={value}
        inputRef={ref}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Icon icon='mdi:bell-outline' />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position='end'>
              <Icon icon='mdi:chevron-down' />
            </InputAdornment>
          )
        }}
      />
    )
  })

  const handleOnChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  return (
    <Card>
      <CardHeader
        title='Task Progress'
        subheaderTypographyProps={{
          sx: { color: theme => `${theme.palette.text.disabled} !important` }
        }}
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
      />
      <CardContent>
        <ReactApexcharts type='area' height={200} options={options} series={seriesNew} />
      </CardContent>
    </Card>
  )
}

export default TaskProgressArea
