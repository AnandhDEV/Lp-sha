// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Backdrop } from '@mui/material'

const FallbackSpinner = ({ sx }) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Backdrop
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <img src='/images/leanprofit.svg' alt='Leanprofit' height={50} />
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Backdrop>
  )
}

export default FallbackSpinner
