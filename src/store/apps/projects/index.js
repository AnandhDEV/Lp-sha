import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import { fetchData } from '../user'
import instance from 'src/store/endpoints/interceptor'
import { parseMarker } from '@fullcalendar/core/internal'
import toast from 'react-hot-toast'
import { formatLocalDate } from 'src/helpers/dateFormats'
import { FEEDBACKS, NODATA } from 'src/helpers/constants'
import jwt from 'jsonwebtoken'

// ** Fetch Reports
export const fetchClients = createAsyncThunk('projects/fetchClients', async params => {
  const response = await instance.get(endpoints.getAllClient)

  return response.data
})

export const fetchGetOnlyClientName = createAsyncThunk('projects/fetchGetOnlyClientName ', async params => {
  const response = await instance.get(endpoints.getOnlyClientName)

  return response.data
})

//** fetch projects */
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async params => {
  const response = await instance.get(endpoints.getProjects)

  return response.data
})

export const fetchProjectById = createAsyncThunk('projects/fetchProjectById', async id => {
  try {
    const response = await instance.get(endpoints.getProjectById(id))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

//** fetch users */
export const fetchUsers = createAsyncThunk('projects/fetchUsers', async params => {
  const response = await instance.get(endpoints.allUsers)

  return response.data
})

//** fetch users */
export const fetchProjectsByUser = createAsyncThunk(
  'projects/fetchProjectsByUser',
  async params => {
    const response = await instance.get(endpoints.projectByUserId(params))

    return response.data
  }
)

export const fetchProjectAssignees = createAsyncThunk(
  'projects/fetchProjectAssignees',
  async params => {
    const response = await instance.get(endpoints.projectAssignees)

    return response.data
  }
)

export const fetchTaskType = createAsyncThunk('projects/fetchTaskType', async params => {
  const response = await instance.get(endpoints.getTaskType)

  return response.data
})

export const postTask = createAsyncThunk('projects/postTask', async params => {
  try {
    const response = await instance.post(endpoints.postTask, params, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

//Bulk Task Create
export const bulkTaskCreate = createAsyncThunk('projects/bulkTaskCreate', async params => {
  try {
    const response = await instance.post(endpoints.bulkTaskCreate, params, {
    })

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})



//** fetch categories */
export const fetchCategories = createAsyncThunk('projects/fetchCategories', async params => {
  const response = await instance.get(endpoints.taskCategories)

  return response.data
})

//** fetch tasks */
export const fetchTasks = createAsyncThunk('projects/fetchTasks', async params => {
  const response = await instance.get(endpoints.getTaskList(params))

  return response.data
})

export const fetchMileStones = createAsyncThunk('projects/fetchMileStones', async params => {
  const response = await instance.get(endpoints.mileStoneById(params))

  return response.data
})

export const fetchRequiredSkills = createAsyncThunk(
  'projects/fetchRequiredSkills',
  async params => {
    try {
      const response = await instance.get(endpoints.skills)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const fetchSkills = createAsyncThunk('fetchSkills/Skills', async params => {
  try {
    const response = await instance.get(endpoints.skills)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

//** fetch tasks */
export const fetchProjectsReport = createAsyncThunk('projects/fetchProjectsReport', async id => {
  try {
    const response = await instance.get(endpoints.getProjectReportsDetails(id))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const fetchProjectMembers = createAsyncThunk(
  'projects/fetchProjectMembers',
  async params => {
    try {
      const response = await instance.get(endpoints.projectMembers(params))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const fetchExpenses = createAsyncThunk('projects/fetchExpenses', async id => {
  try {
    const response = await instance.get(endpoints.getExpenseById(id))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

//**Files */
export const fetchProjectFiles = createAsyncThunk('projects/fetchProjectFiles', async id => {
  try {
    const response = await instance.get(endpoints.files(id))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const postFiles = createAsyncThunk('projects/postFiles', async params => {
  try {
    const { projectId, files } = params
    const formData = new FormData()
    await files.forEach((file, index) => {
      formData.append('Files', file)
    })
    const response = await instance.post(endpoints.files(projectId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const deleteFile = createAsyncThunk('projects/deleteFile', async id => {
  try {
    const response = await instance.delete(endpoints.deleteFile(id))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})
//POST
export const postProject = createAsyncThunk('projects/postProject', async params => {
  try {
    const response = await instance.post(endpoints.projects, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const postCategory = createAsyncThunk('projects/postCategory', async params => {
  const response = await instance.post(endpoints.createCategory, params)

  return response.data
})

export const postMileStone = createAsyncThunk('projects/postMileStone', async params => {
  const response = await instance.post(endpoints.mileStones, params)

  //dispatch(fetchMileStones(localStorage.getItem('projectId')))
  return response
})

export const postAssignee = createAsyncThunk('projects/postAssignee', async params => {
  try {
    const response = await instance.post(endpoints.projectAssignees, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const postExpenses = createAsyncThunk('projects/postExpenses', async params => {
  try {
    const response = await instance.post(endpoints.expenses, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})
//PUT
export const putProject = createAsyncThunk('projects/putProject', async params => {
  try {
    const response = await instance.put(endpoints.projects, params)

    return response.data
  } catch (error) {
    toast.error(NODATA.error, { duration: 3000, position: 'top-right' })

    return error
  }
})

export const editCategory = createAsyncThunk('projects/editCategory', async params => {
  try {
    const response = await instance.put(endpoints.taskCategories, params)

    return response.data
  } catch (error) {
    const { response } = error

    return response
  }
})

export const putExpenses = createAsyncThunk('projects/putExpenses', async params => {
  const response = await instance.put(endpoints.expenses, params)

  return response.data
})

export const putAssignee = createAsyncThunk('projects/puttAssignee', async params => {
  const response = await instance.put(endpoints.projectAssignees, params)

  return response.data
})

export const putTask = createAsyncThunk('projects/putTask', async params => {
  try {
    const response = await instance.put(endpoints.putTask, params, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return response.data
  } catch (error) {
    toast.error(NODATA.error, { duration: 3000, position: 'top-right' })

    return error
  }
})

//POST

export const putCategory = createAsyncThunk('projects/putCategory', async params => {
  try {
    const response = await instance.put(endpoints.putTaskCategory, params.request)

    if (response.data === 'Cannot remove tasks with existing timesheet Entry') {
      toast.error(response.data, { duration: 3000, position: 'top-right' })
    } else {
      toast.success('Task Category Updated', { duration: 3000, position: 'top-right' })
    }
    params.afterSubmit()

    return response.data
  } catch (error) {
    toast.error(NODATA.error, { duration: 3000, position: 'top-right' })
    params.afterSubmit()

    return error
  }
})

export const putProjectMap = createAsyncThunk('projects/putProjectMap', async params => {
  const response = await instance.put(endpoints.updateProjectMap, params)

  return response.data
})

export const putMilestone = createAsyncThunk(
  'projects/putMilestone',
  async (params, { dispatch }) => {
    try {
      const response = await instance.put(endpoints.mileStones, params)

      return response.data
    } catch (error) {
      console.error('Error updating milestone:', error)

      return error.response.data
    }
  }
)

export const getProjectDetails = createAsyncThunk('projects/getProjectDetails', async params => {
  try {
    const response = await instance.get(endpoints.getProjectDetails(params))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const deleteTask = createAsyncThunk('projects/deleteTask', async params => {
  try {
    const response = await instance.delete(endpoints.deleteTask(params))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const deleteProject = createAsyncThunk('projects/deleteProject', async params => {
  try {
    const response = await instance.delete(endpoints.deleteProject(params))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const deleteTaskCategory = createAsyncThunk('projects/deleteTaskCategory', async params => {
  try {
    const response = await instance.delete(endpoints.deleteTaskCategory(params))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const deleteExpense = createAsyncThunk('projects/deleteExpense', async params => {
  try {
    const response = await instance.delete(endpoints.deleteExpense(params))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const deleteProjectMember = createAsyncThunk(
  'projects/deleteProjectMember',
  async params => {
    const response = await instance.delete(endpoints.deleteProjectMember(params))

    return response.data
  }
)

export const fetchDepartment = createAsyncThunk('projects/fetchDepartment', async params => {
  const response = await instance.get(endpoints.getDepartment)

  return response.data
})

export const deleteMileStone = createAsyncThunk('projects/deleteMileStone', async params => {
  try {
    const response = await instance.delete(endpoints.deleteMileStone(params))

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

//Get Project Assignee Roles
export const fetchAssigneeRoles = createAsyncThunk('ProjectRole/GetProjectRoles', async params => {
  try {
    const response = await instance.get(endpoints.projectAssigneesRoles)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

const initialState = {
  allClients: null,
  allClientsName: null,
  users: null,
  allProjects: [],
  client: {},
  allTasks: [],
  editProject: {},
  editMilestone: null,
  editProjectMember: null,
  editExpenses: false,
  projectDetails: {},
  selectedProject: {},
  projectReport: [],
  project: {
    uniqueId: '',
    projectType: 2,
    projectName: '',
    plannedBudget: '',
    plannedHours: '',
    isBillable: true,
    allowOpenTasks: false,
    skills: [],
    taskType: []
  },
  category: [],
  tasks: [
    {
      index: 0,
      name: '',
      category: '',
      hours: ''
    }
  ],
  assignees: null,
  assigneeRoles: [],
  //list
  departments: null,
  taskLists: null,
  projectMembers: null,
  projectRoleId: null,
  expenses: null,
  editTask: {},
  selectedCategory: '',
  selectedCategoryId: null,
  categories: [],
  mileStones: null,
  feedbacks: [],
  requiredSkills: [],
  projectAssignees: [],
  userProjects: null,
  files: null,
  //boolean
  isEmpty: false,
  ProjectById: {},

}

export const appProjects = createSlice({
  name: 'projects',
  initialState: initialState,
  reducers: {
    resetProjectDetails: (state, { payload }) => {
      state.projectMembers = state.mileStones = state.expenses = state.files = payload
    },

    updateProjectStatus: (state, action) => {
      const { projectId, isActive } = action.payload
      const updatedProjects = state.projects?.map(project =>
        project.id === projectId ? { ...project, isActive } : project
      )
      state.projects = updatedProjects
    },

    setClient: (state, action) => {
      state.client = action.payload?.result
    },
    setProject: (state, action) => {
      state.project = action.payload?.result
    },
    setProjectById: (state, action) => {
      state.ProjectById = action.payload?.result
    },
    setProjectsDetails: (state, action) => {
      state.projectDetails = action.payload?.result
    },
    setCategory: (state, action) => {
      state.category = action.payload?.result
    },
    setTasks: (state, { payload }) => {
      state.tasks = payload
    },
    setAssignees: (state, action) => {
      state.assignees = action.payload
    },
    setSkills: (state, action) => {
      state.skills = action.payload
    },
    setTaskType: (state, action) => {
      state.taskType = action.payload
    },
    setEditProject: (state, action) => {
      state.editProject = action.payload?.result
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload?.result
    },
    setUserProject: (state, action) => {
      state.userProjects = action.payload
    },
    setEditTask: (state, { payload }) => {
      state.editTask =
        payload && Object.keys(payload).length > 0
          ? { ...payload, dueDate: new Date(payload.dueDate) }
          : payload
    },
    setSelectedCategory: (state, { payload }) => {
      state.selectedCategory = payload
    },
    setSelectedCategoryId: (state, { payload }) => {
      state.selectedCategoryId = payload
    },
    setCategories: (state, { payload }) => {
      state.categories = payload
    },
    setTaskLists: (state, { payload }) => {
      state.taskLists = payload
    },
    setProjectMembers: (state, { payload }) => {
      state.projectMembers = payload
    },

    setExpenses: (state, { payload }) => {
      state.expenses = payload
    },

    setEditExpenses: (state, { payload }) => {
      state.editExpenses = payload
    },

    setMileStones: (state, { payload }) => {
      state.mileStones = payload
    },
    setEditMilestone: (state, action) => {
      state.editMilestone = action.payload
    },
    setEditProjectMember: (state, action) => {
      state.editProjectMember = action.payload
    },

    setProjectFiles: (state, action) => {
      state.files = action.payload
    },
    setProjectRoles: (state, action) => {
      state.assigneeRoles = action.payload
    },

    setFeedbacks: (state, { payload }) => {
      state.feedbacks = payload
    },
    //boolean
    setEmpty: (state, { payload }) => {
      state.isEmpty = payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchClients.fulfilled, (state, action) => {
      state.allClients = action.payload?.result ?? []
    })
    builder.addCase(fetchGetOnlyClientName.fulfilled, (state, action) => {
      state.allClientsName = action.payload?.result ?? []
    })
    builder.addCase(fetchDepartment.fulfilled, (state, action) => {
      state.departments = action.payload?.result || []
    })

    builder.addCase(postProject.fulfilled, (state, action) => {
      state.project.uniqueId = action.payload.result ? action.payload.result.id : 0
    })

    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      const projects = action.payload?.result
      const userData = jwt.decode(localStorage.getItem('accessToken'), { complete: true })?.payload
      const roleId = userData?.roleId
      if (roleId != 4) {
        state.allProjects = projects
      } else {
        state.allProjects = projects.filter(project => project.projectRoleId)
      }
    })

    builder.addCase(fetchProjectById.fulfilled, (state, action) => {

      state.ProjectById = action.payload?.result
    })

    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      const users = action.payload?.result?.map(user => ({
        ...user,
        userName: `${user.firstName} ${user.lastName}`
      }))
      state.users = users
    })
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload?.result || []
    })

    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.taskLists = action.payload?.result?.tasksByCategory || []
    })
    builder.addCase(getProjectDetails.fulfilled, (state, action) => {
      state.projectDetails = action.payload.result
    })
    builder.addCase(fetchMileStones.fulfilled, (state, action) => {
      var mileStones = action.payload.result
      //.filter(o => o.projectId === state.selectedProject?.id)
      mileStones = mileStones.sort((start, end) => {
        return new Date(start.startDate) - new Date(end.endDate)
      })
      state.mileStones = mileStones || []
    })
    builder.addCase(putMilestone.fulfilled, (state, action) => {
      const updatedMilestone = action.payload
      const index = state.mileStones.findIndex(m => m.id === updatedMilestone.id)
      if (index !== -1) {
        state.mileStones[index] = updatedMilestone
      }
    })
    builder.addCase(fetchRequiredSkills.fulfilled, (state, action) => {
      state.requiredSkills = action.payload?.result || []
    })

    // builder.addCase(postAssignee.fulfilled, (state, action) => {
    //   state.projectMembers = action.payload.result || []
    // })
    builder.addCase(postExpenses.fulfilled, (state, action) => {
      state.expenses = [...state.expenses, action.payload?.result]
    })

    builder.addCase(putAssignee.fulfilled, (state, action) => {
      state.projectMembers = state.projectMembers.map(x =>
        x.id === action.payload.result[0].id ? action.payload.result[0] : x
      )
    })

    builder.addCase(putExpenses.fulfilled, (state, action) => {
      state.expenses = state.expenses.map(x =>
        x.id === action.payload.result.id ? action.payload.result : x
      )
    })

    builder.addCase(fetchProjectMembers.fulfilled, (state, action) => {
      const userData = jwt.decode(localStorage.getItem('accessToken'), { complete: true })?.payload
      const userMail = userData?.user
      state.projectMembers = action.payload?.result || []
      state.projectRoleId =
        action.payload?.result?.find(p => p.userEmail == userMail)?.projectRoleId ?? 3
    })

    builder.addCase(fetchExpenses.fulfilled, (state, action) => {
      state.expenses = action.payload?.result
    })

    builder.addCase(fetchProjectsByUser.fulfilled, (state, action) => {
      state.userProjects = action.payload?.result
    })
    builder.addCase(fetchSkills.fulfilled, (state, action) => {
      state.skills = action.payload.result
    })
    builder.addCase(fetchTaskType.fulfilled, (state, action) => {
      state.taskType = action.payload.result
    })
    builder.addCase(fetchProjectAssignees.fulfilled, (state, action) => {
      const assignees = action.payload.result?.filter(
        o => o.projectId == localStorage.getItem('projectId')
      )
      const tempUsers = []
      assignees.forEach(user => {
        const _user = state.users?.find(o => o.id === user.userId)
        tempUsers.push({
          email: _user?.email,
          userName: `${_user?.firstName} ${_user?.lastName}`,
          ...user
        })
      })
      state.assignees = tempUsers
    })
    builder.addCase(fetchProjectsReport.fulfilled, (state, action) => {
      state.projectReport = action.payload?.result
    })

    // FILES
    builder.addCase(fetchProjectFiles.fulfilled, (state, action) => {
      state.files = action.payload?.result
    })


    //ProjectAssigneeRoles
    builder.addCase(fetchAssigneeRoles.fulfilled, (state, action) => {
      state.assigneeRoles = action.payload?.result
    })
  }
})

export const {
  resetProjectDetails,
  setClient,
  setCategory,
  setSelectedProject,
  setTasks,
  setEditProject,
  setProjectsDetails,
  setAssignees,
  setSkills,
  setTaskType,
  setProject,
  setProjectById,
  setFeedbacks,
  setMileStones,
  setEditTask,
  setSelectedCategory,
  setSelectedCategoryId,
  setCategories,
  setTaskLists,
  setEmpty,
  setProjectMembers,
  setExpenses,
  setEditMilestone,
  setEditProjectMember,
  setEditExpenses,
  setUserProject,
  updateProjectStatus,
  setProjectFiles,
  setProjectRoles
} = appProjects.actions

export default appProjects.reducer
