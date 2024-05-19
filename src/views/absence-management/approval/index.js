// ** React Imports
import { useEffect, useState, useCallback, useRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

// ** ThirdParty Components
import axios from 'axios'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import {
  AvatarGroup,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  Popover,
  TextField,
  Tooltip
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import OptionsMenu from 'src/@core/components/option-menu'
import FallbackSpinner, { BackdropSpinner } from 'src/@core/components/spinner'
import { unwrapResult } from '@reduxjs/toolkit'
import LeaveHeader from 'src/views/absence-management/LeaveHeader'
import Toolbar from 'src/views/absence-management/toolBar'
import { useTheme } from '@emotion/react'
import toast from 'react-hot-toast'
import {
  fetchApprovals,
  fetchPolicies,
  fetchRequests,
  fetchStatus,
  fetchUsers,
  postLeaveApproval,
  putRequestApproval,
  setApprovals,
  setLeaveApproval
} from 'src/store/absence-management'
import { formatLocalDate } from 'src/helpers/dateFormats'
import { approvalRequest } from 'src/helpers/requests'
import { customErrorToast, customSuccessToast } from 'src/helpers/custom-components/toasts'
import SimpleBackdrop from 'src/@core/components/spinner'
import { handleResponse } from 'src/helpers/helpers'
import { LEAVE_STATUS, NODATA } from 'src/helpers/constants'
import { createPortal } from 'react-dom';

const Approval = () => {
  let commentVar = ""
  // ** States
  const [total, setTotal] = useState(0)
  const [comment, setComment] = useState('')
  const commentRef = useRef(null)
  const [isLoading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredRows, setFilteredRows] = useState([])
  const [errorComment, setErrorComment] = useState(false)
  const [dialog, setDialog] = useState('')
  const [data, setData] = useState({})


  // const [respond, setRespond] = useState({
  //   isRejected: false,
  //   isOpenDialog: false,
  //   isApproved: false.valueOf,
  //   rejectData: {},
  //   isLoading: false
  // })
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const theme = useTheme()


  useEffect(() => {
    store.approvals == null && dispatch(fetchApprovals()).then(() => setLoading(false))
  }, [])


  const columns = [
    {
      flex: 0.35,
      field: 'userName',
      headerName: 'User',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <CustomAvatar
              src={row.image}
              skin='light'
              color='primary'
              sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
            >
              {getInitials(row.userName ? row.userName : 'Unknown User')}
            </CustomAvatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant=''>{row?.userName}</Typography>
              <Typography variant='caption'>{row?.email}</Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 120,
      headerName: 'Request',
      field: 'request'
    },
    // {
    //   flex: 0.2,
    //   headerName: 'Reason',
    //   field: 'requestReason',
    //   renderCell: params => <div style={{ whiteSpace: 'pre-line' }}>{params.value}</div>
    // },

    {
      flex: 0.16,
      field: 'duration',
      headerName: 'Duration',

    },

    {
      flex: 0.16,
      field: 'fromDate',
      headerName: 'From Date',
      renderCell: params => {
        return <>{formatLocalDate(new Date(params.value))}</>
      }
    },
    {
      flex: 0.16,
      field: 'toDate',
      headerName: 'To Date',
      renderCell: params => {
        return <>{formatLocalDate(new Date(params.value))}</>
      }
    },
    {
      flex: 0.175,
      minWidth: 110,
      field: 'status',
      headerName: 'Status',
      renderCell: params => {
        const status = LEAVE_STATUS.find(o => o.id == params.row.requestStatusId)

        return <CustomChip size='small' label={status.name} skin='light' color={status.color} />
      }
    },
    {
      flex: 0.26,
      sortable: false,
      field: 'action',
      headerName: 'Action',
      align: 'left',
      renderCell: params => {
        const status = LEAVE_STATUS.find(o => o.id == params.row.requestStatusId)
        const currentUserId = localStorage.getItem('userId')
        const index = params?.row.notifiers.split(',').indexOf(currentUserId)

        return (
          <Box columnGap={2} sx={{ display: 'flex' }}>
            {(status.id === 4 && index == 0) || (status.id === 7 && [1, 2].includes(index)) ? (
              <Box className='gap-1' sx={{ display: 'flex', alignItems: 'center' }}>
                <>
                  <Button
                    size='small'
                    variant='contained'
                    onClick={() => {
                      setData(params.row)
                      setDialog('reject')
                    }}
                    color='error'
                    sx={{ fontSize: 12 }}
                  >
                    Reject
                  </Button>
                  <Button
                    size='small'
                    variant='contained'
                    onClick={() => {
                      setData(params.row)
                      setDialog('approve')
                    }} color='success'
                    sx={{ fontSize: 12 }}
                  >
                    Approve
                  </Button>
                </>
              </Box>
            ) : (
              <></>
            )}
          </Box>
        )
      }
    }
  ]

  //UPDATE APPROVAL STATE
  const updateApprovalState = newApproval => {
    let approvals = [...store.approvals]
    const indexToReplace = approvals.findIndex(
      item => item.leaveRequestApprovalId === newApproval?.id
    )

    if (indexToReplace !== -1) {
      approvals[indexToReplace] = {
        ...approvals[indexToReplace],
        comment: newApproval.comment,
        status: newApproval.requestStatusName,
        requestStatusId: newApproval.statusId
      }
    }
    dispatch(setLeaveApproval(approvals))
  }


  const resetForm = () => {
    setComment('');
    setErrorComment(false);
    //commentRef.current.value = ''; 
  };

  //handle approval
  const handleApproval = () => {
    // setRespond(state => ({ ...state, isOpenDialog: false, isLoading: true }))

    if (dialog === 'reject' && (!commentVar || commentVar.trim() === '')) {
      setErrorComment(true);
      setLoading(false)

      return;
    }

    setErrorComment(false);
    const req = {
      ...data,
      comment: commentVar,
      leaveStatusId:
        data.requestStatusId == 4 && dialog == 'approve'
          ? 5
          : data.requestStatusId == 4 && dialog == 'reject'
            ? 6
            : data.requestStatusId == 7 && dialog == 'approve'
              ? 8
              : data.requestStatusId == 7 && dialog == 'reject'
                ? 9
                : 0,
      approvalLevelId: data.currentLevelId
    }
    setDialog('');

    sumbit(req)

  }

  const sumbit = req => {
    setLoading(true);
    const request = approvalRequest(req)
    dispatch(putRequestApproval(request))
      .then(unwrapResult)
      .then(res => {
        setLoading(false);
        setDialog('')
        handleClose();
        handleResponse('update', res, updateApprovalState)
      })
      .catch(error => {
        setLoading(false);
        console.error('Error handling approval:', error);
      });
  }


  const handleSearch = value => {
    setSearchValue(value)
    const data = store.approvals?.map(o => ({
      ...o,
      request: o.request.toLowerCase(),
      requestReason: o.requestReason.toLowerCase(),
      userName: o.userName.toLowerCase(),
      email: o.email.toLowerCase(),
      comment: o.comment.toLowerCase()
    }))

    const filteredRows = data.filter(
      o =>
        o.request.trim().includes(value.toLowerCase()) ||
        o.userName.trim().includes(value.toLowerCase()) ||
        o.requestReason.trim().includes(value.toLowerCase()) ||
        o.email.trim().includes(value.toLowerCase()) ||
        o.comment.trim().includes(value.toLowerCase())
    )
    const _data = store.approvals?.filter(o => filteredRows.some(f => f.id == o.id))
    setFilteredRows(_data)
  }

  const handleComment = e => {
    const value = e.target.value;
    commentVar = value;
    setComment(value);
  }

  const handleClose = () => {
    commentRef.current = "";
    resetForm();
    setDialog('')
    // setRespond(state => ({ ...state, isOpenDialog: false }))
  }



  return (
    <>
      {isLoading && <BackdropSpinner />}
      <Card>
        <DataGrid
          autoHeight
          pagination
          rows={searchValue ? filteredRows : store.approvals ? store.approvals : []}
          columns={columns}
          sortingMode='client'
          rowSelection={false}
          className='no-border'
          localeText={{ noRowsLabel: NODATA.noData('approval') }}
          loading={store.approvals == null}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          disableColumnMenu
          slots={{
            toolbar: () => {
              return (
                <Toolbar
                  title='Leave Approvals'
                  searchValue={searchValue}
                  handleFilter={handleSearch}
                  label='Approval'
                />
              )
            }
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25
              }
            }
          }}
        />
      </Card>

      {createPortal(
        <Dialog
          open={dialog == 'reject'}
          onClose={handleClose}
          aria-labelledby='form-dialog-title'
          maxWidth='sm'
          fullWidth
        >
          <IconButton
            size='small'
            onClick={
              handleClose
            } sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <DialogTitle id='form-dialog-title'>Comment</DialogTitle>
          <DialogContent>
            <div>
              <TextField
                ref={commentRef}
                defaultValue=""
                // value={comment}
                key='comment'
                id='Comment'
                required
                fullWidth
                onChange={(e) => {
                  commentVar = e.target.value
                }}
                autoComplete='off'
                minRows={2}
                multiline
              />
            </div>

            {errorComment && !commentVar && (
              <FormHelperText sx={{ color: 'error.main' }}> Comment is required</FormHelperText>
            )}

          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button variant='outlined' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='contained' color='error' onClick={() => handleApproval()}>
              Reject
            </Button>
          </DialogActions>
        </Dialog>,
        document.body
      )}
      <Dialog
        open={dialog == 'approve'}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
        maxWidth='sm'
        fullWidth
      >
        <IconButton
          size='small'
          onClick={
            handleClose
          } sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <Icon icon='mdi:close' />
        </IconButton>
        <DialogTitle id='form-dialog-title'>Approve</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you absolutely certain you want to proceed with the approve?
          </DialogContentText>

        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' color='error' onClick={() => handleApproval()}>
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Approval
