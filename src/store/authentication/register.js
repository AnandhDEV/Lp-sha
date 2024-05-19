// Import necessary dependencies from Redux Toolkit and Axios
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { baseURL, endpointURL, endpoints } from '../endpoints/endpoints'
import instance, { base, identifyURL } from '../endpoints/interceptor'

// Create a Redux-thunk action for signup
export const loginUser = createAsyncThunk('auth/loginUser', async params => {
  try {
    const response = await axios.post(base.url + endpoints.login, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async params => {
  try {
    const response = await axios.put(base.url + endpoints.forgotPasswordMail(params))
    
    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const resetForgotPassword = createAsyncThunk('auth/resetForgotPassword', async (params) => {
  try {
    const {base64String,pass}= params;
    const response = await axios.put(base.url + endpoints.setForgotPassword(base64String,pass))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})



export const signUpUser = createAsyncThunk('auth/signUpUser', async params => {
  try {
    const response = await axios.post(base.url + endpoints.tenant, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const UserInvite = createAsyncThunk('auth/UserInvite', async params => {
  try {
    const response = await axios.put(base.url + endpoints.userInvite, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

const getRoleInitialState = () => {
  if (typeof window !== 'undefined') {
    return Number(localStorage.getItem('roleId'))
  } else {
    return 4
  }
}

const initialState = {
  role: getRoleInitialState(),
  isUser: true,
  user: null,
  error: null,
  isLoading: false
}

// Create a slice for authentication
export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setRole: (state, { payload }) => {
      state.role = payload
      state.isUser = payload == 4
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.error = null
      state.isLoading = false
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    setLoading: state => {
      state.isLoading = true
    }
  },
  extraReducers: builder => {
    builder
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.user = action.payload.result
        state.error = null
        state.isLoading = false
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.error = action.error.message
        state.isLoading = false
      })
  }
})

export const { setRole, setUser, setError, setLoading } = authSlice.actions

export default authSlice.reducer
