import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

import toast from 'react-hot-toast'

// ** Fetch Hoildays
export const fetchHolidays = createAsyncThunk(
  '/account-settings/holidaymanagement/getHoliday',
  async params => {
    const response = await instance.get(endpoints.getHolidayRequests)

    return response.data
  }
)

// ** Add Holiday
export const addHoliday = createAsyncThunk(
  '/account-settings/holidaymanagement/addHoliday',
  async (event, { dispatch }) => {
    try {
      const response = await instance.post(endpoints.addHolidayRequests, event)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

// ** Update Holiday
export const updateHoliday = createAsyncThunk(
  '/account-settings/holidaymanagement/updateHoliday',
  async (event, { dispatch }) => {
    try {
      const response = await instance.put(endpoints.updateHolidayRequests, event)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

// ** Delete Holiday
export const deleteHoliday = createAsyncThunk(
  '/account-settings/holidaymanagement/deleteHoliday',
  async (event, { dispatch }) => {
    try {
      const response = await instance.delete(endpoints.deleteHolidayRequests, { data: event })

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const appAccountSettingsSlice = createSlice({
  name: 'appAccountSettings',
  initialState: {
    holidays: null,
    taskData: [],
    projectData: []
  },
  reducers: {
    setHolidays: (state, { payload }) => {
      state.holidays = payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchHolidays.fulfilled, (state, action) => {
      let sortedArray =
        action.payload != null
          ? action.payload.result.sort((a, b) => {
              return new Date(a.date) - new Date(b.date)
            })
          : []
      state.holidays = sortedArray
    })
  }
})

export const { setHolidays } = appAccountSettingsSlice.actions
export default appAccountSettingsSlice.reducer
