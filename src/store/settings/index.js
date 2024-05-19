import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'
import { fetchDepartment, fetchRequiredSkills } from '../apps/projects'

export const fetchConfig = createAsyncThunk('appConfig/fetchConfig', async params => {
  try {
    const response = await instance.get(endpoints.getConfig)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const fetchProjectStatus = createAsyncThunk('appConfig/fetchProjectStatus', async params => {
  try {
    const response = await instance.get(endpoints.getProjectStatus)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const fetchHRApprovals = createAsyncThunk('appConfig/fetchHRApprovals', async params => {
  const response = await instance.get(endpoints.HRApprovals)

  return response.data
})

//** Add Configuration */
export const addConfig = createAsyncThunk(
  'appConfig/addConfig',
  async (data, { getState, dispatch }) => {
    try {
      const response = await instance.post(endpoints.createConfig, data)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const postProjectStatus = createAsyncThunk('appConfig/postProjectStatus', async params => {
  try {
    const response = await instance.post(endpoints.postProjectStatus, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const putProjectStatus = createAsyncThunk('appConfig/putProjectStatus', async params => {
  try {
    const response = await instance.put(endpoints.putProjectStatus, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const deleteProjectStatus = createAsyncThunk(
  'appConfig/deleteProjectStatus',
  async params => {
    try {
      const response = await instance.delete(endpoints.deleteProjectStatus(params))

      return {
        res: response.data,
        id: params
      }
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const postHRApproval = createAsyncThunk(
  'appConfig/postHRApproval',
  async (data, { getState, dispatch }) => {
    try {
      const response = await instance.post(endpoints.HRApprovals, data)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)


export const postDepartment = createAsyncThunk('appConfig/postDepartment', async params => {
  try {
    const response = await instance.post(endpoints.department, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})


export const putDepartment = createAsyncThunk('appConfig/putDepartment', async params => {
  try {
    const response = await instance.put(endpoints.department, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})


export const deleteDepartment = createAsyncThunk(
  'appConfig/deleteDepartment',
  async params => {
    try {
      const response = await instance.delete(endpoints.deleteDepartment(params))

      return {
        res: response.data,
        id: params
      }
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const postSkill = createAsyncThunk('appConfig/postSkill', async params => {
  try {
    const response = await instance.post(endpoints.skills, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

//** Update Configuration */
export const putSkill = createAsyncThunk('appConfig/putSkill', async params => {
  try {
    const response = await instance.put(endpoints.skills, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const putConfig = createAsyncThunk(
  'appConfig/putConfig',
  async (data, { getState, dispatch }) => {
    try {
      const response = await instance.put(endpoints.updateConfig, data)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const fetchOrgHrApprove = createAsyncThunk('appConfig/fetchOrgHrApprove', async params => {
  const response = await instance.get(endpoints.OrgLeaveHrApproval)

  return response.data
})

export const addOrgHrApprove = createAsyncThunk(
  'appConfig/addOrgHrApprove',
  async (data, { getState, dispatch }) => {
    const response = await instance.post(endpoints.OrgLeaveHrApproval, data)
    dispatch(fetchOrgHrApprove())

    return response
  }
)
//** Delete Configuration */


export const deleteSkill = createAsyncThunk(
  'appConfig/deleteSkill',
  async params => {
    try {
      const response = await instance.delete(endpoints.deleteSkill(params))

      return {
        res: response.data,
        id: params
      }
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)



export const deleteHRApproval = createAsyncThunk(
  'appConfig/deleteHRApproval',
  async (data, { getState, dispatch }) => {
    try {
      const response = await instance.delete(endpoints.deleteHRApproval, { data: data })

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const appConfigSlice = createSlice({
  name: 'settings',
  initialState: {
    configuration: null,
    OrgHrApprove: {},
    HrApprovals: null,
    ProjectStatus: null,
    editProjectStatus: false,
    editDepartment: false,
    department: [],
    skills: []
  },
  reducers: {
    setConfigs: (state, { payload }) => {
      state.configuration = payload
    },
    setProjectStatus: (state, { payload }) => {
      state.ProjectStatus = payload
    },
    setDepartment: (state, { payload }) => {
      state.department = payload
    },
    setSkills: (state, { payload }) => {
      state.skills = payload
    },
    setEditDepartment: (state, { payload }) => {
      state.editDepartment = payload
    },
    setHRApprovals: (state, { payload }) => {
      state.HrApprovals = payload
    },
    setEditProjectStatus: (state, { payload }) => {
      state.editProjectStatus = payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchConfig.fulfilled, (state, action) => {
      state.configuration = action.payload?.result
      state.HrApprovals = action.payload.result?.organizationLeaveHRApprovals
    })
    builder.addCase(putProjectStatus.fulfilled, (state, action) => {
      state.ProjectStatus =
        state.ProjectStatus.map(x =>
          x.id === action.payload.result.id ? action.payload.result : x
        ) || []
    })
    builder.addCase(postProjectStatus.fulfilled, (state, action) => {
      state.ProjectStatus = [...state.ProjectStatus, action.payload.result]
    })
    builder.addCase(postDepartment.fulfilled, (state, action) => {
      state.department = [...state.department, action.payload.result]
    })


    builder.addCase(putDepartment.fulfilled, (state, action) => {
      state.department =
        state.department.map(x =>
          x.id === action.payload.result.id ? action.payload.result : x
        ) || []
    })

    builder.addCase(deleteDepartment.fulfilled, (state, action) => {
      state.department = state.department.filter(item => item.id !== action.payload.id)
    })

    builder.addCase(postSkill.fulfilled, (state, action) => {
      state.skills = [...state.skills, action.payload.result]
    })
    builder.addCase(putSkill.fulfilled, (state, action) => {
      state.skills =
        state.skills.map(x =>
          x.id === action.payload.result?.id ? action.payload.result : x
        ) || []
    })

    builder.addCase(deleteSkill.fulfilled, (state, action) => {
      state.skills = state.skills.filter(item => item.id !== action.payload.id)
    })

    builder.addCase(fetchProjectStatus.fulfilled, (state, action) => {
      state.ProjectStatus = action.payload.result
    })

    builder.addCase(fetchOrgHrApprove.fulfilled, (state, action) => {
      state.OrgHrApprove = action.payload
    })
    builder.addCase(fetchHRApprovals.fulfilled, (state, action) => {
      state.HrApprovals = action.payload.result
    })
    builder.addCase(deleteProjectStatus.fulfilled, (state, action) => {
      state.ProjectStatus = state.ProjectStatus.filter(item => item.id !== action.payload.id)
    })
  }
})
export const { setConfigs, setHRApprovals, setProjectStatus, setEditProjectStatus, setEditDepartment, setDepartment, setSkills } =
  appConfigSlice.actions

export default appConfigSlice.reducer
