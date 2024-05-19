// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const TaskProgressPie = ({ details }) => {
  // ** Hook
  const theme = useTheme()

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];

   const { taskProgressPercentage } = details
  

  const options = {
    chart: {
      sparkline: { enabled: true }
    },
    labels: ['Cricket'],
    stroke: { lineCap: 'round' },
    grid: {
      padding: {
        top: -10
      }
    },
    colors: [theme.palette.warning.main],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.2,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.1,
        stops: [0, 90]
      }
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      radialBar: {
        endAngle: 180,
        startAngle: -180,
        inverseOrder: true,
        hollow: { size: '62%' },
        track: { background: theme.palette.customColors.trackBg },
        dataLabels: {
          name: { offsetY: 26 },
          value: {
            offsetY: -14,
            fontWeight: 500,
            fontSize: '1.5rem',
            formatter: value => `${value}k`,
            color: theme.palette.text.primary
          },
          total: {
            show: true,
            label: '',
            fontWeight: 400,
            fontSize: '14px',
            color: theme.palette.text.secondary
          }
        }
      }
    }
  }
// Dynamically set the formatted date based on the project end date
let displayDate = formattedDate;
  if (taskProgressPercentage?.endDate) {
    displayDate = currentDate <= new Date(taskProgressPercentage?.endDate) ? formattedDate : new Date(taskProgressPercentage?.endDate).toISOString().split('T')[0];

  }
  
  return (
    <Card>
      <CardHeader
        title='Task Progress'
        action={
          <OptionsMenu
            options={['Last 28 Days', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
          />
        }
        titleTypographyProps={{
          sx: {
            fontSize: '1rem !important',
            fontWeight: '600 !important',
            lineHeight: '1.5rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <ReactApexcharts
          type='radialBar'
          height={216}
          series={[Math.trunc(taskProgressPercentage?.taskProgress)]}
          options={options}
        />
        <Typography sx={{ mb: 2.5 }} variant='caption'>
          {Math.trunc(taskProgressPercentage?.taskProgress)}% Tasks completed Till {displayDate}
          {/* All tasks have been completed as of {displayDate}, resulting in a {Math.trunc(taskProgressPercentage?.taskProgress)}% completion rate. */}
          {/* All tasks completed by {displayDate}, {Math.trunc(taskProgressPercentage?.taskProgress)}% progress */}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default TaskProgressPie
