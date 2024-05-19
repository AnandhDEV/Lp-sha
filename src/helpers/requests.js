//REGISTER

import { id } from 'date-fns/locale'
import { formatDateToYYYYMMDD, formatLocalDate } from './dateFormats'
import { ConvertHoursToTime } from './helpers'

export const signupRequest = req => {
  const request = {
    id: 0,
    firstName: req.firstName,
    lastName: req.lastName,
    email: req.email,
    password: req.password,
    isActive: true,
    joinedDate: new Date().toISOString()
  }

  return request
}

//ORGANIZATION

export const organizationRequest = req => {
  const request = {
    name: req.name,
    address: req.address,
    organizationSize: req.orgSize,
    city: req.city,
    state: req.state.name,
    country: req.country.name,
    zipcode: req.zipcode,
    website: req.website,
    phone: req.phone,
    isActive: true
  }

  return request
}

//CONFIGURATIONS

export const settingsRequest = req => {
  const request =
    req.name == 'update'
      ? {
        currency: req.currency?.cc,
        workingdays: [req.startWeekDay, req.endWeekDay].join('-'),
        timeZone: `${req.timezone.name} - ${req.timezone?.offset}`,
        updateHrUsers: req.hrApprovalsIds,
        removeHrUsers: req.removeHrUsers
      }
      : {
        currency: req.currency?.cc,
        workingdays: [req.startWeekDay, req.endWeekDay].join('-'),
        timeZone: `${req.timezone.name} - ${req.timezone?.offset}`,
        leaveHRApprovalUserIds: req.hrApprovalsIds
      }

  return request
}

//TIMESHEET
export const timeSheetRequest = req => {
  const request = {
    id: req.id,
    burnedHours:
      req.burnedHours?.split(':').length == 3
        ? req.burnedHours.split(':')[0].length == 1
          ? `${'0'.concat(req.burnedHours.split(':')[0])}:${req.burnedHours.split(':')[1]}:00`
          : req.burnedHours
        : req.burnedHours?.concat(':00'),
    timeSheetDate: req.timeSheetDate,
    isBillable: req.isBillable,
    taskId: req.taskId,
    projectId: req.projectId,
    taskCategoryId: req.taskCategoryId
  }

  return request
}

export const timeSheetSubmitRequest = req => {
  const { timeSheets, startDate, endDate } = req
  const request = {
    timeSheetId: timeSheets,
    fromDate: startDate,
    toDate: endDate
  }

  return request
}

export const timeSheetApprovalRequest = req => {
  const { timeSheets, comment, approvalStatusId } = req
  const request = {
    timesheetApprovalId: timeSheets,
    comment: comment ? comment.value : '',
    approvalStatusId: approvalStatusId
  }

  return request
}

//USERS

export const userRequest = req => {
  const request = req?.id
    ? {
      id: req.id,
      firstName: req.firstName,
      lastName: req.lastName,
      invitationStatus: req.invitationStatus,
      email: req.email,
      password: req.password,
      isActive: true,
      costPerHour: req.costPerHour,
      roleId: req.role,
      tenantId: req.tenantId,
      organizationId: req.organizationId,
      joinedDate: req.joinedDate?.toISOString(),
      departmentId: req.departmentId,
      reportingManagerId: req.reportingManagerId,
      skillId: req.skills,
      profilePhoto: req.profilePhoto,
      profilePictureName: req.profilePictureName

    }
    : {
      dateJoined: new Date().toISOString(),
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email,
      costPerHour: req.cost,
      roleId: req.role,
      reportingManagerId: req.reportingManagerId,
      departmentId: req.departmentId,
      skills: req.skills
    }

  return request
}

//Clients
export const clientRequest = req => {
  const request = req.id
    ? {}
    : {
      companyName: req.companyName,
      profilePhoto: req?.profilePhoto || '',
      primaryContatctName: req.primaryContactName,
      address: req.address,
      email: req.email,
      phoneNumber: req.phoneNumber,
      companyId: req.companyId,
      taxId: req.taxId,
      isActive: req.isActive
    }

  return request
}

//PROJECTS

export const projectRequest = req => {
  const request = {
    name: req.name,
    budget: Number(req.plannedBudget),
    startDate: (req.startDate) ? req.startDate.toISOString() : undefined,
    endDate: req.endDate ? req.endDate.toISOString() : undefined,
    estimatedHours: Number(req.plannedHours),
    skillId: req.skills,
    isActive: true,
    projectTypeId: Number(req.type),
    clientId: req.client,
    departmentId: req.departmentId ? req.departmentId : null,
    isBillable: req.isBillable,
    allowUsersToChangeEstHours: req.allowUsersToChangeEstHours,
    allowUsersToCreateNewTask: req.allowUsersToCreateNewTask
  }

  return request
}

