import { Button, Grid, Typography, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'

const WeekApprovalHeader = ({ week, total, isApproved, isRejected, onApproval }) => {
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
            {isApproved && (
              <CustomChip size='small' skin='light' color='success' label='Approved' />
            )}
            {isRejected && <CustomChip size='small' skin='light' color='error' label='Rejected' />}
            {!isApproved && !isRejected && (
              <Grid className='gap-1'>
                <Button
                  variant='contained'
                  size='small'
                  color='error'
                  onClick={() => onApproval('Reject')}
                >
                  Reject
                </Button>
                <Button
                  variant='contained'
                  size='small'
                  color='success'
                  onClick={() => onApproval('Approve')}
                >
                  Approve
                </Button>
              </Grid>
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

export default WeekApprovalHeader
