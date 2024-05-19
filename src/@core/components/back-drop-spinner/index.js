import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'

export default function SimpleBackdrop() {
  const [open, setOpen] = React.useState(true)
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <div>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: theme => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column'
        }}
        open={open}
        onClick={handleClose}
      >
        <img src='/images/lp-white.png' alt='Leanprofit' height={50} />

        <CircularProgress disableShrink sx={{ mt: 6 }} />
      </Backdrop>
    </div>
  )
}
