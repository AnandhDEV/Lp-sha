// ** MUI Imports
import Box from '@mui/material/Box'

// ** Components
import Autocomplete from 'src/layouts/components/Autocomplete'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import ShortcutsDropdown from 'src/@core/layouts/components/shared-components/ShortcutsDropdown'

// ** Hook Import

const notifications = [
  {
    meta: 'Today',
    avatarAlt: 'Flora',
    title: 'Congratulation Flora! 🎉',
    avatarImg: '/images/avatars/4.png',
    subtitle: 'Won the monthly best seller badge'
  },
  {
    meta: 'Yesterday',
    avatarColor: 'primary',
    subtitle: '5 hours ago',
    avatarText: 'Robert Austin',
    title: 'New user registered.'
  },
  {
    meta: '11 Aug',
    avatarAlt: 'message',
    title: 'New message received 👋🏻',
    avatarImg: '/images/avatars/5.png',
    subtitle: 'You have 10 unread messages'
  },
  {
    meta: '25 May',
    title: 'Paypal',
    avatarAlt: 'paypal',
    subtitle: 'Received Payment',
    avatarImg: '/images/misc/paypal.png'
  },
  {
    meta: '19 Mar',
    avatarAlt: 'order',
    title: 'Received Order 📦',
    avatarImg: '/images/avatars/3.png',
    subtitle: 'New order received from John'
  },
  {
    meta: '27 Dec',
    avatarAlt: 'chart',
    subtitle: '25 hrs ago',
    avatarImg: '/images/misc/chart.png',
    title: 'Finance report has been generated'
  }
]

const shortcuts = [
  // {
  //   title: 'Calendar',
  //   url: '/apps/calendar',
  //   subtitle: 'Appointments',
  //   icon: 'mdi:calendar-month-outline'
  // },
  {
    title: 'Invoice App',
    url: '/apps/invoice/list',
    subtitle: 'Manage Accounts',
    icon: 'mdi:receipt-text-outline'
  },
  {
    title: 'Users',
    url: '/users/',
    subtitle: 'Manage Users',
    icon: 'mdi:account-outline'
  },
  {
    title: 'Leaves',
    subtitle: 'Manage Leaves',
    icon: 'mdi:calendar-alert',
    url: '/absence-management/leaves/'
  },
  {
    title: 'Timesheet',
    subtitle: 'Timesheets',
    icon: 'mdi:window-maximize',
    url: '/timesheet/timeSheets'
  },
  {
    title: 'Client',
    subtitle: 'Manage Clients',
    icon: 'mdi:checkbox-marked-circle-outline',
    url: '/clients/'
  },
  {
    title: 'Projects',
    subtitle: 'Manage Prjects',
    icon: 'mdi:shield-check-outline',
    url: '/projects/list/'
  },
  // {
  //   url: '/apps/roles',
  //   title: 'Role Management',
  //   subtitle: 'Permissions',
  //   icon: 'mdi:shield-check-outline'
  // },
  {
    url: '/',
    title: 'Dashboard',
    icon: 'mdi:chart-pie',
    subtitle: 'User Dashboard'
  },
  {
    title: 'Settings',
    icon: 'mdi:cog-outline',
    subtitle: 'Account Settings',
    url: '/settings/Department/'
  }
  // {
  //   title: 'Help Center',
  //   subtitle: 'FAQs & Articles',
  //   icon: 'mdi:help-circle-outline',
  //   url: '/pages/help-center'
  // },

  // {
  //   title: 'Dialogs',
  //   subtitle: 'Useful Dialogs',
  //   icon: 'mdi:window-maximize',
  //   url: '/pages/dialog-examples'
  // },
]

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings } = props

  // ** Hook

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {auth.user && <Autocomplete hidden={hidden} settings={settings} />}
      <LanguageDropdown settings={settings} saveSettings={saveSettings} />
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      {auth.user && (
        <>
          <ShortcutsDropdown settings={settings} shortcuts={shortcuts} />
          <NotificationDropdown settings={settings} notifications={notifications} />
          <UserDropdown settings={settings} />
        </>
      )}
    </Box>
  )
}

export default AppBarContent
