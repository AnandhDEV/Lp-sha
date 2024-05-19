// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Avatar, Checkbox, Chip, Drawer, FormControl, FormControlLabel, FormHelperText, InputLabel, ListItemText, MenuItem, Radio, RadioGroup, Rating, Select, Switch, Typography } from '@mui/material'

//** Third Party */
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFeedbacks } from 'src/store/apps/projects'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}

const NewFeedback = ({ isOpen, setOpen }) => {
  const [assignees, setAssignees] = useState([{ name: "Babysha Papanasam" }, { name: "Dhineshkumar Selvam" }, { name: "Naveenkumar Mounsamy" }, { name: "Pavithra Murugesan" }, { name: "BabySha Papanasam" }])
  const dispatch = useDispatch();
  const store = useSelector(state => state.projects);

  const [newFeedback, setFeedback] = useState({
    title: '',
    description: '',
    member: '',
    rating: 2
  })

  const STATUS = ["Completed", "Not Started", "Working on it", "Due"]
  const STATUS_COLOR = ["success", "warning", "info", "error"]


  const customIcons = {
    1: {
      label: 'Very Dissatisfied',
      icon: 'mdi:emoticon-sad-outline'
    },

    2: {
      label: 'Very Satisfied',
      icon: 'mdi:emoticon-outline'
    }
  }

  const IconContainer = props => {
    const { value } = props

    return (
      <span {...props}>
        <Icon icon={customIcons[value].icon} fontSize="2.5rem" />
      </span>
    )
  }

  const handleChange = (name) => (e) => {
    switch (name?.toLowerCase()) {
      case 'title':
        setFeedback({ ...newFeedback, title: e.target.value })
        break;
      case 'description':
        setFeedback({ ...newFeedback, description: e.target.value })
        break;
      case 'member':
        setFeedback({ ...newFeedback, member: e.target.value })
        break;
      default:
        break;
    }
  }

  const submitFeedback = () => {
    dispatch(setFeedbacks([newFeedback, ...store.feedbacks]))
    setOpen(false)
    setFeedback({
      title: '',
      description: '',
      member: '',
      rating: 2
    })
  }

  return (
    <Box >

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setOpen(false)}

      >
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5} sx={{ p: 8, width: 420 }}>

            <Grid item xs={12} className='gap-1' justifyContent="space-between" alignItems="center">
              <Typography color="secondary">Add New Feedback</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Title'
                value={newFeedback.title}
                placeholder='Feedback Title'
                onChange={handleChange("title")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='mdi:comment-quote-outline' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={1}
                maxRows={3}
                value={newFeedback.description}
                label='Description'
                placeholder='Description...'
                onChange={handleChange("description")}
                sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='mdi:order-bool-descending' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='assignee-select'>Member</InputLabel>
                <Select
                  label='Member'
                  value={newFeedback.member}
                  id='demo-simple-select-outlined'
                  labelId='assignee-select'
                  required
                  onChange={handleChange("member")}
                  startAdornment={<InputAdornment position='start'>
                    <Icon icon='mdi:account-outline' />
                  </InputAdornment>}
                >
                  {
                    assignees.map((assignee, i) => (
                      <MenuItem key={i} value={assignee.name}>{assignee.name}</MenuItem>

                    ))
                  }
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography sx={{ mb: 2 }}>Ratings</Typography>
                <Rating name='customized-icons' size='large' defaultValue={2} max={2} IconContainerComponent={IconContainer} />
              </Box>
            </Grid>

            <Grid columnGap={2} item xs={12} className='flex-right' sx={{ mt: 5 }}>
              <Button size='large' variant='outlined' color="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button size='large' variant='contained' type="submit" onClick={submitFeedback}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Drawer>
    </Box>
  )
}

export default NewFeedback
