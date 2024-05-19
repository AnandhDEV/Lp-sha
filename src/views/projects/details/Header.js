import { Icon } from '@iconify/react'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomBackButton from 'src/@core/components/back-button'
import { BackdropSpinner } from 'src/@core/components/spinner'
import { PROJECT_OPTIONS } from 'src/helpers/constants'
import { customErrorToast } from 'src/helpers/custom-components/toasts'
import { handleResponse } from 'src/helpers/helpers'
import { useAuth } from 'src/hooks/useAuth'
import { deleteProject } from 'src/store/apps/projects'

const DynamicDeleteAlert = dynamic(() => import('src/views/components/alerts/DeleteAlert'), {
  ssr: false
})

const Header = ({ projectName, id }) => {
  const [isLoading, setLoading] = useState(false)
  const [openOption, setOpenOption] = useState(false)
  const [alert, setAlert] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [option, setOption] = useState(null)
  const [isUser, setIsUser] = useState(true)
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const router = useRouter()
  const auth = useAuth()
  const IsUser = auth.user?.roleId == 4
  useEffect(() => {
    setIsUser(IsUser)
  }, [])

  const handleBack = () => {
    router.push('/projects/list')
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
    setOpenOption(true)
  }

  //ARCHIVE
  const archiveProject = async () => {
    setAlert(false)
    setOpenOption(false)
    setLoading(true)
    const projectId = id
    const { payload } = await dispatch(deleteProject(projectId))
    handleResponse('delete', payload, () => { }, null)
    setLoading(false)
  }

  const handleOptions = () => {
    switch (option) {
      case 'Archive':
        archiveProject()
        break

      default:
        break
    }
  }

  const ITEM_HEIGHT = 48

  return (
    <Box className='gap-1'>
      {isLoading && <BackdropSpinner />}
      <CustomBackButton title={projectName} onClickBack={handleBack} />

      {(!isUser || store.projectRoleId !== 3) && (
        <div>
          <IconButton
            aria-label='more'
            id='long-button'
            aria-controls={openOption ? 'long-menu' : undefined}
            aria-expanded={openOption ? 'true' : undefined}
            aria-haspopup='true'
            onClick={handleClick}
          >
            <Icon icon='mdi:more-vert' />
          </IconButton>
          <Menu
            id='long-menu'
            MenuListProps={{
              'aria-labelledby': 'long-button'
            }}
            anchorEl={anchorEl}
            open={openOption}
            onClose={() => {
              setAnchorEl(null)
              setOpenOption(false)
            }}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '20ch'
              }
            }}
          >
            {PROJECT_OPTIONS.map(option => (
              <MenuItem
                key={option}
                selected={option === 'Pyxis'}
                color={option == 'Archive' && 'error'}
                onClick={() => {
                  setAlert(true), setOption(option)
                }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}

      <DynamicDeleteAlert
        open={alert}
        setOpen={setAlert}
        title='Archive Project'
        action='Archive'
        handleAction={handleOptions}
      />
    </Box>
  )
}

export default Header
