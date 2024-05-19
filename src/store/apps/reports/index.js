import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

// ** Fetch Users

export const fetchUserReports = createAsyncThunk('reportSlice/fetchUserReports', async params => {
  const response = await instance.get(
    endpoints.getUserTimesheetReports(params.id, params.startDate, params.endDate)
  )

  return response.data.result
})

export const fetchProjectReports = createAsyncThunk(
  'reportSlice/fetchProjectReports',
  async params => {
    if (params) {
      const response = await instance.get(
        endpoints.getProjectTimesheetReports(params.id, params.startDate, params.endDate)
      )

      return response.data.result
    } else return []
  }
)

export const fetchClientReports = createAsyncThunk(
  'reportSlice/fetchClientReports',
  async params => {
    if (params) {
      const response = await instance.get(
        endpoints.getClientTimesheetReports(params.id, params.startDate, params.endDate)
      )

      return response.data.result
    } else return []
  }
)

export const fetchUserData = createAsyncThunk('reportSlice/fetchUserData', async params => {
  const response = await instance.get(endpoints.allUsers)

  return response.data
})

export const fetchClient = createAsyncThunk('reportSlice/fetchClient', async params => {
  const response = await instance.get(endpoints.getAllClient)

  return response.data
})

export const fetchProject = createAsyncThunk('reportSlice/fetchProject', async params => {
  const response = await instance.get(endpoints.getAllProjects)

  return response.data
})

export const fetchEmployee = createAsyncThunk('reportSlice/fetchEmployee', async params => {
  const response = await instance.get(endpoints.getEmployeeReports(params))

  return response.data
})

