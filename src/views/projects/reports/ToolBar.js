// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { GridToolbarExport } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Button, Grid } from '@mui/material'
import CustomBackButton from 'src/@core/components/back-button'
import { useDispatch } from 'react-redux'
import { fetchTimesheetExport } from 'src/store/timesheets'

const Toolbar = ({ id, searchValue, handleFilter }) => {
  const dispatch = useDispatch()

  const handleExport = () => {
    dispatch(fetchTimesheetExport(id)).then(res => {
      const base64String = res.payload?.base64String;

      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TimeSheet Report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };


  return (

    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 0 }}>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          sx={{ mr: 4, mb: 2 }}
          color='secondary'
          variant='outlined'
          onClick={handleExport}
          startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
        >
          Export
        </Button>

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
