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
  const { isExport, handleFilter, searchValue } = props

  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: isExport ? 'space-between' : 'flex-end',
        p: theme => theme.spacing(4)
      }}
    >
      {isExport && (
        <GridToolbarExport
          color='secondary'
          size='normal'
          printOptions={{ disableToolbarButton: true }}
        />
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          sx={{ mr: 4 }}
          placeholder='Search '
          value={searchValue}
          autoFocus
          onChange={e => handleFilter(e.target.value)}
        />
      </Box>
    </Box>
  )
}

export default Toolbar
