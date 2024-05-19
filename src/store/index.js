// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import reports from 'src/store/apps/reports'
import projects from 'src/store/apps/projects'
import clients from 'src/store/clients'
import timesheets from 'src/store/timesheets'
import organization from './apps/organization'
import accountSetting from 'src/store/apps/accountSetting'
import leaveManagement from 'src/store/absence-management'
import settings from 'src/store/settings'
import auth from 'src/store/authentication/register'

export const store = configureStore({
  reducer: {
    user,
    organization,
    clients,
    chat,
    email,
    invoice,
    projects,
    reports,
    calendar,
    permissions,
    timesheets,
    accountSetting,
    leaveManagement,
    settings,
    auth
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
