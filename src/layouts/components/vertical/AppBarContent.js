// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

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
  //**LEAVE MANAGEMENT ONLY */
  // {
  //   title: 'Users',
  //   url: '/users/',
  //   subtitle: 'Manage Users',
  //   icon: 'mdi:account-outline'
  // },
  // {
  //   title: 'Leaves',
  //   subtitle: 'Manage Leaves',
  //   icon: 'mdi:calendar-alert',
  //   url: '/absence-management/leaves/'
  // },
  // {
  //   title: 'Settings',
  //   icon: 'mdi:cog-outline',
  //   subtitle: 'Account Settings',
  //   url: '/settings/Settings/'
  // }
  // --------------  ALL ----------------
  // {
  //   title: 'Calendar',
  //   url: '/apps/calendar',
  //   subtitle: 'Appointments',
  //   icon: 'mdi:calendar-month-outline'
  // },
  // {
  //   title: 'Invoice App',
  //   url: '/apps/invoice/list',
  //   subtitle: 'Manage Accounts',
  //   icon: 'mdi:receipt-text-outline'
  // },
  // {
  //   url: '/',
  //   title: 'Dashboard',
  //   icon: 'mdi:chart-pie',
  //   subtitle: 'User Dashboard'
  // },
  {
    title: 'Absence',
    subtitle: 'Manage Leaves',
    icon: 'mdi:calendar-alert',
    url: '/absence-management/leaves/'
  },
  {
    title: 'Client',
    subtitle: 'Manage Clients',
    icon: 'mdi:account-group-outline',
    url: '/clients/'
  },
  {
    title: 'Projects',
    subtitle: 'Manage Prjects',
    icon: 'mdi:clipboard-text',
    url: '/projects/list/'
  },
  {
    title: 'Users',
    url: '/users/',
    subtitle: 'Manage Users',
    icon: 'mdi:account-outline'
  },
  {
    title: 'Settings',
    icon: 'mdi:cog-outline',
    subtitle: 'Account Settings',
    url: '/settings/Department/'
  },

  {
    title: 'Timesheet',
    subtitle: 'Timesheets',
    icon: 'mdi:clock-time-four-outline',
    url: '/timesheet/timeSheets'
  }
]

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  // ** Hook

  return (
    <Box
      sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden && !settings.navHidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon='mdi:menu' />
          </IconButton>
        ) : null}
        {<Autocomplete hidden={hidden} settings={settings} />}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        {
          <>
            <ShortcutsDropdown settings={settings} shortcuts={shortcuts} />
            {/* <NotificationDropdown settings={settings} notifications={notifications} /> */}
            <UserDropdown settings={settings} />
          </>
        }
      </Box>
    </Box>
  )
}

export default AppBarContent
