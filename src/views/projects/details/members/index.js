import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'
import {
  deleteProjectMember,
  fetchProjectMembers,
  setEditProjectMember,
  setProjectMembers
} from 'src/store/apps/projects'
import { handleResponse } from 'src/helpers/helpers'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/layouts/components/LogoSpinner'
import dynamic from 'next/dynamic'
import EmptyMembers from './EmptyMembers'
import { BackdropSpinner } from 'src/@core/components/spinner'
import { NODATA } from 'src/helpers/constants'
import { useAuth } from 'src/hooks/useAuth'

const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false,
  loading: () => {
    return <FallbackSpinner />
  }
})
const COLORS = ['primary', 'secondary', 'success', 'warning', 'error', 'info']

const Members = ({ data, setOpen, id }) => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const [loader, setLoader] = useState(false)
  const [openAlert, setAlert] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [isUser, setIsUser] = useState(true)
  const [userMail, setUserMail] = useState(null)
  const [roleId, setRoleId] = useState(null)
  const auth = useAuth()
  const role = auth.user?.roleId
  const IsUser = auth.user?.roleId == 4

  useEffect(() => {
    setRoleId(role)
    setIsUser(IsUser)
  }, [])

  const handleEdit = item => {
    setOpen(true)
    dispatch(setEditProjectMember(item))

  }

  const handleDeleteMember = member => {
    try {
      setAlert(true)
      setSelectedMember(member)
    } catch (error) {
      toast.error(NODATA.error, {
        duration: 3000,
        position: 'top-right'
      })
    }
  }

  const deleteMemberState = member => {
    const updatedMembers = store.projectMembers?.filter(m => m.id !== member.id)
    dispatch(setProjectMembers(updatedMembers))
    setLoader(false)
  }

  const handleDeleteMemberConfirmed = () => {
    try {
      setAlert(false)
      setLoader(true)
      dispatch(deleteProjectMember(selectedMember?.id))
        .then(unwrapResult)
        .then(res => {
          handleResponse('delete', res, deleteMemberState, selectedMember)
        })
        .catch(error => {
          toast.error(NODATA.error, {
            duration: 3000,
            position: 'top-right'
          })
        })
    } catch (error) {
      toast.error(NODATA.error, {
        duration: 3000,
        position: 'top-right'
      })
      setLoader(false)
    }
  }

  return (
    <>
      <div>
        {store?.projectMembers != null &&
          store?.projectMembers != undefined &&
          store?.projectMembers?.length > 0 && (
            <Grid container spacing={6}>
              {store?.projectMembers.map((item, index) => (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <Card sx={{ position: 'relative', height: '100%' }}>
                    {!(role == 4 && (store.projectRoleId == 2 || store.projectRoleId == 3)) && (
                      <OptionsMenu
                        iconButtonProps={{
                          size: 'small',
                          sx: { top: 12, right: 12, position: 'absolute' }
                        }}
                        options={[
                          { text: 'Edit', menuItemProps: { onClick: () => handleEdit(item) } },
                          {
                            text: 'Remove',
                            menuItemProps: {
                              sx: { color: 'error.main' },
                              onClick: () => handleDeleteMember(item)
                            }
                          }
                        ]}
                      />
                    )}

                    <CardContent>
                      <Box
                        sx={{
                          mt: 2,
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column'
                        }}
                      >
                        <Avatar
                          src={`/images/avatars/${index + 1}.png`}
                          sx={{ mb: 6, width: 80, height: 80 }}
                        />
                        <Typography variant='h6'>{item.userName}</Typography>

                        <Typography
                          variant='body2'
                        // sx={{
                        //   color: item.projectRoleId == 3 ? 'primary' : 'text.secondary',
                        //   mb: 4
                        // }}
                        >
                          {store.assigneeRoles.find(a => a.projectRoleId == item.projectRoleId)?.projectRoleName}
                        </Typography>

                        <Box
                          sx={{
                            mb: 6,
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                          }}
                        >
                          {item?.skills?.length > 0 ? (
                            item.skills.map((skill, i) => (
                              <Box
                                key={i}
                                onClick={e => e.preventDefault()}
                                sx={{
                                  textDecoration: 'none',
                                  '&:not(:last-of-type)': { mr: 2 }
                                  // '& .MuiChip-root': { cursor: 'pointer' }
                                }}
                              >
                                {skill.skillName && (
                                  <CustomChip
                                    size='small'
                                    skin='light'
                                    color={COLORS[i]}
                                    label={skill.skillName || 'No Skills'}
                                  />
                                )}
                              </Box>
                            ))
                          ) : (
                            <Box
                              key={0}
                              sx={{
                                textDecoration: 'none',
                                '&:not(:last-of-type)': { mr: 2 }
                              }}
                            >
                              <CustomChip
                                color={COLORS[0]}
                                size='small'
                                skin='light'
                                label='No Skills'
                              />
                            </Box>
                          )}
                        </Box>
                        <Box
                          sx={{
                            mb: 6,
                            gap: 2,
                            width: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              flexDirection: 'column'
                            }}
                          >
                            <Typography variant='h5'>{item?.efficiencyScore || 0}</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>
                              Efficiency Score
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              flexDirection: 'column'
                            }}
                          >
                            <Typography variant='h5'>{item.taskCount}</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>Tasks</Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              flexDirection: 'column'
                            }}
                          >
                            <Typography variant='h5'>
                              {item.utilizationPercentage != null
                                ? item.utilizationPercentage.toFixed(1) + '%'
                                : '0.0%'}
                            </Typography>

                            <Typography sx={{ color: 'text.secondary' }}>Utilization</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Button
                            variant='outlined'
                            color='secondary'
                            sx={{ p: 1.5, minWidth: 38 }}
                            target='_top'
                            rel='noopener noreferrer'
                            href={`mailto:${item?.userEmail}`}
                          >
                            <Icon icon='mdi:email-outline' />
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

        {store?.projectMembers != null && store?.projectMembers?.length == 0 && <EmptyMembers />}
      </div>
      <DynamicDeleteAlert
        open={openAlert}
        setOpen={setAlert}
        title='Delete Member'
        action='Delete'
        handleAction={handleDeleteMemberConfirmed}
      />
    </>
  )
}

export default Members
