import { Icon } from '@iconify/react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

const EmptyMembers = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState('sm')


  //CLOSE
  const handleClose = () => {
    setDialogOpen(false)
  }


  return (
    <Grid container className='d-flex' flexDirection="column" justifyContent="center" sx={{ mt: 20 }}>
      <Box item sx={{ m: 'auto' }}>
        <img src="/images/pages/404.png" alt="" height={250} />
      </Box>
      <Box flexDirection="column" align="center" sx={{ m: 'auto' }}>
        <Typography variant='body1'>No Project Members Found</Typography>
        {/* <Button sx={{ m: 5 }} size="large" variant='contained' onClick={() => setDialogOpen(true)}>
          Add New Category
        </Button> */}
      </Box>
      {/* <Dialog open={isDialogOpen} onClose={handleClose} maxWidth={maxWidth}
        fullWidth aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'> Add New Category</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 5 }}>
            Create task category for the tasks
          </DialogContentText>
          <TextField id='Category' autoFocus fullWidth label='Category Name' />
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={createNewCategory}>Create</Button>
        </DialogActions>
      </Dialog> */}
    </Grid >
  )
}

export default EmptyMembers
