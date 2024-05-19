import { useTheme } from '@emotion/react'
import { duration } from '@mui/material'
import toast from 'react-hot-toast'
import { customErrorToast, customSuccessToast } from './custom-components/toasts'
import { formatLocalDate } from './dateFormats'
import { useEffect, useState } from 'react'

export function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'

  for (let i = 0; i < 6; i++) {
    // Generate a color component, ensuring it's above a certain threshold (e.g., 8)
    const component = Math.floor(Math.random() * (18 - 8)) + 4
    color += letters[component]
  }

  return color
}

// function getLocalStorageValue(key, initialValue) {
//   try {
//     const cached = localStorage.getItem(key) ?? ''
//     if (cached) return JSON.parse(cached)
//   } catch {
//     // clear existing data - probably a JSON.parse() error
//     localStorage.setItem(key, '')
//   }

//   /*
//        note: You might want to support initialValue being an function,
//        and return initialValue() if it is. But that is not in this demo
//       */
//   return initialValue
// }

// export function useStorageState(key, initialValue) {
//   // pass in a function to useState so it
//   // only gets called the first time
//   const [value, setValue] = useState(() => getLocalStorageValue(key, initialValue))

//   // return 2 items, similar to useState()
//   return [
//     value,

//     // wrapper around setValue, and also set local storage
//     newValue => {
//       setValue(newValue)
//       localStorage.setItem(key, JSON.stringify(newValue))
//     }
//   ]
// }

export async function blobUrlToFile(blobUrl, fileName) {
  if (blobUrl != null && blobUrl != '') {
    const response = await fetch(blobUrl)
    const blobData = await response.blob()

    // Create a new File object with the Blob data
    const file = new File([blobData], fileName, { type: blobData.type })

    return file
  } else {
    return new File()
  }
}

export function customToast({ theme, message, isSuccess, duration }) {
  return toast.success(message, {
    duration: duration || 3000,
    style: {
      padding: '16px',
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.primary.main}`
    },
    iconTheme: {
      primary: isSuccess ? theme.palette.primary.success : theme.palette.primary.error,
      secondary: theme.palette.primary.contrastText
    }
  })
}

export const handleResponse = (name, data, stateAction, deleteRow) => {
  if (data != null) {
    switch (name) {
      case 'create':
        if (data?.hasError) {
          customErrorToast(data.responseMessage)
        } else {
          customSuccessToast(data.responseMessage)
          stateAction(data.result)
        }
        break
      case 'update':
        if (data.hasError) {
          customErrorToast(data.responseMessage)
        } else {
          customSuccessToast(data.responseMessage)
          stateAction(data.result)
        }
        break
      case 'delete':
        if (data.hasError) {
          customErrorToast(data.responseMessage)
        } else {
          customSuccessToast(data.responseMessage)
          stateAction(deleteRow)
        }
        break

      default:
        break
    }
  }
}

export function ConvertHoursToTime(input) {
  const pattern = /^[0-9.:]+$/
  if (!pattern.test(input) || input == ':' || input == '.') {
    return '00:00'
  }
  if (typeof input === 'number') {
    // If input is a number, assume it's in decimal hours
    const hours = Math.floor(input)
    const minutes = Math.floor((input - hours) * 60)

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  } else if (typeof input === 'string') {
    // If input is a string, try to parse it as "hh:mm"
    const timeParts = input.split(':')
    if (timeParts.length === 2) {
      const hours = parseInt(timeParts[0], 10)
      const minutes = parseInt(timeParts[1], 10)
      if (!isNaN(hours) && !isNaN(minutes)) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      }
    } else {
      return '00:00'
    }
  }
}

// export function ConvertTimeStringToDecimal(timeString) {
//   // Split the time string into hours, minutes, and seconds
//   const [hours, minutes, seconds] = timeString.split(':').map(Number)

//   // Calculate the total hours as a decimal number
//   const totalHours = hours + minutes / 60 + seconds / 3600

//   return totalHours
// }

export function getWeekNumbers(day1, day2) {
  const getWeekNumber = day => {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]

    return daysOfWeek.indexOf(day)
  }

  const weekNumber1 = getWeekNumber(day1)
  const weekNumber2 = getWeekNumber(day2)

  return { start: weekNumber1, end: weekNumber2 }
}

export const getBase64String = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      resolve(reader.result)
    }

    reader.onerror = error => {
      reject(error)
    }
  })
}

export function base64ToFile(dataurl, fileName,mimeType="image/png",) {
  const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], fileName, { type: mime });
}

export function getCurrentMonthDates() {
  const currentDate = new Date()
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  return { startDate, endDate }
}

export function isInCurrentWeek(inputDate) {
  const currentDate = new Date()
  const currentWeekStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay()
  )
  const currentWeekEndDate = new Date(currentWeekStartDate)
  currentWeekEndDate.setDate(currentWeekEndDate.getDate() + 6)

  return (
    inputDate.getDate() >= currentWeekStartDate.getDate() &&
    inputDate.getDate() <= currentWeekEndDate.getDate()
  )
}

export function groupTimeSheetsByWeek(timesheets) {
  const groupedByWeek = {}

  if (timesheets?.length > 0) {
    timesheets.forEach(timesheet => {
      const date = new Date(timesheet?.timeSheetDate)
      const isCurrentWeek = isInCurrentWeek(date)
      const weekStartDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay()
      )
      const weekEndDate = new Date(weekStartDate)
      weekEndDate.setDate(weekEndDate.getDate() + 6)

      const formattedStartDate = weekStartDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })

      const formattedEndDate = weekEndDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })

      const startYear = formattedStartDate.split(',')
      const endYear = formattedEndDate.split(',')

      let weekKey = isCurrentWeek
        ? 'This Week'
        : startYear[1]?.trim() == endYear[1]?.trim()
        ? `${startYear[0]?.trim()}-${endYear[0]?.trim()},${endYear[1]?.trim()}`
        : `${formattedStartDate} - ${formattedEndDate}`

      if (!groupedByWeek[weekKey]) {
        groupedByWeek[weekKey] = []
      }

      groupedByWeek[weekKey].push(timesheet)
    })
  }

  return groupedByWeek
}

export const getCurrentWeekStartEndDate = () => {
  const currentDate = new Date()
  const currentDay = currentDate.getDay() // 0 is Sunday, 1 is Monday, ..., 6 is Saturday

  const startDate = new Date(currentDate)
  startDate.setDate(currentDate.getDate() - currentDay) // Move to the start of the week (Sunday)

  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6) // Move to the end of the week (Saturday)

  return { startDate, endDate }
}

export function calculateTotalBurnedHours(timesheets) {
  // Extract the hours, minutes, and seconds from each burnedHours
  const timeComponents = timesheets.map(timesheet => timesheet?.burnedHours?.split(':').map(Number))

  // Calculate the total hours, minutes, and seconds separately
  let totalHours = timeComponents?.reduce((sum, [hours]) => sum + hours, 0)
  let totalMinutes = timeComponents?.reduce((sum, [, minutes]) => sum + minutes, 0)
  let totalSeconds = timeComponents?.reduce((sum, [, , seconds]) => sum + seconds, 0)

  // Convert the total seconds to minutes and update the total minutes
  totalMinutes += Math.floor(totalSeconds / 60)
  totalSeconds %= 60

  // Convert the total minutes to hours and update the total hours
  totalHours += Math.floor(totalMinutes / 60)
  totalMinutes %= 60

  return `${totalHours}:${totalMinutes}`
}
