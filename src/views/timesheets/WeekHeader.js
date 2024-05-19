import { Button, Grid, Typography, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'

const WeekHeader = ({ week, total, isApproved, confirmSubmit }) => {
  const theme = useTheme()

  return (
    <>
      <Grid
        container
        justifyContent='space-between'
        alignItems='center'
        sx={{
          p: theme => `${theme.spacing(3)}`,
          backgroundColor: theme => (theme.palette.mode == 'light' ? '#f5f5f5' : '#1111')
        }}
      >
        <Box className='gap-1'>
          <Typography
            variant='body2'
            fontWeight='bolder'
            color={theme.palette.mode == 'light' ? 'grey' : 'text.main'}
            sx={{ ml: 2 }}
          >
            {week}
          </Typography>
        </Box>
        <Box className='d-flex gap-1'>
          <Box className='gap-1' alignItems='center'>
            {isApproved ? (
              <CustomChip
                size='small'
                skin='light'
                color='success'
                label='Submitted for Approval'
              />
            ) : (
              <Button variant='contained' size='small' color='secondary' onClick={confirmSubmit}>
                Submit
              </Button>
            )}
            <Typography
              variant='body2'
              fontWeight='600'
              color={theme.palette.mode == 'light' ? 'grey' : 'text.main'}
            >
              Week total :
            </Typography>
            <Typography
              variant='body1'
              fontWeight='bold'
              color={theme.palette.mode == 'light' ? 'primary' : 'text.main'}
            >
              {total || 0}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </>
  )
}

export default WeekHeader
