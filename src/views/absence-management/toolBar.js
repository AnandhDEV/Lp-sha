// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { Button, Typography } from '@mui/material'
import Link from 'next/link'
import { GridToolbarExport } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const Toolbar = props => {
  const {title,  btnName, isBtn, isExport, onClick, handleFilter, searchValue, label } = props

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
      {/* {isExport && (
        <GridToolbarExport
          color='secondary'
          size='normal'
          printOptions={{ disableToolbarButton: true }}
        />
      )} */}
      <Box>
      <Typography variant='body1' fontWeight={"bold"} fontSize="1rem">{title}</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          autoFocus
          sx={{ mr: 4 }}
          value={searchValue}
          placeholder={`Search ${label}`}
          onChange={e => handleFilter(e.target.value)}
          autoComplete='off'
        />
        {isBtn && (
          <Button variant='contained' onClick={onClick}>
            {btnName}
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default Toolbar
