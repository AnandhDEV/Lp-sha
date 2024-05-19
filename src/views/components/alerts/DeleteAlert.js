import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useState } from 'react'

const DeleteAlert = (props) => {

  const { open, setOpen, title, content, action, handleAction } = props;


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
          <DialogContentText id='alert-dialog-description'>
            {content ? content : "Are you sure you want to delete this item"}
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button color='error' onClick={() => setOpen(!open)}>Cancel</Button>
          <Button color="error" variant='contained' onClick={() => handleAction()}>{action}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default DeleteAlert
