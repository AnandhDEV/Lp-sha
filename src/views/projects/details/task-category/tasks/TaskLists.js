import { Icon } from '@iconify/react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  AvatarGroup,
  Button,
  Grid,
  IconButton,
  Link,
  Tooltip,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import React, { Fragment, useEffect, useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { formatLocalDate } from 'src/helpers/dateFormats'
import NewTask from 'src/views/projects/details/task-category/tasks/NewTask'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteTask,
  deleteTaskCategory,
  fetchTasks,
  setEditTask,
  setSelectedCategory,
  setSelectedCategoryId,
  setTaskLists
} from 'src/store/apps/projects'
import toast from 'react-hot-toast'
import { unwrapResult } from '@reduxjs/toolkit'
import FallbackSpinner from 'src/layouts/components/LogoSpinner'
import dynamic from 'next/dynamic'
import SimpleBackdrop, { BackdropSpinner, Spinner } from 'src/@core/components/spinner'
import { NODATA, STATUS, TASK_PRIORITIES, errorMessage } from 'src/helpers/constants'
import { handleResponse } from 'src/helpers/helpers'
import EmptyTask from './EmptyTask'
import { customErrorToast } from 'src/helpers/custom-components/toasts'
import jwt from 'jsonwebtoken'
import { useAuth } from 'src/hooks/useAuth'

const DynamicEditCategory = dynamic(
  () => import('src/views/projects/details/task-category/tasks/NewCategory'),
  {
    ssr: false
  }
)
const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false
})

