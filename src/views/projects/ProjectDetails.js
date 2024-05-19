/* eslint-disable react-hooks/exhaustive-deps */
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
import Members from 'src/views/projects/details/members'
import Settings from 'src/views/projects/details/settings'
import TaskCategory from 'src/views/projects/details/task-category'
import MileStone from 'src/views/projects/details/milestone'
import Feedback from 'src/views/projects/details/feedback'
import ProjectHeader from 'src/views/projects/details/ProjectHeader'
import { Alert, Button, IconButton, Menu, MenuItem, Snackbar } from '@mui/material'
import NewTaskCategory from 'src/views/projects/details/task-category/tasks/NewCategory'
import NewMileStone from './details/milestone/NewMileStone'
import { useDispatch, useSelector } from 'react-redux'
import NewMember from './details/members/NewMember'
import NewFeedback from './details/feedback/NewFeedback'
import Files from './details/files'
import Link from 'next/link'
import {
  bulkTaskCreate,
  fetchProjectAssignees,
  fetchProjectById,
  fetchProjectMembers,
  resetProjectDetails,
  setEditExpenses,
  setEditMilestone,
  setEditProjectMember,
  setExpenses,
  setMileStones,
  setProjectFiles,
  setProjectMembers
} from 'src/store/apps/projects'
import toast from 'react-hot-toast'
import CustomBackButton from 'src/@core/components/back-button'
import { Spinner } from 'src/@core/components/spinner'
import Expenses from './details/expenses'
import NewExpenses from './details/expenses/NewExpenses'
import AddFiles from './details/files/AddFiles'
import { PROJECT_OPTIONS } from 'src/helpers/constants'
import Header from 'src/views/projects/details/Header'
import jwt from 'jsonwebtoken'
import { useAuth } from 'src/hooks/useAuth'
import AddTaskFiles from './details/task-category/tasks/AddTaskFiles'

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

