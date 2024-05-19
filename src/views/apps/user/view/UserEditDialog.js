import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  TextField
} from '@mui/material'
import React from 'react'
import Select from 'src/@core/theme/overrides/select'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import CustomChip from 'src/@core/components/mui/chip'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { roles } from 'src/helpers/constants'

const UserEditDialog = props => {
  const { user, handleEditClose, openEdit } = props

  return (
    <Grid>
      {user && (
        <Dialog
          open={openEdit}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          aria-describedby='user-view-edit-description'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
        >
          <DialogTitle
            id='user-view-edit'
            sx={{
              textAlign: 'center',
              fontSize: '1.5rem !important',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            Edit User Information
          </DialogTitle>
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
            }}
          >
            <DialogContentText
              variant='body2'
              id='user-view-edit-description'
              sx={{ textAlign: 'center', mb: 7 }}
            >
              Updating user details will receive a privacy audit.
            </DialogContentText>
            <form>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='Full Name' defaultValue={user.fullName} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type='email'
                    label='Billing Email'
                    defaultValue={user.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='user-view-status-label'>Status</InputLabel>
                    <Select
                      label='Status'
                      defaultValue={user.isActive}
                      id='user-view-status'
                      labelId='user-view-status-label'
                    >
                      <MenuItem value={true}>
                        <CustomChip size='small' label='Active' skin='light' color='success' />
                      </MenuItem>
                      <MenuItem value={false}>
                        <CustomChip size='small' label='Inactive' skin='light' color='error' />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='role-id'>Role</InputLabel>
                    <Select label='Role' labelId='role-id' defaultValue={roles[user.roleId].name}>
                      {Object.keys(roles).map((key, i) => (
                        <MenuItem key={i} value={key}>
                          <CustomChip
                            size='small'
                            label={roles[key].name}
                            skin='light'
                            sx={{ color: roles[key].color }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type='number'
                    value={user.costPerHour}
                    label='Cost Per Hour'
                    defaultValue=''
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePickerWrapper>
                    <DatePicker
                      selected={new Date(user.joinedDate)}
                      id='date-range-picker'
                      onChange={() => {}}
                      shouldCloseOnSelect
                      popperPlacement='auto'
                      customInput={<CustomInput label='Date Range' />}
                    />
                  </DatePickerWrapper>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button variant='outlined' color='secondary' onClick={handleEditClose}>
              Cancel
            </Button>
            <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClose}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Grid>
  )
}

export default UserEditDialog
