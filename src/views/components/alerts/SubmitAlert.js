import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material'
import React, { useState } from 'react'

const SubmitAlert = props => {
  const { open, setOpen, title, content, action, handleAction } = props

  return (
    <div>
      <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setOpen(!open)
          }
        }}
      >
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{content}</DialogContentText>
          {action == 'Reject' && (
            <TextField id='Comment' fullWidth multiline minRows={2} sx={{ pt: 4 }} />
          )}
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button color='secondary' onClick={() => setOpen(!open)}>
            Cancel
          </Button>
          <Button
            color={action == 'Approve' ? 'success' : action == 'Reject' ? 'error' : 'primary'}
            variant='contained'
            onClick={() => handleAction(action, document.getElementById('Comment'))}
          >
            {action}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default SubmitAlert
