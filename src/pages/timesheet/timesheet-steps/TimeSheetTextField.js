import { TextField } from '@mui/material'
import React, { useState, useEffect } from 'react'

function TimeSheetTextField({ handlechange, value, ...additionalprops }) {
  const [time, setTime] = useState(value)
  const [error, setError] = useState(false)

  useEffect(() => {
    setTime(value)
  }, [value])

  const formattime = e => {
    let min = time.split(':')[1]?.slice(0, 2)
    let hr = Number(time.split(':')[0])

    // if (!time.match(/^\d{0,10}(\:\d{1,2})?$/)) {
    //   setError(true);
    //   return;
    // }

    if (time.includes('.')) {
      let value = time.split('.')

      let hour = value[0]
      let minute = value[1]
      let temp = [10, 100, 1000, 10000, 100000]
      let calcMIN = (minute / temp[minute.length - 1]) * 60

      hr = hour ? hour : '00'
      min = calcMIN

    } else {
      if (time.includes(':')) {
        if (min.length < 2) {
          min = min + '00'
          if (Number(min) > 59 && (Number(hr) || Number(hr) === 0)) {
            setError(false)
            min = 59
          } else {
            setError(false)
          }
        } else {
          if (
            Number(min) > 59 &&
            Number(min) > 9 &&
            Number(hr) != null &&
            Number(hr) != undefined
          ) {
            setError(false)
            min = 59
          } else if (Number(hr) || Number(min) != undefined) {
            setError(false)

            // if (!Number(min) >= 0 && !Number(hr) >= 0) {
            //   return;
            // }
          } else {
            setError(true)

            return
          }
        }
      } else if (time.match(/^\d+$/)) {
        setError(false)
        min = '00'
      } else {
        setTime('00:00')

        return
      }
    }

    if (hr >= 0 && hr <= 9) {
      hr = '0' + hr
    }
    setTime(hr + ':' + min)
    handlechange(e, hr + ':' + min == '' ? '00:00' : hr + ':' + min)

    return
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          flexDirection: 'row'
        }}
      >
        <TextField
          type='text'
          fullWidth
          value={time}
          onChange={e => setTime(e.target.value.replace(/[A-Za-z'?/><,!@#$%^&*(){}|"']/, ''))}
          onBlur={formattime}
          error={error}
          {...additionalprops}

          // helperText={error && "Please enter valid time"}
        />
        {error && <span className='custom_error_timesheet'>*Invalid time</span>}
      </div>
    </>
  )
}

export default TimeSheetTextField
