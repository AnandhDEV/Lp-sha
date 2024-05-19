import { Icon } from '@iconify/react'
import { Button, Grid, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import { unwrapResult } from '@reduxjs/toolkit'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SimpleBackdrop, { BackdropSpinner, Spinner } from 'src/@core/components/spinner'
import themeConfig from 'src/configs/themeConfig'
import { useAuth } from 'src/hooks/useAuth'
import { setUserProject } from 'src/store/apps/projects'
import { fetchUsers } from 'src/store/apps/user'
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft'
import UsersProjectListTable from 'src/views/apps/user/view/UsersProjectListTable'

const UserDetail = ({ userId }) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [rpm, setRpm] = useState(null)
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  const theme = useTheme()
  let { id } = router.query;
  const [isUser, setIsUser] = useState(true)

  const auth = useAuth()
  const IsUser = auth.user?.roleId == 4

  useEffect(() => {
    setIsUser(IsUser)
  }, [])


  useEffect(() => {
    if (id != '[id]') {
      localStorage.setItem('id', id)
    } else {
      id = localStorage.getItem('id')
    }
    router.replace(`/users/${id}`)
  }, [id])

  useEffect(() => {
    updateUser()
  }, [])

  const backToList = () => {
    dispatch(setUserProject(null))
    dispatch(fetchUsers())
  }

  const updateUser = () => {
    if (store.users == null) {
      dispatch(fetchUsers())
        .then(unwrapResult)
        .then(res => {
          const _user = !isNaN(id) && res.result?.find(o => o.id == id)
          const _rpm = !isNaN(id) && res.result?.find(o => o.id == _user?.reportingManagerId)
          const _index = !isNaN(id) && res.result?.findIndex(o => o.id == _user?.reportingManagerId)
          setUser(_user)
          setRpm(_rpm)
          setIndex(_index)
          
        })
    } else {
      const _user = !isNaN(id) && store.users?.find(o => o.id == id)
      const _rpm = !isNaN(id) && store.users?.find(o => o.id == _user?.reportingManagerId)
      const _index = !isNaN(id) && store.users?.findIndex(o => o.id == _user?.reportingManagerId)
      setUser(_user)
      setRpm(_rpm)
      setIndex(_index)
    }
  }

  return (
    <>
      {!isUser && (
        <Box>
          <Button
            variant='text'
            size='small'
            startIcon={<Icon icon='mdi:arrow-left' />}
            sx={{ mb: 5 }}
            LinkComponent={Link}
            href='/users'
            onClick={() => backToList()}
          >
            Back to list
          </Button>
        </Box>)
      }
      <Grid container spacing={6}>
        {user == null || loading ? <BackdropSpinner /> : <></>}

        <Grid item xs={12} md={5} lg={4}>
          <UserViewLeft
            currentUser={user}
            rpm={rpm}
            index={index}
            setUser={setUser}
            setRpm={setRpm}
            updateUserData={updateUser}
            setLoading={setLoading}
          />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          {user != null && <UsersProjectListTable currentUser={user} />}
        </Grid>
      </Grid>
    </>
  )
}

export const getServerSideProps = async ({ params }) => {
  const userId = params.id

  return {
    props: {
      userId
    }
  }
}

export default UserDetail
