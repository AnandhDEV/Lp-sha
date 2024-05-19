// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Components
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiTabList from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components
import Approval from 'src/views/absence-management/approval'
import LeaveApply from 'src/views/absence-management/apply'
import LeaveReports from 'src/views/absence-management/reports'
import LeavePolicy from 'src/views/absence-management/leave-policy'
import { Button } from '@mui/material'
import NewLeavePolicy from 'src/views/absence-management/leave-policy/NewLeavePolicy'
import Holidays from 'src/views/absence-management/holidays'
import { useDispatch, useSelector } from 'react-redux'
import FallbackSpinner from 'src/layouts/components/LogoSpinner'
import SimpleBackdrop, { Spinner } from 'src/@core/components/spinner'
import SidebarAddHoliday from 'src/views/pages/account-settings/holiday/AddHolidayDrawer'
import { fetchHolidays } from 'src/store/apps/accountSetting'
import dynamic from 'next/dynamic'
import { useAuth } from 'src/hooks/useAuth'
import LeaveFile from 'src/views/absence-management/apply/LeaveFile'

const DynamicLeaveForm = dynamic(
  () => import('src/views/absence-management/apply/LeaveApplyForm'),
  {
    ssr: false
  }
)

const TabList = styled(MuiTabList)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    borderBottom: `3px solid ${theme.palette.primary.main}`,
    color: `${theme.palette.primary.main} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 38,
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),

    // borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('sm')]: {
      minWidth: 130
    }
  }
}))

const LeaveManagement = ({ tab, data }) => {
  // ** State
  const [activeTab, setActiveTab] = useState('leaves')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [role, setRole] = useState('')
  const dispatch = useDispatch()
  const [isOpenImport, setOpenImport] = useState(false)


  // ** Hooks
  const router = useRouter()
  const hideText = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const store = useSelector(state => state.user)
  const _store = useSelector(state => state.accountSetting)
  const auth = useAuth()
  const roleId = auth?.user?.roleId

  const handleChange = (event, value) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/absence-management/${value}`
      })
      .then(() => setIsLoading(false))
  }
  useEffect(() => {
    if (data) {
      setIsLoading(false)
    }
  }, [data])
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
    if (typeof window !== 'undefined') {
      // Perform localStorage action
      setRole(roleId || 4)
    }
  }, [activeTab, dispatch, tab])

  const tabContentList =
    role == 1 || role == 3
      ? {
        leaves: <LeaveApply />,
        approval: <Approval />,
        reports: <LeaveReports />,
        leave_policy: <LeavePolicy />,
        holidays: <Holidays />
      }
      : {
        leaves: <LeaveApply />,
        leave_policy: <LeavePolicy />,
        holidays: <Holidays />
      }

  const tabs =
    role == 1 || role == 3
      ? [
        { name: 'leaves', icon: 'mdi:calendar-alert' },
        // { name: 'all requests', icon: 'mdi:calendar-outline' },
        { name: 'approval', icon: 'mdi:check-decagram' },
        { name: 'reports', icon: 'mdi:chart-box' },
        { name: 'leave_policy', icon: 'mdi:text-box-multiple-outline' },
        { name: 'holidays', icon: 'mdi:toggle-switch-off-outline' }
      ]
      : [
        { name: 'leaves', icon: 'mdi:calendar-alert' },
        { name: 'leave_policy', icon: 'mdi:text-box-multiple-outline' },
        { name: 'holidays', icon: 'mdi:toggle-switch-off-outline' }
      ]


  const handleImport = () => {
    setOpenImport(true)
  }

  return (
    <Grid container spacing={6}>
      {activeTab === undefined ? null : (
        <>
          <Grid item xs={12}>
            <TabContext value={activeTab}>
              <Grid container spacing={6}>
                <Grid
                  item
                  xs={12}
                  display='flex'
                  justifyContent='space-between'
                  flexWrap='wrap'
                  alignItems='center'
                >
                  <TabList
                    variant='scrollable'
                    scrollButtons='auto'
                    onChange={handleChange}
                    aria-label='basic tabs example'
                  >
                    {tabs.map((tab, key) => (
                      <Tab
                        key={key}
                        value={tab.name}
                        label={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              ...(!hideText && { '& svg': { mr: 2 } })
                            }}
                          >
                            <Icon fontSize={20} icon={tab.icon} />
                            {!hideText && (tab.name === 'leave_policy' ? 'leave policy' : tab.name)}
                          </Box>
                        }
                      />
                    ))}
                  </TabList>

                  {activeTab === 'leaves' && (
                    <Box display='flex' className='gap-1'>

                      <Button
                        color='secondary'
                        size='small'
                        variant='outlined'
                        sx={{ fontSize: hideText ? 12 : 14 }}
                        startIcon={<Icon icon='system-uicons:import' />}
                        onClick={handleImport}
                      >
                        Import
                      </Button>

                      <Button variant='contained' onClick={() => setOpen(true)}>
                        Apply Leave
                      </Button>
                    </Box>
                  )}


                  {activeTab === 'leave_policy' && role != 4 && (
                    <Button variant='contained' onClick={() => setOpen(true)}>
                      Add {activeTab === 'leave_policy' ? 'Leave Policy' : activeTab}
                    </Button>
                  )}
                  {activeTab === 'holidays' && role != 4 && (
                    <Button variant='contained' onClick={() => setOpen(true)}>
                      Add Holiday
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
                  {isLoading ? (
                    <Box
                      sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                    >
                      {/* <CircularProgress sx={{ mb: 4 }} />
                      <Typography>Loading...</Typography> */}
                      <Spinner />
                    </Box>
                  ) : (
                    <TabPanel sx={{ p: 0 }} value={activeTab}>
                      {tab === 'files' ? (
                        <Grid xs={12}>{tabContentList[activeTab]}</Grid>
                      ) : (
                        tabContentList[activeTab]
                      )}
                    </TabPanel>
                  )}
                </Grid>
              </Grid>
            </TabContext>
          </Grid>
          <Grid item xs={12}>
            {activeTab === 'leaves' ? (
              <DynamicLeaveForm isOpen={isOpen} setOpen={setOpen} />
            ) : activeTab === 'holidays' ? (
              <SidebarAddHoliday open={isOpen} holidays={_store.holidays || []} toggle={setOpen} />
            ) : (
              <NewLeavePolicy isOpen={isOpen} setOpen={setOpen} />
            )}
            {isOpenImport && <LeaveFile isOpenImport={isOpenImport} setOpenImport={setOpenImport} />}
          </Grid>

        </>
      )}
    </Grid>
  )
}

export default LeaveManagement
