// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'

const data = [
  {
    chipText: 'Permission',
    chipColor: 'primary',
    title: 'Dhivya Kumarasamy',
    src: '/images/avatars/4.png',
    subtitle: '30 Nov'
  },
  {
    chipColor: 'success',
    chipText: 'Sick Leave',
    title: 'Naveen Mounasamy',
    src: '/images/avatars/8.png',
    subtitle: '28 Nov'
  },
  {
    chipText: 'PL',
    chipColor: 'error',
    title: 'Praghat Chandrasekar',
    src: '/images/avatars/7.png',
    subtitle: '25 Nov'
  },
  {
    chipText: 'Permission',
    chipColor: 'primary',
    title: 'Deepa Jayaprakash',
    src: '/images/avatars/3.png',
    subtitle: '23 Nov'
  },
  {
    chipText: 'Sick Leave',
    chipColor: 'success',
    title: 'DhineshKumar Selvam',
    src: '/images/avatars/2.png',
    subtitle: '21 Nov'
  },
  
]

const AbsenceSchedule = () => {
  return (
    <Card>
      <CardHeader
        title='Absence Schedule'
        action={
          <OptionsMenu
            options={['Refresh', 'Share', 'Reschedule']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.primary' } }}
          />
        }
      />
      <CardContent>
        {data.map((item, index) => {
          return (
            <Box
              key={item.title}
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(index !== data.length - 1 ? { mb: 6 } : {})
              }}
            >
              <Avatar src={item.src} sx={{ mr: 3, width: 38, height: 38 }} />
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ mr: 2, display: 'flex', mb: 0.4, flexDirection: 'column' }}>
                  <Typography
                    sx={{ fontWeight: 500, lineHeight: 1.71, letterSpacing: '0.22px', fontSize: '0.875rem !important' }}
                  >
                    {item.title}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '& svg': { mr: 1, color: 'text.secondary', verticalAlign: 'middle' }
                    }}
                  >
                    <Icon fontSize='0.875rem' icon='mdi:calendar-blank-outline' />
                    <Typography variant='caption'>{item.subtitle}</Typography>
                  </Box>
                </Box>
                <CustomChip
                  skin='light'
                  size='small'
                  label={item.chipText}
                  color={item.chipColor}
                  sx={{ height: 20, mt: 0.4, fontSize: '0.75rem', fontWeight: 600 }}
                />
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default AbsenceSchedule
