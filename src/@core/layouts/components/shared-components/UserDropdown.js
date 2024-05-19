// ** React Imports
import { useState, Fragment, useEffect, useRef } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useDispatch, useSelector } from 'react-redux'
import { setRole, setUser } from 'src/store/authentication/register'
import { resetLeaves } from 'src/store/absence-management'
import { resetTimeSheets } from 'src/store/timesheets'
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = props => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hooks
  const router = useRouter()

  //** Redux store */
  const store = useSelector(state => state.user)
  const _leaveStore = useSelector(state => state.leaveManagement)
  const dispatch = useDispatch()
  const auth = useAuth()
  const roleId = auth.user?.roleId;
  const Data = auth.user
  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  }

  const handleLogout = () => {
    handleDropdownClose()
    setUser(null)
    localStorage.clear()
    dispatch(resetLeaves())
    dispatch(resetTimeSheets())
    dispatch(setRole(4))
    router.push('/login')
  }

  // let userRef = useRef(null)
  // let userData = userRef?.current
  // useEffect(() => {
  //   const Data = localStorage?.getItem('userData')
  //   userRef.current = JSON.parse(Data)
  // }, [])

  const getroleName = id => {
    if (id === '1') return 'Admin'
    // if (id === '2') return 'Management'
    if (id === '3') return 'Operations'
    if (id === '4') return 'User'
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar
          alt={Data?.first_name}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}

        // src='/images/avatars/1.png'
        >
          {Data?.first_name?.charAt(0)}
        </Avatar>
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar sx={{ width: '2.5rem', height: '2.5rem' }}>
                {Data?.first_name?.charAt(0)}
              </Avatar>
            </Badge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{Data?.first_name}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {/* {store.loggedInUser.userData.role?.charAt(0).toUpperCase() + store.loggedInUser.userData.role?.slice(1)} */}
                {getroleName(roleId)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: '0 !important' }} />
        <MenuItem
          sx={{ p: 0 }}
          onClick={() =>
            handleDropdownClose(`/users/${JSON.parse(localStorage.getItem('userId'))}/`)
          }
        >
          <Box sx={styles}>
            <Icon icon='mdi:account-outline' />
            Profile
          </Box>
        </MenuItem>
        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/apps/email')}>
          <Box sx={styles}>
            <Icon icon='mdi:email-outline' />
            Inbox
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/apps/chat')}>
          <Box sx={styles}>
            <Icon icon='mdi:message-outline' />
            Chat
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem
          sx={{ p: 0 }}
          onClick={() => handleDropdownClose('/pages/account-settings/account')}
        >
          <Box sx={styles}>
            <Icon icon='mdi:cog-outline' />
            Settings
          </Box>
        </MenuItem> */}
        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/pricing')}>
          <Box sx={styles}>
            <Icon icon='mdi:currency-usd' />
            Pricing
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/faq')}>
          <Box sx={styles}>
            <Icon icon='mdi:help-circle-outline' />
            FAQ
          </Box>
        </MenuItem>
        <Divider /> */}
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon='mdi:logout-variant' />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
