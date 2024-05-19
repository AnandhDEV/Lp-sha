// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const TaskStatus = ({ details }) => {
  // ** Hook
  const labels = Object.keys(details);
  //const labels = ['Not Started', 'In Progress', 'Completed', 'Due'];
  const theme = useTheme()

  const options = {
    chart: {
      sparkline: { enabled: true }
    },
    colors: [
      theme.palette.primary.main,
      hexToRGBA(theme.palette.primary.main, 0.7),
      hexToRGBA(theme.palette.primary.main, 0.5),
      theme.palette.customColors.trackBg
    ],
    stroke: { width: 0 },
    legend: { show: false },
    dataLabels: { enabled: false },
    labels: labels,
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      pie: {
        customScale: 0.9,
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              offsetY: 25,
              fontSize: '0.875rem',
              color: theme.palette.secondary.main
            },
            value: {
              offsetY: -15,
              fontWeight: 500,
              formatter: value => `${value}`,
              color: theme.palette.text.primary
            },
            total: {
              show: true,
              fontSize: '0.875rem',
              label: '',
              color: theme.palette.text.secondary,
              formatter: value =>
                `${value.globals.seriesTotals.reduce((total, num) => total + num)}`
            }
          }
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Task Status'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={
          <OptionsMenu
            options={['Last 28 Days', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.primary' } }}
          />
        }
      />
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <ReactApexcharts
              type='donut'
              height={215}
              series={Object.values(details)}
              options={options}
            />
          </Grid>
          <Box
            item
            sx={{ m: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Typography variant='body2'>
              {/* Completed Tasks : {details?.find(x => x.taskStatus === 'Completed')?.count || 0} */}
              {/* Completed Tasks : {details?.completed || 0} */}
              Completed Tasks : {details?.["Completed"] || 0}
            </Typography>
          </Box>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TaskStatus
