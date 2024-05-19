// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import TaskProgress from './TaskProgress'

const data = [
  {
    title: '57',
    avatarColor: 'success',
    subtitle: 'Billable Task',
    icon: <Icon icon='mdi:trending-up' fontSize='1.875rem' />
  },
  {
    title: '23',
    avatarColor: 'primary',
    subtitle: 'Non-Billable Task',
    icon: <Icon icon='mdi:currency-usd' fontSize='1.875rem' />
  },

]

const series = [
  {
    name: 'Billable Task',
    data: [8, 7, 10, 12, 9, 6, 8]
  },
  {
    name: 'Non Billable Task',
    data: [0, 4, 0, 5, 6, 5, 3]
  },
  
]

// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const TaskProgressChart = () => {
  // ** Hook
  const theme = useTheme()

  const options = {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '35%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.secondary.main],
    grid: {
      strokeDashArray: 7,
      borderColor: theme.palette.divider,
      padding: {
        left: 0,
        bottom: -13
      }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 6,
      curve: 'smooth',
      lineCap: 'round',
      colors: [theme.palette.background.paper]
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: ['24-Nov', '25-Nov', '26-Nov', '27-Nov', '28-Nov', '29-Nov', '30-Nov'],
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    yaxis: {
      labels: {
        offsetY: 2,
        offsetX: -10,
        formatter: value => (value > 999 ? `${(value).toFixed(0)}` : `${value}`),
        style: { colors: theme.palette.text.disabled }
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '45%'
            }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '50%'
            }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '45%'
            }
          }
        }
      },
      {
        breakpoint: 430,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '55%'
            }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <Grid container>
        <StyledGrid item xs={12} sm={7}>
          <CardContent sx={{ height: '100%', '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
            <Typography variant='h6'>Task Progress</Typography><br />
            <ReactApexcharts type='bar' height={295} series={series} options={options} /><br />
          </CardContent>
        </StyledGrid>
        <Grid item xs={12} sm={5}>
          <CardHeader
            title='80'
            subheader='Completed Out of 170'
            subheaderTypographyProps={{ sx: { lineHeight: '1.25rem', fontSize: '0.875rem !important' } }}
            titleTypographyProps={{
              sx: {
                fontSize: '1.5rem !important',
                lineHeight: '2rem !important',
                letterSpacing: '0.43px !important'
              }
            }}
            action={
              <OptionsMenu
                options={['Last 28 Days', 'Last Month', 'Last Year']}
                iconButtonProps={{ size: 'small', sx: { color: 'text.primary' } }}
              />
            }
          />
          <CardContent
            sx={{ pt: theme => `${theme.spacing(4)} !important`, pb: theme => `${theme.spacing(5.5)} !important` }}
          >
            {data.map((item, index) => {
              return (
                <Box key={index} sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color={item.avatarColor}
                    sx={{ mr: 3.5, '& svg': { color: `${item.avatarColor}.main` } }}
                  >
                    {item.icon}
                  </CustomAvatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                    <Typography variant='body2'>{item.subtitle}</Typography>
                  </Box>
                </Box>
              )
            })}<br />
            <Button fullWidth variant='contained'>
              View Report
            </Button>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default TaskProgressChart