//project management reports by id
export const fetchBurnedCost = createAsyncThunk('projects/GetBurnedCostPercentage', async parms => {
  try {
    const response = await instance.get(endpoints.getBurnedCostReport(parms))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const fetchTaskProgress = createAsyncThunk(
  'projects/GetTaskProgressPercentage',
  async parms => {
    try {
      const response = await instance.get(endpoints.getTaskProgressReport(parms))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const fetchTaskCompletionRate = createAsyncThunk(
  'projects/GetTaskCompletionRate',
  async parms => {
    try {
      const response = await instance.get(endpoints.getTaskCompletionRate(parms))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const fetchGetTimeSheetUser = createAsyncThunk('projects/GetTimeSheetUser', async parms => {
  try {
    const response = await instance.get(endpoints.getTimesheetUser)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const fetchProjectProfitReport = createAsyncThunk(
  'projects/GetProjectProfit',
  async parms => {
    try {
      const response = await instance.get(endpoints.getProjectProfitCost(parms))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const fetchPendingTaskPriorityReport = createAsyncThunk(
  'projects/GetPendingTaskPriority',
  async parms => {
    try {
      const response = await instance.get(endpoints.getPendingTaskPriority(parms))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const fetchTaskStatusCountReport = createAsyncThunk(
  'projects/GetProjectTaskCount',
  async parms => {
    try {
      const response = await instance.get(endpoints.getTaskStatusCount(parms))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const fetchTaskProgressGraphReport = createAsyncThunk(
  'projects/GetTaskProgressGraphData',
  async parms => {
    try {
      const response = await instance.get(endpoints.getGraphDataForTaskProgress(parms))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const fetchResourceUtilizationCostReport = createAsyncThunk(
  'projects/GetResourceUtilizationCost',
  async parms => {
    try {
      const response = await instance.get(endpoints.getResourceUtilizationCost(parms))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const fetcTaskEfficiencyIndexReport = createAsyncThunk(
  'projects/GetTaskEfficiencyIndex',
  async parms => {
    try {
      const response = await instance.get(endpoints.getTaskEfficiencyIndexPercentage(parms))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const fetchResourceUtilizationReport = createAsyncThunk(
  'projects/GetResourceUtilizationRate',
  async parms => {
    try {
      const response = await instance.get(endpoints.getResourceUtilizationRate(parms))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

const initialState = {
  //NUMBES
  billableHours: 0,
  nonBillableHours: 0,

  //STRINGS
  groupByValue: 'User',
  selectedClient: '',
  selectedUser: '',
  selectedProject: '',

  //LISTS
  users: [],
  projects: [],
  clients: [],
  userReports: [],
  projectReports: [],
  clientReports: [],
  dateRanges: [],

  // OBJECTS
  period: {},
  selectedRow: null,

  //GET STATES
  userResponse: [],
  allUsers: [],
  clientResponse: [],
  projectResponse: [],
  burnedCost: [],
  taskProgressPercentage: null,
  taskCompletionRatePercentage: [],
  projectProfitAndRate: [],
  pendingTaskPriorityResponse: [],
  taskStatusCount: [],
  taskProgressGraph: [],
  resourceUtilizationCost: [],
  taskEfficiencyIndexPercentage: [],
  resourceUtilizationPercentage: [],
  getTimesheetUsers:[]
}

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    saveBillables: ({ billableHours, nonBillableHours }, { payload }) => {
      billableHours = payload.BillableCost
      nonBillableHours = payload.nonBillableCost
    },
    setGroupByValue: (state, action) => {
      state.groupByValue = action.payload
    },
    setReportUsers: (state, { payload }) => {
      state.users = payload
    },
    setReportProjects: (state, { payload }) => {
      state.projects = payload
    },
    setReportClients: (state, { payload }) => {
      state.clients = payload
    },
    setPeriodRange: (state, { payload }) => {
      state.period.startDate = payload?.startDate && payload.startDate
      state.period.endDate = payload?.endDate && payload.endDate
    },
    setSelectedRowData: (state, { payload }) => {
      state.selectedRow = payload
    },
    setSelectedClient: (state, { payload }) => {
      state.selectedClient = payload
    },
    setSelectedUser: (state, { payload }) => {
      state.selectedUser = payload
    },
    setSelectedProject: (state, { payload }) => {
      state.selectedProject = payload
    },
    setDateRanges: (state, { payload }) => {
      state.dateRanges = payload
    },

    // REPORTS
    setUserReports: (state, { payload }) => {
      state.userReports = payload
    },
    setClientReports: (state, { payload }) => {
      state.clientReports = payload
    },
    setProjectReports: (state, { payload }) => {
      state.projectReports = payload
    },
    setGetTimesheetUsers: (state, {payload})=>{
      state.getTimesheetUsers=payload?.result
    },

    //projectmanagement reports by id
    setBurnedCostReport: (state, { payload }) => {
      state.burnedCost = payload
    },
    setTaskProgressReport: (state, { payload }) => {
      state.taskProgressPercentage = payload
    },
    setTaskCpmpletionRate: (state, { payload }) => {
      state.taskCompletionRatePercentage = payload
    },
    setProjectProfitAndRate: (state, { payload }) => {
      state.projectProfitAndRate = payload
    },
    setPendingTaskPriority: (state, { payload }) => {
      state.pendingTaskPriorityResponse = payload
    },
    setTaskStatusCount: (state, { payload }) => {
      state.taskStatusCount = payload
    },
    setTaskProgressGraph: (state, { payload }) => {
      state.taskProgressGraph = payload
    },
    setResourceUtlizationCost: (state, { payload }) => {
      state.resourceUtilizationCost = payload
    },
    setTaskEfficiencyIndex: (state, { payload }) => {
      state.taskEfficiencyIndexPercentage = payload
    },
    setResourceUtilizationRate: (state, { payload }) => {
      state.resourceUtilizationPercentage = payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.allUsers = action.payload
    })
    builder.addCase(fetchUserReports.fulfilled, (state, action) => {
      state.userReports = action.payload
    })
    builder.addCase(fetchGetTimeSheetUser.fulfilled, (state, action)=>{
      state.getTimesheetUsers = action.payload?.result
    })

    builder.addCase(fetchClientReports.fulfilled, (state, action) => {
      state.clientReports = action.payload
    })
    builder.addCase(fetchProjectReports.fulfilled, (state, action) => {
      state.projectReports = action.payload
    })
    builder.addCase(fetchBurnedCost.fulfilled, (state, action) => {
      state.burnedCost = action.payload.result
    })
    builder.addCase(fetchTaskProgress.fulfilled, (state, action) => {
      state.taskProgressPercentage = action.payload.result
    })
    builder.addCase(fetchTaskCompletionRate.fulfilled, (state, action) => {
      state.taskCompletionRatePercentage = action.payload.result
    })
    builder.addCase(fetchProjectProfitReport.fulfilled, (state, action) => {
      state.projectProfitAndRate = action.payload.result
    })
    builder.addCase(fetchPendingTaskPriorityReport.fulfilled, (state, action) => {
      state.pendingTaskPriorityResponse = action.payload.result
    })
    builder.addCase(fetchTaskProgressGraphReport.fulfilled, (state, action) => {
      state.taskProgressGraph = action.payload.result
    })
    builder.addCase(fetchTaskStatusCountReport.fulfilled, (state, action) => {
      state.taskStatusCount = action.payload.result
    })
    builder.addCase(fetchResourceUtilizationCostReport.fulfilled, (state, action) => {
      state.resourceUtilizationCost = action.payload.result
    })
    builder.addCase(fetcTaskEfficiencyIndexReport.fulfilled, (state, action) => {
      state.taskEfficiencyIndexPercentage = action.payload.result
    })
    builder.addCase(fetchResourceUtilizationReport.fulfilled, (state, action) => {
      state.resourceUtilizationPercentage = action.payload.result
    })
  }
})

// builder.addCase(fetchResourceUtilizationCostReport.fulfilled,(state,action) =>{
//   state.resourceUtilizationCost = action.payload.result
// })
//projectmanagement by id
// builder.addCase(fetchBurnedCost.fulfilled, (state, action) => {
//   state.fetchBurnedCost = action.payload?.result
// })

// export actions
export const {
  saveBillables,
  setGroupByValue,
  setReportUsers,
  setReportProjects,
  setReportClients,
  setPeriodRange,
  setSelectedRowData,
  setSelectedClient,
  setSelectedUser,
  setSelectedProject,
  setUserReports,
  setClientReports,
  setProjectReports,
  setBurnedCostReport,
  setDateRanges,
  setTaskProgressReport,
  setTaskCpmpletionRate,
  setProjectProfitAndRate,
  setPendingTaskPriority,
  setTaskStatusCount,
  setTaskProgressGraph,
  setResourceUtlizationCost,
  setGetTimesheetUsers
} = reportSlice.actions

// export reducer it-self
export default reportSlice.reducer
