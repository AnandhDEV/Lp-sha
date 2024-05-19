import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

// export const fetchData = createAsyncThunk()

export const fetchData = createAsyncThunk('appOrg/fetchData', async params => {
  try {
    const response = await instance.get(endpoints.getOrganizationSetup)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const addOrgs = createAsyncThunk('appOrg/addOrgs', async (data, { getState, dispatch }) => {
  try {
    const response = await instance.post(endpoints.addOrganizationSetup, data)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const updateOrgs = createAsyncThunk(
  'appOrg/updateOrgs',
  async (data, { getState, dispatch }) => {
    try {
      const response = await instance.post(endpoints.updateOrganizationSetup, data)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
    dispatch(fetchData(getState().client.params))
  }
)

export const deleteOrg = createAsyncThunk(
  'appOrg/deleteOrg',
  async (id, { getState, dispatch }) => {
    try {
      const response = await instance.delete(endpointURL(endpoints.deletClient), {
        data: id,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      dispatch(fetchData(getState().client.params))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const appOrgSlice = createSlice({
  name: 'appOrg',
  initialState: {
    data: [],

    // total: 1,
    // params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload

      // state.total = action.payload.total
      // state.params = action.payload.params
      state.allData = action.payload
    })
  }
})

export default appOrgSlice.reducer
