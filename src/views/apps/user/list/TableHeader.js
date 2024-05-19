// ** MUI Imports
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'

const TableHeader = props => {
  // ** Props
  const { handleFilter, toggle, value, title } = props
  const [role, setRole] = useState(0)
  const auth = useAuth()
  const roleId = auth.user?.roleId

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRole(roleId)
    }
  }, [])

  return (
    <Box
      sx={{
        pb: 3,
        pr: 6,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* <Button
        sx={{ mr: 4, mb: 2 }}
        color='secondary'
        variant='outlined'
        startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
      >
        Export
      </Button> */}

      <Box>
        {/* <Typography variant='body1' fontWeight={'bold'} fontSize='1rem' sx={{ marginLeft: '25px' }}>
          {title}
        </Typography> */}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder='Search User'
          onChange={e => handleFilter(e.target.value)}
          autoComplete='off'
        />

        {(role == 1 || role == 2 || role == 3) && (
          <Button sx={{ mb: 2 }} onClick={toggle} variant='contained'>
            Add User
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default TableHeader
