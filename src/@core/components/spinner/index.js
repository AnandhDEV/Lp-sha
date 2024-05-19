import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import { PuffLoader } from 'react-spinners'

export default function SimpleBackdrop() {
  return (
    <div>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: theme => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column'
        }}
        open={true}
      >
        <img src='/images/lp-white.png' className='flip-image' alt='Leanprofit' height={50} />
      </Backdrop>
    </div>
  )
}

export const Spinner = () => {
  return (
    <PuffLoader
      color='#8039df'
      size={80}
      speedMultiplier={2}
      cssOverride={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto'
      }}
    />
  )
}
export const BackdropSpinner = () => {
  return (
    <Backdrop
      sx={{
        color: '#999999',
        zIndex: theme => theme.zIndex.drawer + 1,
        display: 'flex',
        flexDirection: 'column'
      }}
      open={true}
    >
      <PuffLoader
        color='#f7026d'
        size={80}
        speedMultiplier={2}
        cssOverride={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 'auto'
        }}
      />
    </Backdrop>
  )
}
