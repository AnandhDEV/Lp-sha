// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Switch from '@mui/material/Switch'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import TimelineContent from '@mui/lab/TimelineContent'
import useMediaQuery from '@mui/material/useMediaQuery'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomTimelineDot from 'src/@core/components/mui/timeline-dot'
import { TimelineOppositeContent } from '@mui/lab'
import { useDispatch, useSelector } from 'react-redux'
import EmptyMileStone from './EmptyMilestone'
import MileStoneCard from './MilestoneCard'
import { useEffect, useState } from 'react'
import { fetchCategories, fetchMileStones } from 'src/store/apps/projects'
import FallbackSpinner from 'src/layouts/components/LogoSpinner'
import { BackdropSpinner } from 'src/@core/components/spinner'

// Styled Timeline component
const Timeline = styled(MuiTimeline)(({ theme }) => ({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root:nth-of-type(even) .MuiTimelineContent-root': {
    textAlign: 'left'
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiTimelineItem-root': {
      width: '100%',
      '&:before': {
        display: 'none'
      }
    }
  }
}))

// Styled component for the image of a shoe
const ImgShoe = styled('img')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius
}))

const MileStone = ({ setOpen, id }) => {
  const hiddenMD = useMediaQuery(theme => theme.breakpoints.down('md'))
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const [loader, setLoader] = useState(false)
  useEffect(() => {
    dispatch(fetchCategories())
      .then(() => dispatch(fetchMileStones(id)))
      .finally(() => setLoader(false))
  }, [id])

  return (
    <>
      {loader ? (
        <BackdropSpinner />
      ) : (
        <Timeline position={hiddenMD ? 'right' : 'alternate'}>
          {store.mileStones?.length > 0 ? (
            store.mileStones.map((ms, key) => (
              <TimelineItem key={key}>
                <TimelineContent
                  sx={{
                    '& svg': { verticalAlign: 'bottom', mx: 4 }
                  }}
                >
                  <MileStoneCard data={ms} setOpen={setOpen} id={id}/>
                </TimelineContent>
                <TimelineSeparator>
                  <CustomTimelineDot skin='light' color='secondary'>
                    <Typography component='h6'>{`M${key + 1}`}</Typography>
                  </CustomTimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineOppositeContent
                  sx={{ m: 'auto 0' }}
                  variant='body2'
                  color='text.secondary'
                ></TimelineOppositeContent>
              </TimelineItem>
            ))
          ) : (
            <EmptyMileStone />
          )}
        </Timeline>
      )}
    </>
  )
}

export default MileStone
