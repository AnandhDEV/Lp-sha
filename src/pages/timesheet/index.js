import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import { CircularProgress, Grid, Tab } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled } from '@mui/material/styles'
import { fetchConfig, addConfig, fetchHRApprovals } from 'src/store/settings'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import MuiTabList from '@mui/lab/TabList'
import Icon from 'src/@core/components/icon'
import SimpleBackdrop, { Spinner } from 'src/@core/components/spinner'
import SettingsConfig from 'src/views/configuration/settings'
import NewSkill from 'src/views/configuration/skills/NewSkill'
import dynamic from 'next/dynamic'
import Report from 'src/views/timesheets/Report'
import ReportDetailsTable from 'src/views/timesheets/ReportDetailsTable'
import { useAuth } from 'src/hooks/useAuth'
import { fetchAssignedProject } from 'src/store/timesheets/index'
import { unwrapResult } from '@reduxjs/toolkit'
import ApprovalTable from 'src/views/timesheets/ApprovalTable'

const DynamicTimeSheets = dynamic(() => import('src/views/timesheets/TimeSheets'))
const DynamicTimeSheetApproval = dynamic(() => import('src/views/timesheets/TimeSheetApproval'))


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

const AppTimeSheets = ({ tab }) => {
  const [activeTab, setActiveTab] = useState(tab)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    //data == null && dispatch(fetchData())
    projectData == null &&
      dispatch(fetchAssignedProject())
        .then(unwrapResult)
        .then(() => {
          setIsLoading(false)
        })
  }, [])

  //const store = useSelector(state => state.projects)
  const { projectData } = useSelector(state => state.timesheets)
  const auth = useAuth()
  const Data = auth.user
  const roleId = auth.user?.roleId
  const IsUser = auth.user?.roleId == 4
  const isProjectManager = projectData?.some(project => project.currentUserIsProjectManager)


  // ** Hooks
  const router = useRouter()
  const hideText = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const dispatch = useDispatch()
  const { selectedRow } = useSelector(state => state.reports)
  const { timeSheetApprovalsRowId  } = useSelector(state => state.timesheets)


  const handleChange = (event, value) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/timesheet/${value}`
      })
      .then(() => setIsLoading(false))
  }
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const tabContentList = {
    timeSheets: <DynamicTimeSheets />,
    approval: timeSheetApprovalsRowId ? <DynamicTimeSheetApproval /> : <ApprovalTable/>,
    Report: selectedRow ? <ReportDetailsTable id={selectedRow.id} /> : <Report />
  }

  // const tabs =
  //    roleId || roleId == 1 || roleId == 3 || isProjectManager
  //     ? [
  //         { name: 'timeSheets', icon: 'mdi:clock-outline' },
  //         { name: 'approval', icon: 'mdi:check-decagram-outline' },
  //         { name: 'Report', icon: 'mdi:chart-box' }
  //       ]
  //     : IsUser
  //     ? [
  //         { name: 'timeSheets', icon: 'mdi:clock-outline' },
  //         { name: 'approval', icon: 'mdi:check-decagram-outline' }
  //       ]
  //     : []

  const tabs =
    (roleId == 1 || roleId == 3 || isProjectManager)
      ? [
        { name: 'timeSheets', icon: 'mdi:clock-outline' },
        { name: 'approval', icon: 'mdi:check-decagram-outline' },
        { name: 'Report', icon: 'mdi:chart-box' }
      ]
      : (IsUser & isProjectManager != undefined)
        ? [
          { name: 'timeSheets', icon: 'mdi:clock-outline' },
          { name: 'approval', icon: 'mdi:check-decagram-outline' }
        ]
        : [];
        

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {activeTab ? (
          <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid item xs={12} display='flex' justifyContent='space-between' alignItems='center'>
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
                          {!hideText && tab.name}
                        </Box>
                      }
                    />
                  ))}
                </TabList>
              </Grid>
              <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <TabPanel sx={{ p: 0 }} value={activeTab}>
                    <Grid xs={12}>{tabContentList[activeTab]}</Grid>
                  </TabPanel>
                )}
              </Grid>
            </Grid>
          </TabContext>
        ) : (
          <SimpleBackdrop />
        )}
      </Grid>
    </Grid>
  )
}

export default AppTimeSheets
