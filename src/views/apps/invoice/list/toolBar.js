// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { Button } from '@mui/material'
import Link from 'next/link'
import { GridToolbarExport } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const Toolbar = props => {
  const {isExport, handleFilter, searchValue}= props;

  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: isExport ? 'space-between' :'flex-end',
        p: theme => theme.spacing(2, 5, 4, 5)
      }}
    >
      {
        isExport &&  <GridToolbarExport
        color='secondary'
        size='normal'
        printOptions={{ disableToolbarButton: true }}
      />
      }
     
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          sx={{ mr: 4, mb: 2 }}
          placeholder='Search Invoice'
          value={searchValue}
          autoFocus
          onChange={e => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2 }} component={Link} variant='contained' href='/apps/invoice/add'>
          Create Invoice
        </Button>
      </Box>
    </Box>
  )
}

export default Toolbar