const ProjectDetails = ({ id, tab, data }) => {
  // ** State
  const [activeTab, setActiveTab] = useState(tab == '[tab]' ? 'task' : tab)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [isOpenImport, setOpenImport] = useState(false)
  const [open, setOpenSnack] = useState(false)
  const [snackPack, setSnackPack] = useState([])
  const [messageInfo, setMessageInfo] = useState('')
  const [project, setProject] = useState(null)
  const [projectName, setProjectName] = useState(null)
  const [isUser, setIsUser] = useState(true)
  const [projectId, setProjectId] = useState('')

  const [userData, setUserData] = useState({})

  const [state, setState] = useState({
    openAlert: false,
    vertical: 'top',
    horizontal: 'center'
  })
  const { vertical, horizontal, openAlert } = state

  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const auth = useAuth()
  const Data = auth.user
  const roleId = auth.user?.roleId
  const IsUser = auth.user?.roleId == 4

  useEffect(() => {
    setProjectId(id)
    setUserData(Data)
    setIsUser(IsUser)
    dispatch(fetchProjectById(id)).then(res => {
      const response = res.payload?.result
      setProject(response)
      setProjectName(response?.name)
    })

    return () => {
      dispatch(resetProjectDetails(null))
      store.projectMembers
    }
  }, [id])

  useEffect(() => {
    dispatch(fetchProjectMembers(id))
  }, [id])

  // ** Hooks
  const router = useRouter()
  const hideText = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const handleChange = (event, value) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/projects/details/${value}/${id}`
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
  }, [tab])

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setOpenSnack(true)
      setMessageInfo(snackPack[0].message)
      setSnackPack(prev => prev.slice(1))
    } else if (snackPack.length && open) {
      setOpenSnack(false)
    }
  }, [snackPack, open])

  const privilege = roleId == 1 || store.projectRoleId == 1 || roleId == 3
  const privilegeAddButton =
    roleId == 1 ||
    roleId == 3 ||
    store.projectRoleId == 1 ||
    store.projectRoleId == 2 || (store.projectRoleId == 3 && project?.allowUsersToCreateNewTask == true)

  const contentList = {
    task: <TaskCategory id={id} />,
    milestone: <MileStone setOpen={setOpen} id={id} />,
    feedback: <Feedback data={store.feedbacks} />,
    members: <Members data={store.projectMembers} setOpen={setOpen} id={id} />,
    settings: <Settings id={id} />,
    files: <Files id={id} />,
    expenses: <Expenses id={id} />
  }

  const { settings, expenses, ...contentListUserandTL } = contentList

  const tabContentList = privilege ? contentList : contentListUserandTL

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnack(false)
    setState(newState => ({ ...newState, openAlert: false }))
  }

  const handleExited = () => {
    setMessageInfo(undefined)
  }

  //SHOW DRAWER

  const showDrawer = name => () => {
    dispatch(setEditMilestone(null))
    dispatch(setEditProjectMember(null))
    dispatch(setEditExpenses(false))
    setOpen(true)
  }

  //handle reports

  const handleReports = newState => () => {
    const message = 'No tasks found in report'
    const tasks = store.taskLists?.flatMap(o => o.tasks)
    if (tasks.length > 0 && tasks != null) {

      router.push({ pathname: `/projects/reports/${'report'}/${projectId}` })
    } else {
      setSnackPack(prev => [...prev, { message, key: new Date().getTime() }])
      setState({ ...newState, openAlert: true })
    }
  }

  //handle import
  const handleImport = () => {
    setOpenImport(true)
  }



  return (
    <Grid container spacing={6}>
      <Header projectName={projectName} id={id} />
      {activeTab === undefined ? null : (
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid item xs={12} display='flex' justifyContent='space-between' alignItems='center'>
                <TabList
                  variant='scrollable'
                  scrollButtons='auto'
                  onChange={handleChange}
                  aria-label='basic tabs example'
                >
                  <Tab
                    value='task'
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ...(!hideText && { '& svg': { mr: 2 } })
                        }}
                      >
                        <Icon fontSize={20} icon='mdi:checkbox-marked-circle-auto-outline' />
                        {!hideText && 'Tasks'}
                      </Box>
                    }
                  />
                  <Tab
                    value='milestone'
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ...(!hideText && { '& svg': { mr: 2 } })
                        }}
                      >
                        <Icon fontSize={20} icon='mdi:flag-triangle' />
                        {!hideText && 'Milestones'}
                      </Box>
                    }
                  />
                  <Tab
                    value='members'
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ...(!hideText && { '& svg': { mr: 2 } })
                        }}
                      >
                        <Icon fontSize={20} icon='mdi:account-multiple-outline' />
                        {!hideText && 'Members'}
                      </Box>
                    }
                  />
                  {privilege && (
                    <Tab
                      value='settings'
                      label={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            ...(!hideText && { '& svg': { mr: 2 } })
                          }}
                        >
                          <Icon fontSize={20} icon='mdi:cog-outline' />
                          {!hideText && 'Settings'}
                        </Box>
                      }
                    />
                  )}

                  <Tab
                    value='files'
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ...(!hideText && { '& svg': { mr: 2 } })
                        }}
                      >
                        <Icon fontSize={20} icon='mdi:file-outline' />
                        {!hideText && 'Files'}
                      </Box>
                    }
                  />
                  {privilege && (
                    <Tab
                      value='expenses'
                      label={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            ...(!hideText && { '& svg': { mr: 2 } })
                          }}
                        >
                          <Icon fontSize={20} icon='mdi:currency-usd' />
                          {!hideText && 'Expenses'}
                        </Box>
                      }
                    />
                  )}
                </TabList>{' '}

                <Box display='flex' className='gap-1'>
                  {privilegeAddButton && tab == 'task' &&
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
                  }
                  {privilege && (
                    <Button
                      variant='contained'
                      size='small'
                      color='secondary'
                      sx={{ fontSize: hideText ? 12 : 14 }}
                      onClick={handleReports({ vertical: 'top', horizontal: 'center' })}

                      // startIcon={<Icon icon='mdi:chart-box' fontSize={20} />}
                      disabled={store.taskLists == null || store.taskLists?.length == 0}
                    >
                      Reports
                    </Button>
                    // <Link href={`/project/report/report/${projectId}`}>
                  )}

                  {privilegeAddButton && (
                    <>
                      {tab !== 'settings' && tab != '[tab]' && (
                        <Button
                          size='small'
                          variant='contained'
                          sx={{ fontSize: hideText ? 12 : 14 }}
                          // startIcon={<Icon icon='mdi:add' fontSize={20} />}
                          onClick={showDrawer(tab === 'task' ? 'Category' : tab)}
                        >
                          {`Add ${tab === 'task' ? 'Category' : tab}`}
                        </Button>
                      )}
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
                {isLoading ? (
                  <Box
                    sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                  >
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
      )}
      {isOpenImport && <AddTaskFiles isOpenImport={isOpenImport} setOpenImport={setOpenImport} id={id} />}

      {tab === 'task' ? (
        <NewTaskCategory isOpen={isOpen} setOpen={setOpen} id={id} />
      ) : tab === 'milestone' ? (
        <NewMileStone isOpen={isOpen} setOpen={setOpen} id={id} />
      ) : tab === 'members' ? (
        <NewMember isOpen={isOpen} setOpen={setOpen} id={id} />
      ) : tab === 'feedback' ? (
        <NewFeedback isOpen={isOpen} setOpen={setOpen} />
      ) : tab === 'expenses' ? (
        <NewExpenses isOpen={isOpen} setOpen={setOpen} id={id} />
      ) : tab === 'files' ? (
        <AddFiles isOpen={isOpen} setOpen={setOpen} id={id} />
      ) : (
        <></>
      )}

      <Snackbar
        open={openAlert}
        onClose={handleClose}
        autoHideDuration={3000}
        TransitionProps={{ onExited: handleExited }}
        key={messageInfo ? messageInfo.key : undefined}
        message={messageInfo ? messageInfo.message : undefined}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          elevation={3}
          variant='filled'
          onClose={handleClose}
          sx={{ width: '100%' }}
          severity={messageInfo?.message === 'success' ? 'success' : 'error'}
        >
          {messageInfo}
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default ProjectDetails
