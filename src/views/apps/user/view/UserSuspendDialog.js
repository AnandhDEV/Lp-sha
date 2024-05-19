// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {
  deleteUser,
  setActivate,
  setSecondDialogOpen,
  setSuspend,
  setSuspendDialogOpen,
  setUsers
} from 'src/store/apps/user'
import { unwrapResult } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Router, useRouter } from 'next/router'
import { handleResponse } from 'src/helpers/helpers'
import { store } from 'src/store'

const UserSuspendDialog = props => {
  // ** Props
  const { open, setOpen } = props
  const dispatch = useDispatch()
  const router = useRouter()

  // ** States
  const { userId, users, secondDialogOpen } = useSelector(state => state.user)

  const [userInput, setUserInput] = useState('yes')
  const handleClose = () => setOpen(false)
  const handleSecondDialogClose = () => {
    dispatch(setSecondDialogOpen(false))
  }

  const updateStates = () => {
    handleClose()

    // const _users = users ? [...users] : []
    // const index = _users.findIndex(o => o.id == userId)
    // _users[index] = {
    //   ...users[index],
    //   isActive: false
    // }
    // dispatch(setUsers(_users))
  }

  const handleConfirmation = value => {
    handleClose()
    dispatch(deleteUser(userId))
      .then(unwrapResult)
      .then(res => {
        if (res.hasError) {
          handleResponse('update', res, () => {})
        } else {
          dispatch(setSuspend(true))
          dispatch(setActivate(false))
          setUserInput('yes')
          dispatch(setSecondDialogOpen(true))
          setOpen(false)
        }
      })
      .catch(err => {
        handleClose()
        toast.error(err.message, 'Error while Suspend user')
        setUserInput('cancel')
        setSecondDialogOpen(true)
      })
  }

  const handleCancel = () => {
    handleClose()
    setUserInput('cancel')
  }

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
      >
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 8, color: 'warning.main' }
            }}
          >
            <Icon icon='mdi:alert-circle-outline' fontSize='5.5rem' />
            <Typography variant='h4' sx={{ mb: 5, color: 'text.secondary' }}>
              Are you sure?
            </Typography>
            <Typography>You won't be able to revert user!</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation('yes')}>
            Yes, Suspend user!
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handleCancel('cancel')}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        open={secondDialogOpen}
        onClose={handleSecondDialogClose}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 14,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon
              fontSize='5.5rem'
              icon={userInput === 'yes' ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}
            />
            <Typography variant='h4' sx={{ mb: 8 }}>
              {userInput === 'yes' ? 'Suspended!' : 'Cancelled'}
            </Typography>
            <Typography>
              {userInput === 'yes' ? 'User has been suspended.' : 'Cancelled Suspension :)'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UserSuspendDialog
