import { Card, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const NoTimeSheets = () => {
  return (
    <Grid
      container
      className='d-flex'
      flexDirection='column'
      justifyContent='center'
      sx={{ mt: 20 }}
    >
      <Box item sx={{ m: 'auto' }}>
        <img src='/images/pages/404.png' alt='' height={250} />
      </Box>
      <Box flexDirection='column' align='center' sx={{ m: 'auto' }}>
        <Typography variant='body1'>No TimeSheets Found</Typography>
      </Box>
    </Grid>
  )
}

export default NoTimeSheets
