import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

// export const fetchData = createAsyncThunk()

export const fetchClients = createAsyncThunk('appClient/fetchClients', async params => {
  try {
    const response = await instance.get(endpoints.getAllClient)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const fetchClientById = createAsyncThunk('appClient/fetchClientById', async params => {
  try {
    const response = await instance.get(endpoints.clientById(params))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const addClients = createAsyncThunk('appClient/addClients', async params => {
  try {
    const { profilePhoto } = params
    const formData = new FormData()
    formData.append('ProfilePhoto', profilePhoto)
    const response = await instance.post(endpoints.addClient(params), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const updateClient = createAsyncThunk('appClient/updateClient', async data => {
  try {
    const { profilePhoto } = data
    const formData = new FormData()
    formData.append('ProfilePhoto', profilePhoto)
    const response = await instance.put(endpoints.updateClient(data), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const deleteClient = createAsyncThunk(
  'appClient/deleteClient',
  async (id, { getState, dispatch }) => {
    try {
      const response = await instance.delete(endpoints.deleteClient(id))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const appClientSlice = createSlice({
  name: 'appClient',
  initialState: {
    clients: null,
    allData: [],
    client: {}
  },
  reducers: {
    setClients: (state, { payload }) => {
      state.clients = payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchClients.fulfilled, (state, action) => {
      state.clients = action.payload.result
    })
    builder.addCase(addClients.fulfilled, (state, action) => {
      state.clients = state.clients
        ? [...state.clients, action.payload.result]
        : action.payload.result
    })
    builder.addCase(updateClient.fulfilled, (state, action) => {
      state.clients =
        state.clients?.map(x => (x.id === action.payload.result.id ? action.payload.result : x)) ||
        []
    })
    builder.addCase(fetchClientById.fulfilled, (state, action) => {
      state.client = action.payload
    })
  }
})

export const { setClients } = appClientSlice.actions

export default appClientSlice.reducer
