import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance, { getMethod } from 'src/store/endpoints/interceptor'

// ** Fetch Invoices
export const fetchData = createAsyncThunk('appInvoice/fetchData', async () => {
  const response = await instance.get(endpoints.getInvoiceAll)

  return response.data
})

export const deleteInvoice = createAsyncThunk('appInvoice/deleteData', async (id, { getState, dispatch }) => {
  const response = await instance.delete('/apps/invoice/delete', {
    data: id
  })
  await dispatch(fetchData(getState().invoice.params))

  return response.data
})

export const getProjectforInvoice = createAsyncThunk('appInvoice/getProjects', async params => {
  const response = await instance.get(endpoints.getAllProjects)

  return response.data
})

export const getInvoiceDetails = createAsyncThunk(
  'appInvoice/getInvoiceDetails',
  async (item, { getState, dispatch }) => {
    const response = await instance.get(endpoints.getInvoiceDetails(item.projectId, item.month, item.year))

    return { data: response.data, ispreview: item.preview }
  }
)


export const appInvoiceSlice = createSlice({
  name: 'appInvoice',
  initialState: {
    data: [],
    projects: [],
    invoiceDetails: null,
    selectedProject: '',
    selectedClient: '',
    loader: false,
    previewDetails: {}
  },
  reducers: {
    setSelectedProject(state, action) {
      state.selectedProject = action.payload
    },
    setSelectedClient(state, action) {
      state.selectedClient = action.payload
    },
    reset(state, action) {
      state.selectedProject = ""
      state.invoiceDetails = null
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        state.data = action.payload
      })
      .addCase(getProjectforInvoice.fulfilled, (state, action) => {
        state.projects = action.payload
      })

      .addCase(getInvoiceDetails.fulfilled, (state, action) => {
        if (action.payload.ispreview) {
          state.previewDetails = action.payload.data
        } else {
          state.invoiceDetails = action.payload.data
        }
        state.loader = false
      })
      .addCase(getInvoiceDetails.pending, (state, action) => {
        state.loader = true
      })
  }
})

export const { setSelectedProject, setSelectedClient, reset } = appInvoiceSlice.actions

export default appInvoiceSlice.reducer
