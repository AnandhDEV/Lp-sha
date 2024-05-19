// ** MUI Imports
import { Grid } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useDispatch, useSelector } from 'react-redux'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { setClientReports, setProjectReports, setSelectedRowData, setUserReports } from 'src/store/apps/reports'

const ReportsTableHeader = props => {
  // ** Props
  const { handleFilter, toggle, value } = props
  const store = useSelector(state => state.reports)
  const dispatch = useDispatch();

  const handleGoBack = () => {
    dispatch(setSelectedRowData({}));
    switch (store.groupByValue?.toLowerCase()) {
      case "user":
        dispatch(setUserReports([]));
        break;
      case "client":
        dispatch(setClientReports([]));
        break;
      case "project":
        dispatch(setProjectReports([]));
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Grid className='gap-1'>
        <Button sx={{ mb: 2 }} startIcon={<Icon icon="mdi:arrow-left" />} onClick={handleGoBack} variant='text'>
          Back
        </Button>
        <Button
          sx={{ mr: 4, mb: 2 }}
          color='secondary'
          variant='outlined'
          startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
        >
          Export
        </Button>
      </Grid>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder={`Search ${store.groupByValue}`}
          onChange={e => handleFilter(e.target.value)}
        />
      </Box>
    </Box>
  )
}

export default ReportsTableHeader
