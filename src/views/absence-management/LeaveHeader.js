import { Button, CardHeader } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import React from 'react'

const LeaveHeader = ({ title }) => {
  return (
    <div>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <CardHeader title={title} />
      </Box>
    </div>
  )
}

export default LeaveHeader
