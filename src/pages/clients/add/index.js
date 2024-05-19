import { useTheme } from '@emotion/react'
import { Icon } from '@iconify/react'
import {
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { Router, useRouter } from 'next/router'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'src/@core/theme/overrides/select'
import { customToast } from 'src/helpers/helpers'
import { setClients } from 'src/store/clients'
import ProfileUpload from 'src/views/clients/add/ProfileUpload'

const NewClient = () => {
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useDispatch()
  const store = useSelector(state => state.clients)

  const [client, setClient] = useState({
    profile: '',
    firstName: '',
    lastName: '',
    billingEmail: '',
    taxId: '',
    contact: '',
    companyName: '',
    primaryContactName: '',
    address: ''
  })

  //onchange

  const handleChange = name => e => {
    switch (name.toLowerCase()) {
      case 'firstname':
        setClient({ ...client, firstName: e.target.value })
        break
      case 'lastname':
        setClient({ ...client, lastName: e.target.value })
        break
      case 'billingemail':
        setClient({ ...client, billingEmail: e.target.value })
        break
      case 'contact':
        setClient({ ...client, contact: e.target.value })
        break
      case 'companyname':
        setClient({ ...client, companyName: e.target.value })
        break
      case 'primarycontactname':
        setClient({ ...client, primaryContactName: e.target.value })
        break
      case 'taxid':
        setClient({ ...client, taxId: e.target.value })
        break
      case 'profile':
        setClient({ ...client, profile: e.target.value })
        break
      case 'address':
        setClient({ ...client, address: e.target.value })
        break

      default:
        break
    }
  }

  //create
  const handleCreateClient = () => {
    customToast({ theme: theme, message: 'Client Created', isSuccess: false })
    dispatch(
      setClients([
        ...store.clients,
        { id: store.clients, clientName: client.firstName + ' ' + client.lastName, ...client }
      ])
    )
    router.replace({
      pathname: '/clients'
    })
  }

  return (
    <Grid xs={12}>
      <Box sx={{ mb: 8, textAlign: 'left' }}>
        <Typography variant='h5' sx={{ mb: 3 }}>
          Create New Client
        </Typography>
      </Box>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ProfileUpload />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            fullWidth
            defaultValue='Oliver'
            value={client.firstName}
            onChange={handleChange('firstName')}
            error={Boolean(!client.firstName)}
            label='First Name'
            placeholder='John'
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            fullWidth
            defaultValue='Queen'
            value={client.lastName}
            onChange={handleChange('lastName')}
            label='Last Name'
            placeholder='Doe'
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            fullWidth
            label='Billing Email'
            value={client.billingEmail}
            onChange={handleChange('billingEmail')}
            placeholder='johnDoe@email.com'
            defaultValue='oliverQueen@email.com'
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            fullWidth
            label='Tax ID'
            value={client.taxId}
            onChange={handleChange('taxId')}
            placeholder='Tax-7490'
            defaultValue='Tax-8894'
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            fullWidth
            label='Contact'
            value={client.contact}
            onChange={handleChange('contact')}
            placeholder='+ 123 456 7890'
            defaultValue='+1 609 933 4422'
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            fullWidth
            label='Company ID'
            value={client.companyName}
            onChange={handleChange('companyName')}
            placeholder='+ 123 456 7890'
            defaultValue='+1 609 933 4422'
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            fullWidth
            label='Company Name'
            value={client.companyName}
            onChange={handleChange('companyName')}
            placeholder='+ 123 456 7890'
            defaultValue='+1 609 933 4422'
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            fullWidth
            label='Primary Contact Name'
            value={client.primaryContactName}
            onChange={handleChange('primaryContactName')}
            placeholder='John Doe'
            defaultValue='John Doe'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label='Address'
            value={client.address}
            onChange={handleChange('address')}
            placeholder='Address...'
            sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
          />
        </Grid>
        <Grid item xs={12}>
          <Box className='demo-space-x flex-right'>
            <Button size='large' color='secondary' variant='outlined' onClick={() => {}}>
              Cancel
            </Button>
            <Button size='large' type='submit' variant='contained' onClick={handleCreateClient}>
              Create
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default NewClient