export const projectAssigneeRequest = req => {
  const { allocatedProjectCost, projectId, userId, projectRoleId, availablePercentage, id } = req
  const request = [
    {
      allocatedProjectCost: allocatedProjectCost,
      projectId: projectId,
      userId: userId,
      projectRoleId: projectRoleId,
      availablePercentage: availablePercentage,
      id: id || undefined
    }
  ]

  return request
}

export const categoryRequest = (id, name, isBillable, projectId) => {
  const request = id
    ? {
      id: id,
      name: name,
      isBillable: isBillable,
      projectId: projectId
      // milestoneId: 1
    }
    : {
      name: name,
      isBillable: isBillable,
      projectId: projectId
      // milestoneId: 1
    }

  return request
}

export const taskRequest = req => {
  let estimate = (req.taskEstimateHours)
  // estimate =
  //   estimate?.split(':').length == 2
  //     ? `${estimate.split(':')[0]}:${estimate.split(':')[1]}:00`
  //     : estimate?.split(':').length == 3
  //       ? estimate
  //       : '00:00:00'

  const request = {
    id: req.id,
    DueDate: req.dueDate?.toISOString(),
    TaskPriorityId: req.taskPriorityId,
    IsBillable: req.isBillable,
    TaskStatusId: req.taskStatusId,
    ProjectId: req.projectId,
    Files: req.Files,
    TaskEstimateHours: estimate,
    // TaskEstimatedHours: req.taskEstimatedHours?.toString(),
    TaskAssignedUserId: req.taskAssignedUserId.userId,
    taskName: req.taskName,
    TaskCategoryId: req.taskCategoryId,
    taskDescription: req.taskDescription
  }


  return request
}

export const mileStoneRequest = req => {
  const request = {
    name: req.name,
    description: req.description,
    startDate: formatDateToYYYYMMDD(req.startDate),
    endDate: formatDateToYYYYMMDD(req.endDate),
    createdDate: new Date().toISOString(),
    taskCategories: req?.taskCategories || [],
    projectId: req.projectId
  }

  return request
}

// export const projectStatusRequest=req=>{
//   const request=req.id?{

//   }
// }

export const expenseRequest = req => {
  const request = req.id
    ? {
      id: req.id,
      projectId: req.projectId,
      expense: req.expense,
      cost: req.cost,
      date: new Date(req.date).toISOString(),
      description: req.description
    }
    : {
      projectId: req.projectId,
      expense: req.expense,
      cost: req.cost,
      date: new Date(req.date).toISOString(),
      description: req.description
    }

  return request
}

//LEAVE MANAGEMENT

export const leavePolicyRequest = req => {
  const request = req.id
    ? {
      leavePolicyId: req.id,
      typeOfLeave: req?.typeOfLeave,
      allowanceCount: !isNaN(req?.allowanceCount) && Number(req?.allowanceCount),
      allowanceTime: !isNaN(req?.allowanceTime) && Number(req?.allowanceTime),
      isPermission: req.isPermission,
      period: req?.period,
      carryForwardCount: !isNaN(req?.carryForwardCount) && Number(req?.carryForwardCount),
      levelOneApprovalLevelId: req.level1,
      levelTwoApprovalLevelId: req.level1 === 3 ? 0 : req.level2
    }
    : {
      typeOfLeave: req?.typeOfLeave,
      allowanceCount: !isNaN(req?.allowanceCount) && Number(req?.allowanceCount),
      allowanceTime: !isNaN(req?.allowanceTime) && Number(req?.allowanceTime),
      isPermission: req.isPermission,
      period: req?.period,
      carryForwardCount: !isNaN(req?.carryForwardCount) && Number(req?.carryForwardCount),
      levelOneApprovalLevelId: req.level1,
      levelTwoApprovalLevelId: req.level1 === 3 ? 0 : req.level2
    }

  return request
}

export const myLeaveRequest = req => {
  const request = req.id
    ? {
      id: req.id,
      requestTypeId: req?.requestTypeId,
      fromDate: req?.fromDate?.toISOString(),
      toDate: req?.toDate?.toISOString(),
      isFromDateHalfDay: req.isFromDateHalfDay,
      isToDateHalfDay: req.isToDateHalfDay,
      requestReason: req?.requestReason,
      submittedUserId: req?.submittedUserId
    }
    : {
      requestTypeId: req?.requestTypeId,
      fromDate: req?.fromDate?.toISOString(),
      toDate: req?.toDate?.toISOString(),
      isFromDateHalfDay: req.isFromDateHalfDay,
      isToDateHalfDay: req.isToDateHalfDay,
      requestReason: req?.requestReason,
      submittedUserId: req?.submittedUserId
    }

  return request
}

export const approvalRequest = req => {
  const request = {
    leaveRequestApprovalId: req.leaveRequestApprovalId,
    leaveRequestId: req.id,
    leaveStatusId: req.leaveStatusId,
    approvalLevelId: req.approvalLevelId,
    comment: req.comment
  }

  return request
}
