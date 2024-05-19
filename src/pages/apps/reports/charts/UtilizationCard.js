// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'

const salesData = [
  {
    stats: '30,574',
    title: 'Available (hrs)',
    color: 'primary',
    icon: 'mdi:account-clock-outline'
  },
  {
    stats: '25,654',
    color: 'success',
    title: 'Billable (hrs)',
    icon: 'mdi:clock-outline'
  },
  {
    stats: '4,920',
    color: 'warning',
    title: 'Non-Billable (hrs)',
    icon: 'mdi:clock-outline'
  }
]

const renderStats = () => {
  return salesData.map((item, index) => (
    <Grid item xs={12} sm={4} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar variant='rounded' color={item.color} sx={{ mr: 2, boxShadow: 3, width: 44, height: 44 }}>
          <Icon icon={item.icon} fontSize='1.75rem' />
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const UtilizationCard = () => {
  return (
    <Card>
      <CardHeader
        title='Resource Utilization'
        action={
          <OptionsMenu
            options={['Refresh', 'Share', 'Update']}
            iconButtonProps={{ size: 'small', className: 'card-more-options', sx: { color: 'text.secondary' } }}
          />
        }
        subheader={
          <Typography variant='body2'>
            <CustomChip
          size='small'
          skin='light'
          label='last month'
          color='primary'
          sx={{ height: 20, fontWeight: 500, fontSize: '0.75rem', '& .MuiChip-label': { lineHeight: '1.25rem' } }}
        />
        
         
             
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.25,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(0.75)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default UtilizationCard
