import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

// ** Axios Imports
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

//fetch
export const fetchMyLeaves = createAsyncThunk('fetchMyLeaves/LeaveRequest', async params => {
  try {
    const response = await instance.get(endpoints.myLeaves)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const fetchPolicies = createAsyncThunk('fetchPolicy/LeavePolicy', async params => {
  try {
    const response = await instance.get(endpoints.getLeavePolicy)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const fetchStatus = createAsyncThunk('fetchStatus/Status', async params => {
  try {
    const response = await instance.get(endpoints.getStatus)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const fetchRequests = createAsyncThunk('fetchRequestTypes/RequestTypes', async params => {
  try {
    const response = await instance.get(endpoints.requests)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const fetchUsers = createAsyncThunk('fetchUsers/users', async params => {
  try {
    const response = await instance.get(endpoints.allUsers)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const fetchApprovals = createAsyncThunk('fetchApprovals/Approvals', async params => {
  try {
    const response = await instance.get(endpoints.getApprovals)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const fetchUserReports = createAsyncThunk(
  'fetchUserReports/Reports',
  async ({ userId, fromDate, toDate }) => {
    try {
      const response = await instance.get(endpoints.getUserReports(userId, fromDate, toDate))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const fetchDashboard = createAsyncThunk('fetchDashboard/Reports', async params => {
  try {
    const response = await instance.get(endpoints.getDashboard(params))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

//post
export const postLeaveRequest = createAsyncThunk('postLeaveRequest/LeaveRequest', async params => {
  try {
    const response = await instance.post(endpoints.myLeaves, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const BulkLeaveRequest = createAsyncThunk('LeaveRequest/BulkLeaveRequest', async params => {
  try {
    const response = await instance.post(endpoints.createBulkLeave, params, {
    })

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const postLeaveApproval = createAsyncThunk('postApproval/LeaveApproval', async params => {
  try {
    const response = await instance.post(endpoints.createApproval, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const postPolicy = createAsyncThunk('postPolicy/LeavePolicy', async params => {
  try {
    const response = await instance.post(endpoints.createLeavePolicy, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

//put
export const putRequest = createAsyncThunk('putRequest/LeaveRequest', async params => {
  try {
    const response = await instance.put(endpoints.myLeaves, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const putPolicy = createAsyncThunk('putPolicy/LeavePolicy', async params => {
  try {
    const response = await instance.put(endpoints.updateLeavePolicy, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const putRequestApproval = createAsyncThunk(
  'putRequestApproval/LeaveApproval',
  async params => {
    try {
      const response = await instance.put(endpoints.updateApproval, params)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

//delete
export const deleteRequest = createAsyncThunk('deleteRequest/LeaveRequest', async params => {
  try {
    const response = await instance.delete(endpoints.deleteRequest(params))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const deletePolicy = createAsyncThunk('deletePolicy/LeavePolicy', async params => {
  try {
    const response = await instance.delete(endpoints.deleteLeavePolicy(params))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

const initialStates = {
  myLeaves: null,
  requestTypes: [],
  policies: null,
  statuses: [],
  users: null,
  approvals: null,
  reports: null,
  dashboards: null
}

export const LeaveManagement = createSlice({
  name: 'leaveManagement',
  initialState: initialStates,
  reducers: {
    resetLeaves: () => initialStates,
    resetReport: (state, { payload }) => {
      state.reports = payload
    },
    setPolicies: (state, { payload }) => {
      state.policies = payload
    },
    setApprovals: (state, { payload }) => {
      state.approvals = payload
    },
    setMyleaves: (state, { payload }) => {
      state.myLeaves = payload
    },
    setDashboards: (state, { payload }) => {
      state.dashboards = payload
    },

    setLeaveApproval: (state, action) => {
      state.approvals = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchMyLeaves.fulfilled, (state, action) => {
      let sortedArray = action.payload.result?.sort((a, b) => {
        return new Date(b.fromDate).getTime() - new Date(a.toDate).getTime()
      })
      state.myLeaves = sortedArray
    })
    builder.addCase(fetchRequests.fulfilled, (state, action) => {
      state.requestTypes = action.payload?.result
    })
    builder.addCase(fetchPolicies.fulfilled, (state, action) => {
      state.policies = action.payload?.result
    })
    builder.addCase(fetchStatus.fulfilled, (state, action) => {
      state.statuses = action.payload?.result
    })
    builder.addCase(fetchApprovals.fulfilled, (state, action) => {
      const approvals = action.payload?.result ? [...action.payload?.result] : []
      const _approvals = []
      approvals?.forEach(approval => {
        _approvals.push({
          ...approval,
          leaveRequestApprovalId: approval.requestApprovals.id,
          userId: approval.submittedUserDetails.userId,
          userName: approval.submittedUserDetails.username,
          email: approval.submittedUserDetails.email,
          request: approval.requestTypeName,
          comment: approval.requestApprovals.comment,
          requestStatusId: approval.requestApprovals.statusId,
          status: approval.requestApprovals.status
        })
      })
      let sortedArray =
        _approvals.length > 0
          ? _approvals.sort((a, b) => {
            return new Date(b.fromDate).getTime() - new Date(a.toDate).getTime()
          })
          : []

      state.approvals = sortedArray
    })
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      const users = action.payload?.result ? [...action.payload.result] : []
      users.map(u => {
        u.fullName = `${u.firstName} ${u.lastName}`
      })
      state.users = users
    })
    builder.addCase(fetchUserReports.fulfilled, (state, action) => {
      const reports = action.payload?.result ? [...action.payload?.result] : []

      let sortedArray =
        reports.length > 0
          ? reports.sort((a, b) => {
            return new Date(a.fromDate) - new Date(b.toDate)
          })
          : []
      state.reports = sortedArray
    })
    builder.addCase(fetchDashboard.fulfilled, (state, action) => {
      const dashboards = action.payload?.result ? [...action.payload.result] : []
      dashboards?.map((report, i) => {
        report.id = i
      })
      state.dashboards = dashboards
    })
  }
})

export const {
  resetLeaves,
  setLeaveApproval,
  resetReport,
  setPolicies,
  setApprovals,
  setDashboards,
  setMyleaves
} = LeaveManagement.actions

export default LeaveManagement.reducer
