// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Link from 'next/link'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const ClientTableHeader = props => {
  // ** Props
  const { handleFilter, value, setOpen } = props

  return (
    <Box
      sx={{
        pb: 5,
        pr: 5,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end'
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder='Search Client'
          autoComplete='off'
          onChange={e => handleFilter(e.target.value)} // Pass the search value to handleFilter
        />

        <Button sx={{ mb: 2 }} variant='contained' onClick={() => setOpen()}>
          New Client
        </Button>
      </Box>
    </Box>
  )
}

export default ClientTableHeader
