import { Icon } from '@iconify/react'
import { IconButton, Typography, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const CustomBackButton = ({ icon, title, onClickBack }) => {
  const theme = useTheme()

  return (
    <Box className='gap-1' alignItems='center' sx={{ pl: theme => theme.spacing(4) }}>
      <IconButton onClick={onClickBack}>
        <Icon icon={icon || 'mdi:arrow-left'} />
      </IconButton>
      <Typography variant='h6' fontWeight='bold' color={theme.palette.mode == 'light' && 'primary'}>
        {title}
      </Typography>
    </Box>
  )
}

export default CustomBackButton
