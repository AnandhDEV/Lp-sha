import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'

const VerticalNavItems = () => {
  // const [role, setRole] = useState(0)
  const auth = useAuth()
  const roleId = auth.user?.roleId
  // useEffect(() => {
  //   debugger
  //   setRole(roleId)
  // }, [auth])


  if (roleId == 4) {
    return [
      {
        title: 'Timesheets',
        icon: 'mdi:clock-time-four-outline',
        auth: false,
        path: '/timesheet/timeSheets'
      },
      {
        title: 'Projects',
        icon: 'mdi:clipboard-text',
        auth: false,
        path: '/projects/list'
      },
      {
        title: 'Absence',
        icon: 'mdi:calendar-alert-outline',
        path: '/absence-management/leaves',
        auth: false
      }
    ]
  }

  if (roleId == 1 || roleId == 3) {
    return [
      {
        title: 'Timesheets',
        icon: 'mdi:clock-time-four-outline',
        auth: false,
        path: '/timesheet/timeSheets'
      },
      {
        title: 'Clients',
        icon: 'mdi:account-group-outline',
        auth: false,
        path: '/clients'
      },
      {
        title: 'Projects',
        icon: 'mdi:clipboard-text',
        auth: false,
        path: '/projects/list'
      },
      {
        title: 'Reports',
        icon: 'mdi:chart-line',

        // auth: false,
        children: [
          {
            title: 'Utilization',
            path: '/apps/reports',
            icon: 'solar:chart-linear'

            // auth: false
          },
          {
            title: 'Revenue',
            path: '/apps/financialReports',
            icon: 'material-symbols:finance-mode'

            // auth: false
          },
          {
            title: 'Time',
            path: '/apps/reports/time',
            icon: 'mdi:clock-time-seven-outline'

            // auth: false
          }
        ]
      },
      {
        title: 'Invoice',
        icon: 'mdi:file-document-outline',
        path: '/apps/invoice/list'
        // auth: false
      },
      {
        title: 'Users',
        icon: 'mdi:account-outline',
        auth: false,
        path: '/users'
      },

      {
        title: 'Absence',
        icon: 'mdi:calendar-alert-outline',
        path: '/absence-management/leaves',
        auth: false
      },

      {
        title: 'Settings',
        icon: 'mdi:file-document-outline',
        path: '/settings/Settings',
        auth: false
      }
    ]
  }
}

export default VerticalNavItems