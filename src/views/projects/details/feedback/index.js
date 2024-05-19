// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Grid } from '@mui/material'
import { FEEDBACKS } from 'src/helpers/constants'
import { useDispatch, useSelector } from 'react-redux'

const Feedback = ({ data }) => {
  // ** State
  const dispatch = useDispatch();
  const store = useSelector(state => state.projects);

  return (

    <Grid container spacing={6}>
      {
        store.feedbacks.map((feedback, i) => (
          <Grid key={i} item xs={12} sm={6} md={4}>
            <Card key={i} sx={{ position: 'relative' }}>
              <CardHeader
                title={feedback.title}
                action={<Icon icon="mdi:emoticon-outline" color="orange" />}

              />
              <CardContent>
                <Typography component="q" variant='body2'>
                  {feedback.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))
      }
    </Grid>

  )
}

export default Feedback
