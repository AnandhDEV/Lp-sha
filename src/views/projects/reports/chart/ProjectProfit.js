// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import currencySymbols from 'src/views/projects/reports/chart/currencySymbols'

// ** Styled component for the image
const Img = styled('img')({
  
    right: 20,
    bottom: 9,
    height: 130,
    position: 'absolute'
  
})


// const currencySymbols = {
//   USD: '$',
//   EUR: '€',
//   GBP: '£',
//   INR: '₹', 
// };

const ProjectProfit = ({ details = {} }) => {
  const { profitCost, profitPercentage,currency,endDate } = details

  const currentYear = new Date().getFullYear();

  const getCurrencySymbol =(currencyCode)  => {
    return currencySymbols[currencyCode] || currencyCode;
  };

  const data = {
    stats: `${getCurrencySymbol(currency)} ${Math.trunc(profitCost)}`,
    //stats: currency && profitCost ? `${getCurrencySymbol(currency)} ${Math.trunc(profitCost)}`: '',
    title: 'Project Profit',
    trendNumber: `${Math.trunc(profitPercentage)}%`,
    //trendNumber: profitPercentage ? `${Math.trunc(profitPercentage)}%` : '0%',
    chipColor: 'primary',
    //chipText: `Year of ${currentYear}` ,
    chipText: endDate && new Date(endDate).getFullYear() <= currentYear ? `Year of ${new Date(endDate).getFullYear()}` : `Year of ${currentYear}`,
    src: '/images/cards/pose_f9.png'
  }

  const {
    title,
    chipText,
    src,
    stats,
    trendNumber,
    trend = 'positive',
    chipColor = 'primary'
  } = data

  return (
    <Card sx={{ overflow: 'visible', position: 'relative' }}>
      <CardContent>
        <Typography sx={{ mb: 6.5, fontWeight: 600 }}>{title}</Typography>
        <Box
          sx={{
            mb: 1.5,
            rowGap: 1,
            width: '55%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start'
          }}
        >
          <Typography variant='h5' sx={{ mr: 1.5 }}>
            {stats}
          </Typography>
          <Typography
            component='sup'
            variant='caption'
            sx={{ color: trend === 'negative' ? 'error.main' : 'success.main' }}
          >
            {trendNumber}
          </Typography>
        </Box>
        <CustomChip
          size='small'
          skin='light'
          label={chipText}
          color={chipColor}
          sx={{
            height: 20,
            fontWeight: 500,
            fontSize: '0.75rem',
            '& .MuiChip-label': { lineHeight: '1.25rem' }
          }}
        />
        <Img src={src} alt={title} />
      </CardContent>
    </Card>
  )
}

export default ProjectProfit
