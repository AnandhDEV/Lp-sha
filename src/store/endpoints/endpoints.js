import { id } from 'date-fns/locale'

export const baseURL = 'https://lp-webapi-dev.azurewebsites.net/'

export const endpointURL = endpoint => {
  return baseURL + endpoint
}

export const endpoints = {
  //User
  allUsers: 'api/User/GetUsers',
  userByEmail: email => `api/User/GetUserByEmail?emailId=${email}`,
  adduser: 'api/User/CreateUser/',
  Updateuser: ({
    id,
    firstName,
    lastName,
    email,
    joinedDate,
    costPerHour,
    roleId,
    reportingManagerId,
    profilePictureName,
    skillId
  }) => {
    let skillIdString = ''
    skillId.forEach(skill => {
      skillIdString = skillIdString.concat(`&SkillId=${skill}`)
    })

    return `api/User/UpdateUser?Id=${id}&FirstName=${firstName}&LastName=${lastName}&Email=${email}&JoinedDate=${joinedDate}&CostPerHour=${costPerHour}&RoleId=${roleId}&ReportingManagerId=${reportingManagerId}&ProfilePictureName=${profilePictureName}${skillIdString}`
  },
  login: 'api/Authorization/Login',
  forgotPasswordMail: email => `api/Authorization/ForgotPasswordMailSend?email=${email}`,
  setForgotPassword: (base64String, pass) => `api/Authorization/ForgotPassword?base64String=${base64String}&password=${pass}`,

  // refresh token
  refreshtoken: 'api/Account/refresh-token',

  addOrganizationSetup: 'api/Organization/CreateOrganization',
  getOrganizationSetup: 'api/Organization/GetOrganization',
  updateOrganizationSetup: 'api/Organization/UpdateAddOrganization',

  signup: 'api/Account/Signup/',
  logOut: 'api/logout/',
  edituserdetails: 'api/user/manage/',
  tenant: 'api/Tenant',

  userInvite: 'api/User/UserInvite',

  Deleteuser: id => `api/User/DeleteUser/${id}`,
  Activateuser: id => `api/User/SendEmailToActivateUser?userId=${id}`,

  // timesheet
  getTimesheetList: 'api/TimeSheet/GetTimeSheet',
  getTimesheetwithDateRange: (sdate, edate) =>
    `api/TimeSheet/GetTimeSheet?sdate=${sdate}&edate=${edate}`,

  postTimesheetList: 'api/TimeSheet/CreateTimeSheet',
  putTimesheetList: 'api/TimeSheet/UpdateTimeSheet',
  deleteTimesheetList: id => `api/TimeSheet/DeleteTimeSheet?id=${id}`,
  getTaskbyProject: id => `api/Task/GetTasksByProject?ProjectId=${id}`,
  getAssignedProject: 'api/Project/GetProjectsByUser',
  getTasksForProjectAndUserAssignee: id => `api/Task/GetTasksForProjectAndUserAssignee?ProjectId=${id}`,


  //TimeSheet Approval
  getTimeSheetApprovals: id => `api/TimeSheetApproval/GetTimeSheetApproval?userId=${id}`,
  postTimeSheetApproval: 'api/TimeSheetApproval/CreateTimeSheetApproval',
  putTimeSheetApproval: 'api/TimeSheetApproval/UpdateTimeSheetApproval',

  // assign users
  assignUsers: 'api/ProjectMapping/Create',
  updateProjectMap: 'api/ProjectMapping/UpdateProjectMap',
  assignUsersbyProject: id => `api/ProjectMap/ProjectMapping?project_uId=${id}`,

  GetassignedUsersbyEmail: mail => `api/ProjectMap/ProjectMapping?mail=${mail}`,

  updateUsers: 'api/ProjectMap/ProjectMapping/',
  deleteUsers: 'api/ProjectMap/ProjectMapping/',
  allAssignedUsers: 'api/ProjectMap/ProjectMappingAll',

  //REPORTS

  getProjectReportsDetails: id => `/api/Report/GetProjectReports?ProjectId=${id}`,
  getReportsByProjectId: projectId => `api/Report/Reports?projectId=${projectId}`,
  getTimeReportsByProjectUId: projectUId => `api/Report/TimeReports?projectUId=${projectUId}`,
  getGetPercentageByProjectUId: projectUId => `api/Report/getPercentage?projectUId=${projectUId}`,
  getPercentageByProjectId: projectUId => `api/Report/Percentage?projectUId=${projectUId}`,
  getEmployeeReports: (employeeId, fromDate, toDate) => {
    if (fromDate != null && toDate != null) {
      return `api/Report/GetEmployeeReports?employeeid=${employeeId}&fromdate=${fromDate}&todate=${toDate}`
    } else {
      return `api/Report/GetEmployeeReports?employeeid=${employeeId}`
    }
  },
  getGetProjectReports: (projectId, fromDate, toDate) => {
    if (fromDate != null && toDate != null) {
      return `api/Report/GetProjectReports?projectid=${projectId}&fromdate=${fromDate}&todate=${toDate}`
    } else {
      return `api/Report/GetProjectReports?projectid=${projectId}`
    }
  },
  getAllClientReports: (fromDate, toDate) => {
    if (fromDate != null && toDate != null) {
      return `api/Report/GetClientReports?FromDate=${fromDate}&ToDate=${toDate}`
    } else {
      return `api/Report/GetClientReports`
    }
  },
  getAllProjectsReport: (fromDate, toDate) => {
    if (fromDate != null && toDate != null) {
      return `api/Report/GetAllProjectsReport?FromDate=${fromDate}&ToDate=${toDate}`
    } else {
      return `api/Report/GetAllProjectsReport`
    }
  },

  getProjectDetails: projectUId => `api/Report/ProjectDetailReport?ProjectUId=${projectUId}`,

  //setting
  getCurrency: 'api/Settings/GetCurrencies',
  postCurrency: 'api/Settings/CreateSettings',

  //Holidays
  getHolidayRequests: 'api/LeavePolicy/GetHolidayRequests',
  addHolidayRequests: 'api/LeavePolicy/CreateHolidayRequest',
  updateHolidayRequests: 'api/LeavePolicy/UpdateHolidayRequest',
  deleteHolidayRequests: 'api/LeavePolicy/DeleteHolidayRequest',

  //client
  addClient: ({
    companyName,
    companyId,
    address,
    email,
    primaryContatctName,
    profilePictureName,
    phoneNumber,
    taxId,
    isActive
  }) =>
    `api/Client/CreateClient?CompanyName=${companyName}&ProfilePictureName=${profilePictureName}&PrimaryContatctName=${primaryContatctName}&Address=${address}&Email=${email}&PhoneNumber=${phoneNumber}&CompanyId=${companyId}&TaxId=${taxId}&IsActive=${isActive}`,
  updateClient: ({
    id,
    companyName,
    companyId,
    address,
    email,
    primaryContatctName,
    profilePictureName,
    phoneNumber,
    taxId,
    isActive
  }) =>
    `api/Client/UpdateClient?id=${id}&CompanyName=${companyName}&ProfilePictureName=${profilePictureName}&PrimaryContatctName=${primaryContatctName}&Address=${address}&Email=${email}&PhoneNumber=${phoneNumber}&CompanyId=${companyId}&TaxId=${taxId}&IsActive=${isActive}`,
  getAllClient: 'api/Client/GetClients',
  getOnlyClientName: 'api/Client/GetOnlyClientName',
  deleteClient: id => `api/Client/DeleteClient/${id}`,
  clientById: id => `/api/Client/GetClientById/${id}`,
  editClient: 'api/Client/Update',

  getProjectReport: id => `api/Report?projectUid=${id}`,

  getOrganizationReport: `api/OrganizationReport/GetOrganizationReport`,

  getInvoiceDetails: (id, month, year) =>
    `/api/Invoice/GetProjectInvoice?projectId=${id}&month=${month}&year=${year}`,
  saveInvoice: '/api/Invoice',
  getInvoiceAll: 'api/Invoice/GetInvoices',

  //projects
  projects: 'api/Project',
  getProjects: 'api/Project/GetProject',
  deleteProject: id => `api/Project?id=${id}`,
  projectMembers: id => `api/ProjectAssignee?projectId=${id}`,

  projectAssignees: 'api/ProjectAssignee',
  projectsByUser: 'api/Project/GetProjectsByUser',
  projectAssigneesRoles: 'api/ProjectRole/GetProjectRoles',

  projectByUserId: id => `/api/Project/GetProjectsByUserId?userId=${id}`,

  getProjectById: id => `api/Project/GetProjectById?projectId=${id}`,

  // tasks
  postTask: 'api/Task/CreateTask',
  putTask: 'api/Task/UpdateTask',
  getTaskList: projectId => `api/Task/GetTasksByProject?ProjectId=${projectId}`,
  deleteTask: id => `api/Task/DeleteTask?id=${id}`,
  bulkTaskCreate: `/api/Task/BulkTaskCreate`,

  //taskCategory

  createCategory: 'api/TaskCategory/CreateTaskCategory',
  taskCategories: 'api/TaskCategory',
  getTaskCategoriesbyProjectID: id => `api/TaskCategory?projectId=${id}`,
  deleteTaskCategory: id => `api/TaskCategory?TaskCategoryId=${id}`,

  //milestone

  mileStones: 'api/Milestone',
  deleteMileStone: id => `api/Milestone?milestoneId=${id}`,
  mileStoneById: id => `/api/Milestone?projectId=${id}`,

  //skills
  skills: 'api/MasterSkill',
  deleteSkill: id => `api/MasterSkill?MasterSkillId=${id}`,

  //Expenses
  expenses: `/api/ProjectExpense`,
  getExpenseById: id => `/api/ProjectExpense/${id}`,
  deleteExpense: id => `/api/ProjectExpense?expenseId=${id}`,

  //files
  files: projectId => `api/ProjectAttachment?ProjectId=${projectId}`,
  deleteFile: id => `api/ProjectAttachment?Id=${id}`,

  //organization Configuration
  createConfig: `/api/OrganizationGeneralSettings`,
  updateConfig: `/api/OrganizationGeneralSettings/UpdateOrganizationGeneralSetting`,
  getConfig: `/api/OrganizationGeneralSettings/GetOrganizationGeneralSettings`,
  OrgLeaveHrApproval: `/api/OrganizationLeaveHRApproval`,

  //Task Status

  getProjectStatus: '/api/MasterTaskStatus/GetMasterTaskStatus',
  postProjectStatus: '/api/MasterTaskStatus/CreateMasterStatus',
  putProjectStatus: '/api/MasterTaskStatus/UpdateMasterTaskStatus',
  deleteProjectStatus: id => `/api/MasterTaskStatus/DeleteMasterTaskStatus?taskStatusId=${id}`,

  //HR Approval

  HRApprovals: 'api/OrganizationLeaveHRApproval',
  deleteHRApproval: 'api/OrganizationLeaveHRApproval',

  //Projet Assignee
  deleteProjectMember: id => `/api/ProjectAssignee?Id=${id}`,
  AddMember: '/api/ProjectAssignee',
  getMembers: '/api/ProjectAssignee',

  //leave Management

  myLeaves: 'api/LeaveRequest',
  getLeavePolicy: '/api/LeavePolicy/GetLeavePolicy',
  createLeavePolicy: '/api/LeavePolicy/CreateLeavePolicy',
  updateLeavePolicy: 'api/LeavePolicy/UpdatePolicy',
  requests: 'api/LeaveRequest',
  getApprovals: 'api/LeaveRequestApprove/GetLeaveRequestApproval',
  createApproval: 'api/LeaveRequestApprove/CreateLeaveRequestApproval',
  updateApproval: 'api/LeaveRequestApprove/UpdateLeaveRequestApproval',
  deleteLeavePolicy: id => `api/LeavePolicy/DeletePolicy?policyId=${id}`,
  deleteRequest: id => `api/LeaveRequest?requestId=${id}`,
  createBulkLeave: `/api/LeaveRequest/BulkLeaveCreate`,

  getStatus: 'api/MasterTaskStatus/GetMasterTaskStatus',

  getUserReports: (userId, fromDate, toDate) =>
    `api/Report/GetUserLeaveRequest?UserId=${userId}&FromDate=${fromDate}&ToDate=${toDate}`,
  getDashboard: userId => `api/Report/GetUserLeaveBalance?UserId=${userId}`,

  // Department
  getDepartment: '/api/Department',
  department: '/api/Department',
  deleteDepartment: id => `/api/Department?Id=${id}`,

  //Timesheet Report

  getName: (name, fromDate = null, toDate = null) => `/api/TimesheetReport?type=${name}&fromDate=${fromDate}&toDate=${toDate}`,
  getUserTimesheetReports: (id, fromDate = null, toDate = null) => `/api/TimesheetReport/timesheetByUser?userId=${id}&fromDate=${fromDate}&toDate=${toDate}`,
  getProjectTimesheetReports: (id, fromDate = null, toDate = null) => `/api/TimesheetReport/timesheetByProject?projectId=${id}&fromDate=${fromDate}&toDate=${toDate}`,
  getClientTimesheetReports: (id, fromDate = null, toDate = null) => `/api/TimesheetReport/timesheetByClient?clientId=${id}&fromDate=${fromDate}&toDate=${toDate}`,

  //Project management report by id
  getBurnedCostReport: projectId => `/api/ProjectReport/GetBurnedCostPercentage?projectId=${projectId}`,
  getTaskProgressReport: projectId => `/api/ProjectReport/GetTaskProgress?projectId=${projectId}`,
  getTaskCompletionRate: projectId => `/api/ProjectReport/GetTaskCompletionRate?projectId=${projectId}`,
  getProjectProfitCost: projectId => `/api/ProjectReport/GetProjectProfit?projectId=${projectId}`,
  getPendingTaskPriority: projectId => `/api/ProjectReport/GetPendingTaskPriority?projectId=${projectId}`,
  getTaskStatusCount: projectId => `/api/ProjectReport/GetProjectTaskCount?projectId=${projectId}`,
  getGraphDataForTaskProgress: projectId => `/api/ProjectReport/GetTaskProgressGraphData?projectId=${projectId}`,
  getResourceUtilizationCost: projectId => `/api/ProjectReport/GetResourceUtilizationCost?projectId=${projectId}`,
  getTaskEfficiencyIndexPercentage: projectId => `/api/ProjectReport/GetTaskEfficiencyIndex?projectId=${projectId}`,
  getResourceUtilizationRate: projectId => `/api/ProjectReport/GetResourceUtilizationRate?projectId=${projectId}`,
  getTimesheetUser: `api/TimeSheetApproval/GetTimesheetUser`,

  //task type

  getTaskType: `/api/TaskType/GetTasktypes`,

  //Timesheet report excel

  getTimesheetExport: projectId => `/api/Excel?projectId=${projectId}`,
  getTaskPerformance: projectId => `/api/Excel/getTaskPerformance?projectId=${projectId}`


}