const TaskLists = ({ isLoading, setLoading, id }) => {
  // const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [isOpenCategory, setOpenCategory] = useState(false)
  const [openAlert, setAlert] = useState(false)
  const [openCategoryAlert, setCategoryAlert] = useState(false)
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const [categories, setCategories] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [row, setRow] = useState({})
  const [category, setCategory] = useState(null)
  const [project, setProject] = useState(null)
  const [isUser, setIsUser] = useState(true)
  const [edit, setEdit] = useState(false)

  const [userData, setUserData] = useState({})

  const auth = useAuth()
  const Data = auth.user
  const IsUser = auth.user?.roleId == 4
  const roleId = auth.user?.roleId

  useEffect(() => {
    setIsUser(IsUser)
    setProject(JSON.parse(localStorage.getItem('project')))
    setUserData(Data)
  }, [])

  useEffect(() => {
    const sortedTaskList = store.taskLists ? [...store.taskLists] : []
    setCategories(sortedTaskList)
  }, [store.taskLists])

  // useEffect(() => {
  //   store.taskLists != null && setExpanded(store.taskLists[0])
  // }, [store.taskLists])
  const LinkStyled = styled(Link)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    textDecoration: 'none',
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }))

  const renderAssignedUserAvatar = row => {
    const stateNum = Math.floor(Math.random() * 6)
    const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
    const color = states[stateNum]

    return (
      <CustomAvatar
        skin='light'
        color={color}
        sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
      >
        {getInitials(row ? row : 'John Doe')}
      </CustomAvatar>
    )
  }

  const columns = [
    {
      flex: 0.01,
      minWidth: 100,
      field: 'id',
      headerName: 'Task Id',
      sortable: true
    },
    {
      flex: 0.02,
      minWidth: 150,
      field: 'taskName',
      headerName: 'Task Name',
      sortable: true
    },
    {
      flex: 0.3,
      minWidth: 230,
      field: 'taskDescription',
      headerName: 'Task Description',
      sortable: true
    },
    // {
    //   minWidth: 130,
    //   field: 'taskAssignedUserName',
    //   headerName: 'owner',
    //   sortable: false,
    //   renderCell: (params, i) => {
    //     return (
    //       // <Tooltip key={i} title={params?.value}>
    //       //   <Avatar sizes='' src={`/images/avatars/${params.row.id}.png`} alt={''} />
    //       // </Tooltip>
    //       <Tooltip key={i} title={params?.value}>
    //   {params?.value && (
    //     <Avatar sizes=''>
    //       {getInitials(params.value)}
    //     </Avatar>
    //   )}
    // </Tooltip>
    //     )
    //   }
    // },
    // {
    //   flex: 0.2,
    //   minWidth: 230,
    //   field: 'taskAssignedUserName',
    //   headerName: 'Assigned User',
    //   renderCell: ({ row }) => {
    //     const assignedUserName = row?.taskAssignedUserName;

    //     return (
    //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //         {renderAssignedUserAvatar(assignedUserName)}
    //         <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
    //           <LinkStyled href={`/users/${row.id}`}>{assignedUserName}</LinkStyled>
    //         </Box>
    //       </Box>
    //     );
    //   }
    // },
    {
      minWidth: 120,
      field: 'taskAssignedUserName',
      headerName: 'owner',
      sortable: true,
      renderCell: (params, i) => {
        return (
          <Tooltip key={i} title={params?.value}>
            {renderAssignedUserAvatar(params?.value)}
          </Tooltip>
        )
      }
    },
    {
      flex: 0.13,
      field: 'taskStatusId',
      headerName: 'Status',
      sortable: true,
      renderCell: params => {
        const status = STATUS.find(o => o.id == params.value)
        const statusChip = status ? (
          <CustomChip size='small' skin='light' color={status?.color} label={status?.name} />
        ) : (
          <CustomChip size='small' skin='light' color='primary' label={params.row.taskStatus} />
        )

        return statusChip
      }
    },

    {
      flex: 0.13,
      field: 'taskPriorityId',
      headerName: 'Priority',
      sortable: true,
      renderCell: params => {
        const priority = TASK_PRIORITIES.find(o => o.id == params.value)
        const priorityChip = priority ? (
          <CustomChip size='small' skin='light' color={priority?.color} label={priority?.name} />
        ) : (
          <CustomChip size='small' skin='light' color='secondary' label={params.row.taskPriority} />
        )

        return priorityChip
      }
    },

    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Due Date',
      field: 'dueDate',
      sortable: true,
      renderCell: params => {
        return formatLocalDate(new Date(params.value))
      }
    },
    // {
    //   flex: 0.13,
    //   minWidth: 120,
    //   headerName: 'Billable',
    //   field: 'isBillable',
    //   sortable: true,
    //   renderCell: params => (
    //     <Grid>
    //       {params.value ? (
    //         <CustomAvatar skin='light' color='success'>
    //           <Icon icon='mdi:checkbox-marked-circle-outline' />
    //         </CustomAvatar>
    //       ) : (
    //         <CustomAvatar skin='light' color='error'>
    //           <Icon icon='mdi:close-circle-outline' />
    //         </CustomAvatar>
    //       )}
    //     </Grid>
    //   )
    // },
    {
      flex: 0.1,
      minWidth: 130,
      sortable: true,
      field: 'actions',
      headerName: 'Actions',
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton
            color='info'
            size='small'
            onClick={async e => {

              function dataURLtoFile(dataurl, filename) {
                if (!dataurl) {
                  console.warn("dataURLtoFile: Provided data URL is null or undefined");

                  return null; // or some other appropriate response
                }

                var arr = dataurl.split(',');

                if (arr.length < 2) {
                  console.warn("dataURLtoFile: Malformed Data URL");

                  return null; // or another appropriate response
                }

                var mimeMatch = arr[0].match(/:(.*?);/);

                if (!mimeMatch || mimeMatch.length < 1) {
                  console.warn("dataURLtoFile: Unable to extract MIME type");

                  return null; // Return null or a default MIME type
                }

                var mime = mimeMatch[0]; // If we want to use the full matched string including ":" and ";"

                var bstr = atob(arr[arr.length - 1]);
                var n = bstr.length;
                var u8arr = new Uint8Array(n);

                // Convert base64 to Uint8Array
                while (n--) {
                  u8arr[n] = bstr.charCodeAt(n);
                }

                // Return a File object or null/other in case of an issue
                return new File([u8arr], filename, { type: mime });
              }


              //Usage example:
              var file = dataURLtoFile(params.row.files, params.row.fileName)
              setOpen(true), setEdit(true)
              dispatch(setEditTask({ ...params.row, files: file })),
                dispatch(
                  setSelectedCategory(
                    store.taskLists.find(o => o.taskCategoryId == params.row.taskCategoryId)
                      .taskCategory
                  )
                ),
                dispatch(
                  setSelectedCategoryId(
                    // store.taskLists.find(o => o.taskCategoryId == params.row.taskCategoryId)
                    //   .taskCategory
                    params.row.taskCategoryId
                  )
                ),
                localStorage.setItem(
                  'category',
                  JSON.stringify(
                    store.taskLists.find(o => o.taskCategoryId == params.row.taskCategoryId)
                  )
                )
            }}
          >
            <Icon icon='mdi:edit-outline' fontSize={20} />
          </IconButton>
          {(!isUser || store.projectRoleId !== 3) && (
            <IconButton
              color='error'
              size='small'
              onClick={() => {
                setRow(params.row), setAlert(true)
              }}
            >
              <Icon icon='mdi:trash-outline' fontSize={20} />
            </IconButton>
          )}
        </Box>
      )
    }
  ]

  const handleAccordionExpand = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  //delete state
  const deleteTaskState = row => {
    const categories = [...store.taskLists]
    const index = categories.findIndex(o => o.taskCategoryId == row.taskCategoryId)
    const tasks = [...categories[index].tasks.flat()]
    const taskIndex = tasks.findIndex(o => o.id == row.id)
    tasks.splice(taskIndex, 1)
    categories[index] = {
      ...categories[index],
      tasks: tasks
    }
    dispatch(setTaskLists(categories))
    setLoading(false)
  }

  const deleteTaskCategoryState = row => {
    let categories = [...store.taskLists]
    const index = categories.findIndex(o => o.taskCategoryId == row.taskCategoryId)
    categories.splice(index, 1)
    dispatch(setTaskLists(categories))
    setLoading(false)
  }

  const handleDeleteTask = () => {
    try {
      setAlert(false)
      setLoading(true)
      dispatch(deleteTask(row?.id))
        .then(unwrapResult)
        .then(res => {
          handleResponse('delete', res, deleteTaskState, row)
        })
    } catch (error) {
      toast.error(error.responseMessage, { duration: 3000, position: 'top-right' })
    }
  }

  const handleDeleteCategory = () => {
    try {
      setCategoryAlert(false)
      setLoading(true)
      dispatch(deleteTaskCategory(category?.taskCategoryId))
        .then(unwrapResult)
        .then(res => {
          handleResponse('delete', res, deleteTaskCategoryState, category)
          res?.hasError && setLoading(false)
        })
    } catch (error) {
      customErrorToast(errorMessage.default)
    }
  }

  const handleClose = () => {
    setCategory(null)
    setOpenCategory(false)
  }

  const privilege =
    roleId == 1 ||
    roleId == 3 ||
    store.projectRoleId != 3 ||
    (store.projectRoleId == 3 && project?.allowUsersToCreateNewTask)

  return (
    <>
      {isLoading ? (
        <BackdropSpinner />
      ) : store.taskLists?.length == 0 ? (
        <EmptyTask />
      ) : (
        categories?.length > 0 &&
        categories.map((catgry, key) => (
          <Fragment key={key}>
            <Accordion
              expanded={expanded === catgry?.taskCategoryId}
              onChange={handleAccordionExpand(catgry.taskCategoryId)}
            >
              <AccordionSummary
                id='customized-panel-header-1'
                aria-controls='customized-panel-content-1'

              // expandIcon={expanded === category ? <Icon icon="mdi:chevron-up" /> : <Icon icon="mdi:chevron-down" />}
              >
                <Box className='gap-1' display='flex' justifyContent='space-between' width={'100%'}>
                  <Typography variant='body1' color='secondary'>
                    {catgry.taskCategory}
                  </Typography>
                  <Box className='d-flex' sx={{ gap: '0.5rem' }}>
                    {privilege && (
                      <>
                        <Button
                          className='rounded-btn'
                          variant='text'
                          size='small'
                          sx={{ background: '#f1e9fb' }}
                          onClick={e => {
                            e.stopPropagation()
                            setOpen(true), setEdit(false)
                            setCategory(catgry),
                              dispatch(setSelectedCategory(catgry?.taskCategory)),
                              dispatch(setSelectedCategoryId(catgry?.taskCategoryId)),
                              localStorage.setItem('category', JSON.stringify(catgry))
                          }}
                        >
                          Add Task
                        </Button>
                        <IconButton
                          color='info'
                          size='small'
                          onClick={e => {
                            setOpenCategory(true), setCategory(catgry)
                          }}
                        >
                          <Icon icon='mdi:edit-outline' fontSize={20} />
                        </IconButton>
                      </>
                    )}

                    {(roleId == 1 || roleId == 3 || store.projectRoleId != 3) && (
                      <IconButton
                        color='error'
                        size='small'
                        disabled={catgry.tasks?.length > 0}
                        onClick={() => {
                          setCategory(catgry), setCategoryAlert(true)
                        }}
                      >
                        <Icon icon='mdi:trash-outline' fontSize={20} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <DataGrid
                  autoHeight
                  rows={catgry.tasks || []}
                  columns={columns}
                  disableRowSelectionOnClick
                  hideFooter
                  disableColumnMenu
                  localeText={{ noRowsLabel: NODATA.noData('task') }}
                  sx={{
                    '&, [class^=MuiDataGrid]': { border: 'none' },
                    '&:hover': { cursor: 'pointer' }
                  }}
                />
              </AccordionDetails>
            </Accordion>
          </Fragment>
        ))
      )}
      <Fragment>
        {/* {store.taskLists == null && <Spinner />} */}

        <NewTask isOpen={isOpen} setOpen={setOpen} category={category} edit={edit} id={id} />
        <DynamicEditCategory
          isOpen={isOpenCategory}
          setOpen={setOpenCategory}
          category={category}
          onClose={handleClose}
        />
        <DynamicDeleteAlert
          open={openAlert}
          setOpen={setAlert}
          title='Delete Task'
          action='Delete'
          handleAction={handleDeleteTask}
        />
        <DynamicDeleteAlert
          open={openCategoryAlert}
          setOpen={setCategoryAlert}
          title='Delete Category'
          action='Delete'
          handleAction={handleDeleteCategory}
        />
      </Fragment>
    </>
  )
}

export default TaskLists
