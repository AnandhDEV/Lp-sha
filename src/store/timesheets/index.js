import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

// ** Fetch Timesheets
export const fetchData = createAsyncThunk('appTimesheet/getTimeSheet', async params => {
  const response = await instance.get(endpoints.getTimesheetList)

  return response.data
})

// ** Fetch Task
export const fetchTaskData = createAsyncThunk('appTimesheet/getTaskData', async params => {
  const response = await instance.get(endpoints.getTask)

  return response.data
})

// ** Fetch Project List
export const fetchProjectData = createAsyncThunk('appTimesheet/getProjectData', async params => {
  const response = await instance.get(endpoints.getAssignedProjects)

  return response.data
})

export const fetchAssignedTask = createAsyncThunk(
  'appTimesheet/getAssignedTaskData',
  async params => {
    const response = await instance.get(endpoints.getTaskbyProject(params))

    return response.data
  }
)

export const fetchTimesheetExport = createAsyncThunk(
  'appTimesheet/getTimesheetExport',
  async params => {
    const response = await instance.get(endpoints.getTimesheetExport(params))

    return response.data
  }
)

export const TaskPerformance = createAsyncThunk('appTimesheet/taskPerformance', async params => {
  const response = await instance.get(endpoints.getTaskPerformance(params))

  return response.data
})

export const fetchAssignedProject = createAsyncThunk(
  'appTimesheet/getAssignedProjectData',
  async params => {
    const response = await instance.get(endpoints.getAssignedProject)

    return response.data
  }
)

//fect task for CurrentUser and projectId match
export const fetctTasksForProjectAndUserAssignee = createAsyncThunk(
  'appTimesheet/GetTasksForProjectAndUserAssignee',
  async params => {
    const response = await instance.get(endpoints.getTasksForProjectAndUserAssignee(params))

    return response.data
  }
)

export const fetchTimeSheetApprovals = createAsyncThunk(
  'appTimesheet/fetchTimeSheetApprovals',
  async params => {
    try {
      const response = await instance.get(endpoints.getTimeSheetApprovals(params))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const fetchName = createAsyncThunk('appTimesheet/fetchName', async params => {
  try {
    const response = await instance.get(
      endpoints.getName(params.type, params.startDate, params.endDate)
    )

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

// ** Post Data (POST)
export const postData = createAsyncThunk(
  'appTimesheet/postData',
  async (postData, { store, dispatch }) => {
    try {
      const response = await instance.post(endpoints.postTimesheetList, postData)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const postTsApproval = createAsyncThunk(
  'appTimesheet/postTsApproval',
  async (params, { store, dispatch }) => {
    try {
      const response = await instance.post(endpoints.postTimeSheetApproval, params)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

// ** Update Data (PUT)
export const UpdateData = createAsyncThunk(
  'appTimesheet/UpdateData',
  async (UpdateData, { store, dispatch }) => {
    try {
      const response = await instance.put(endpoints.putTimesheetList, UpdateData)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const putTsApproval = createAsyncThunk('appTimesheet/putTsApproval', async params => {
  try {
    const response = await instance.put(endpoints.putTimeSheetApproval, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const DeleteData = createAsyncThunk(
  'appTimesheet/deleteTimesheet',
  async (DeleteData, { store, dispatch }) => {
    try {
      const response = await instance.delete(endpoints.deleteTimesheetList(DeleteData))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

let date = new Date(),
  y = date.getFullYear(),
  m = date.getMonth()
let firstDay = new Date(y, m, 1)
let lastDay = new Date(y, m + 1, 0)

const initialState = {
  data: null,
  taskData: [],
  excelExport: '',
  taskPerformance: {},
  projectData: null,
  timeSheetApprovals: null,
  timeSheetApprovalsRowId: null,
  reportType: 'project',
  dateRange: {
    fromDate: firstDay,
    toDate: lastDay
  },
  selectedName: '',
  timesheetreports: [],
  tasksForProjectAndUserAssignee: [],
  isLoadingTimesheetApproval: false
}

export const appTimeSheetSlice = createSlice({
  name: 'appTimesheet',
  initialState: initialState,
  reducers: {
    resetTimeSheets: () => initialState,
    setTimeSheets: (state, { payload }) => {
      let sortedArray = payload?.sort((a, b) => {
        return new Date(b.timeSheetDate).getTime() - new Date(a.timeSheetDate).getTime()
      })
      state.data = sortedArray
    },
    setTimeSheetApprovals: (state, { payload }) => {
      state.timeSheetApprovals = payload
    },
    setTimeSheetApprovalsRowId: (state, { payload }) => {
      state.timeSheetApprovalsRowId = payload
    },
    setReportType: (state, { payload }) => {
      state.reportType = payload
    },
    setDateRange: (state, { payload }) => {
      state.dateRange = payload
    },
    setSelectedName: (state, { payload }) => {
      state.selectedName = payload
    },
    setTimesheetExport: (state, action) => {
      state.excelExport = action.payload
    },
    setTaskPerformance: (state, action) => {
      state.taskPerformance = action.payload
    },
    setIsLoadingTimesheetApproval: (state, action) => {
      state.isLoadingTimesheetApproval = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchTimeSheetApprovals.fulfilled, (state, action) => {
      state.timeSheetApprovals = action.payload?.result
    })
    builder.addCase(fetchName.fulfilled, (state, action) => {
      state.timesheetreports = action.payload?.result
    })
    builder.addCase(fetchTimesheetExport.fulfilled, (state, action) => {
      state.excelExport = action.payload?.result
    })
    builder.addCase(TaskPerformance.fulfilled, (state, action) => {
      state.taskPerformance = action.payload.result.map((item, index) => ({ ...item, id: index }))
    })
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        let sortedArray = action.payload.result?.sort((a, b) => {
          return new Date(b.timeSheetDate).getTime() - new Date(a.timeSheetDate).getTime()
        })
        state.data = sortedArray ?? []
      })
      .addCase(fetchAssignedTask.fulfilled, (state, action) => {
        state.taskData = action.payload.result?.tasksByCategory
      })
      .addCase(fetchAssignedProject.fulfilled, (state, action) => {
        state.projectData = action.payload.result
      })
      .addCase(fetctTasksForProjectAndUserAssignee.fulfilled, (state, action) => {
        // state.tasksForProjectAndUserAssignee = action.payload.result
        state.tasksForProjectAndUserAssignee = action.payload.result?.tasksByCategory
      })
  }
})

export const {
  setTimeSheets,
  setTimeSheetApprovals,
  resetTimeSheets,
  setReportType,
  setDateRange,
  setSelectedName,
  setTimesheetExport,
  setTaskPerformance,
  setTimeSheetApprovalsRowId,
  setIsLoadingTimesheetApproval
} = appTimeSheetSlice.actions
export default appTimeSheetSlice.reducer
