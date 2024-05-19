// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { Button, Typography } from '@mui/material'
import Link from 'next/link'
import { GridToolbarExport } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'

const Toolbar = props => {
  const { isExport, handleFilter, searchValue, title, isUser } = props

  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: theme => theme.spacing(5)
      }}
    >
      {isExport && (
        <GridToolbarExport
          color='secondary'
          size='normal'
          printOptions={{ disableToolbarButton: true }}
        />
      )}
      <Box>
        <Typography variant='body1' fontWeight={'bold'} fontSize='1rem'>
          {title}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          sx={{ mr: 4 }}
          placeholder='Search Project'
          autoComplete='off'
          value={searchValue}
          autoFocus
          onChange={e => handleFilter(e.target.value)}
        />
        {!isUser && (
          <Button component={Link} variant='contained' href='/projects/add'>
            Create Project
          </Button>
        )}
      </Box>
    </Box>)
}

export default Toolbar
