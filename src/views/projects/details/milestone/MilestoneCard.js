// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { putMilestone, setEditMilestone } from 'src/store/apps/projects'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'
import CategoriesTreeView from './CategoriesTreeView'
import { formatLocalDate } from 'src/helpers/dateFormats'
import { fetchMileStones, setMileStones } from 'src/store/apps/projects'
import { getItemDescriptor } from '@babel/core/lib/config/item'
import { Button, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'

const MileStoneCard = ({ data, setOpen, id }) => {
  const [role, setRole] = useState(4)
  const [project, setProject] = useState(null)
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const auth = useAuth()
  const roleId = auth.user.roleId


  useEffect(() => {
    setRole(roleId)
    setProject(JSON.parse(localStorage.getItem('project')))
  }, [])

  const handleEdit = item => {
    setOpen(true)
    dispatch(setEditMilestone(item))
  }

  return (
    <Card
      onClick={() => {
        if (role == 1 || store.projectRoleId == 1 || role == 3) {
          handleEdit(data)
        }
      }}
      sx={{ '&:hover': { cursor: 'pointer' }, border: '1px solid #8039df', background: '#f5f5f5' }}
    >
      <CardContent sx={{ p: theme => `${theme.spacing(3.25, 5, 4.5, 2)} !important` }}>
        <Box display='flex' justifyContent='space-between'>
          <Box className='gap-1'>
            <Typography
              variant='h6'
              sx={{
                display: 'flex',
                mb: 2.75,
                alignItems: 'center',
                color: '#8039df',
                '& svg': { mr: 2.5 }
              }}
            >
              <Icon icon='mdi:flag-triangle' />
              {data.name}
            </Typography>
          </Box>
          <Box display='flex'>
            <Icon icon='mdi:calendar-outline' fontSize={20} color='grey' />
            <Typography
              variant='body2'
              sx={{ color: theme => (theme.palette.mode == 'light' ? 'text.primary' : 'grey') }}
            >
              {data.startDate}
            </Typography>
            <Icon icon='mdi:arrow-right' fontSize={20} color='grey' />
            <Typography
              variant='body2'
              sx={{ color: theme => (theme.palette.mode == 'light' ? 'text.primary' : 'grey') }}
            >
              {data.endDate}
            </Typography>
            <Typography
              variant='body2'
              sx={{ color: theme => (theme.palette.mode == 'light' ? 'text.primary' : 'grey') }}
            ></Typography>
          </Box>
        </Box>
        <Box sx={{ p: theme => `${theme.spacing(0, 0, 0, 4)} !important` }}>
          <Typography
            variant='caption'
            color='text.main'
            sx={{
              display: 'flex',
              mb: 2.75,
              alignItems: 'center',
              textAlign: 'justify',
              '& svg': { mr: 2.5 }
            }}
          >
            {data.description}
          </Typography>
        </Box>
        <CategoriesTreeView categories={data.taskCategories} />
      </CardContent>
    </Card>
  )
}

export default MileStoneCard
