import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  Autocomplete,
  Backdrop,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Tab,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  fetchConfig,
  addConfig,
  addOrgHrApprove,
  fetchOrgHrApprove,
  putConfig,
  postHRApproval,
  fetchHRApprovals,
  deleteHRApproval,
  setConfigs,
  setHRApprovals
} from 'src/store/settings';

import { WEEKDAYS } from 'src/helpers/constants';
import themeConfig from 'src/configs/themeConfig';
import dynamic from 'next/dynamic';
import currencies from 'src/helpers/currencies.json';
import timezones from 'src/helpers/timezones.json';
import { settingsRequest } from 'src/helpers/requests';
import { unwrapResult } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import SimpleBackdrop, { BackdropSpinner, Spinner } from 'src/@core/components/spinner';
import CustomPeoplePicker from 'src/views/components/autocomplete/CustomPeoplePicker';
import CustomHRPicker from 'src/views/components/autocomplete/CustomHRPicker';
import { addUser, fetchUsers } from 'src/store/apps/user';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { handleResponse } from 'src/helpers/helpers';

const defaultValues = {
  startWeekDay: '',
  endWeekDay: '',
  currency: {},
  timezone: {},
  leaveHRApprovalUserIds: [] 
};

const schema = yup.object().shape({
  startWeekDay: yup.string().required('Start day is required'),
  endWeekDay: yup.string().required('End day is required'),
  currency: yup.object().required('Currency is required').typeError('Currency is required'),
  timezone: yup.object().required('Timezone is required').typeError('Timezone is required'),
  leaveHRApprovalUserIds: yup.array().min(1, 'HR Approval is required').required('HR Approval is required') // Validate as array
});

const SettingsConfig = () => {
  const { configuration, OrgHrApprove, HrApprovals } = useSelector(state => state.settings);
  const dispatch = useDispatch();
  const _userStore = useSelector(state => state.user);
  const [deleteHRs, setDeleteHRs] = useState([]);

  const [HRs, setHRs] = useState({
    items: [],
    selectedHRs: [],
    newHRs: []
    // deleteHRs: []
  });

  const {
    register,
    reset,
    handleSubmit,
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const theme = useTheme();
  const hidden = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    
  }, []);
  
  useEffect(() => {
   fetchAndMapUsersDetails()
  }, [dispatch, _userStore.users, configuration]);

  useEffect(() => {
    console.log({configuration});
    if (configuration != null && Object.keys(configuration).length > 0) {
      const currency = currencies.findIndex(o => o.cc == configuration.currency);
      const time = timezones.findIndex(o => o.offset == configuration.timeZone?.split(' - ')[1]);
      //const users = _userStore.users ? [..._userStore.users] : [];
      // const _selectedHRs = users.filter(u =>
      //   configuration?.organizationLeaveHRApprovals.some(o => o.userId === u.id)
      // );
      // console.log('HR',_selectedHRs);
      // console.log('users',users);
    reset({
        currency: currency == -1 ? '' : currencies[currency],
        timezone: time == -1 ? '' : timezones[time],
        endWeekDay: configuration.workingdays?.split('-')[1],
        startWeekDay: configuration.workingdays?.split('-')[0],
        leaveHRApprovalUserIds: HRs.selectedHRs // Set selected HRs here
      });
    } else {
      reset();
    }
  }, [configuration,HRs]);

  const updateOrgSettings = newConfig => {
    dispatch(setConfigs(newConfig));
    setDeleteHRs([]);
  };


  const fetchAndMapUsersDetails = async()=>{
    if(_userStore.users == null)  dispatch(await fetchUsers());
    if(_userStore.users != null){
      const users = _userStore.users ? [..._userStore.users] : [];
      console.log('users',_userStore.users)
      const activeUsers = users.filter(user => user.isActive);
      const _HRs = activeUsers.filter(
        u => !configuration?.organizationLeaveHRApprovals.some(o => o.userId === u.id)
      );
      console.log('activeHRS',_HRs)
      const _selectedHRs = users.filter(u =>
        configuration?.organizationLeaveHRApprovals.some(o => o.userId === u.id)
      );
      console.log('newHRS',_selectedHRs)
      setHRs(state => ({ ...state, selectedHRs: _selectedHRs, items: _HRs }));
    }
  }
  //Save Configure

  const handleSaveSettings = request => {
    setLoading(true);
    const hrApprovalsIds = HRs.selectedHRs.map(o => o.id);
    if (configuration != null && Object.keys(configuration).length > 0 && configuration.id != 0) {
      const req = settingsRequest({
        name: 'update',
        id: configuration.id,
        hrApprovalsIds: hrApprovalsIds,
        removeHrUsers: deleteHRs,   
        ...request
      });

      dispatch(putConfig(req))
        .then(unwrapResult)
        .then(res => {
          handleResponse('update', res, updateOrgSettings);
          setLoading(false);
        });
    } else {
      const req = settingsRequest({
        name: 'create',
        id: configuration.id,
        hrApprovalsIds: hrApprovalsIds,
        ...request
      });

      dispatch(addConfig(req))
        .then(unwrapResult)
        .then(res => {
          handleResponse('create', res, updateOrgSettings);
          setLoading(false);
        });
    }
  };

  const collectNewHRs = data => {
    const items = [...HRs.items];
    const _deleteHRs = [...deleteHRs];
    const updatedItems = items.filter(o => !data.some(d => d.id === o.id));
    const index = _deleteHRs.findIndex(o => o == data[data.length - 1].id);
    index != -1 && _deleteHRs.splice(index, 1);
    setHRs(state => ({ ...state, items: updatedItems, selectedHRs: data }));
    setDeleteHRs(_deleteHRs);
    setValue('leaveHRApprovalUserIds', data);
    clearErrors('leaveHRApprovalUserIds');
  };

  const CollectDeleteHRs = data => {
    const _deleteHRs = [...deleteHRs];
    const _selectedHRs = [...HRs.selectedHRs];
    const approvals = [...configuration.organizationLeaveHRApprovals];
    const deleteUser = approvals.find(o => o.userId == data.id)?.userId;
    const removeUser = _selectedHRs.findIndex(o => o.id == data.id);
    deleteUser && _deleteHRs.push(deleteUser);
    removeUser != -1 && _selectedHRs.splice(removeUser, 1);
    setDeleteHRs(_deleteHRs);
    setHRs(state => ({ ...state, selectedHRs: _selectedHRs }));
    setValue('leaveHRApprovalUserIds', _selectedHRs);
  };

  // const onSubmit = (data) => {
  //   const formData = {
  //     ...data,
  //     leaveHRApprovalUserIds: watch('leaveHRApprovalUserIds') // Get current value of leaveHRApprovalUserIds
  //   };
  //   debugger;
  //   handleSaveSettings(formData);
  //   console.log('data1',data)
  //   console.log('data2',formData)
  // };

  return (
    <Grid className='d-flex'>
      {isLoading && <BackdropSpinner />}
      <Grid container xs={12} sm={12} md={7} lg={7}>
        <Card>
          <CardHeader title='Configurations' />
          <CardContent>
            <form onSubmit={handleSubmit(handleSaveSettings)}>
              <Grid container spacing={4}>
                {/* working days */}
                <Grid item md={12} xs={12}>
                  <Typography variant='body1' fontWeight='500' color='primary'>
                    Working Days <span style={{ color: 'red' }}>*</span>
                  </Typography>
                </Grid>

                <Grid item xs={4} sm={6} md={6} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id='demo-simple-select'>Start Day *</InputLabel>
                    <Controller
                      control={control}
                      name='startWeekDay'
                      render={({ field }) => (
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Start Day *'
                          {...field}
                          error={Boolean(errors.startWeekDay)}
                        >
                          {WEEKDAYS.map((day, i) => (
                            <MenuItem key={i} value={day} disabled={watch('endWeekDay') === day}>
                              {day}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    {errors.startWeekDay && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.startWeekDay.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id='demo-simple-select'>End Day *</InputLabel>
                    <Controller
                      control={control}
                      name='endWeekDay'
                      render={({ field }) => (
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='End Day *'
                          {...field}
                          error={Boolean(errors.endWeekDay)}
                        >
                          {WEEKDAYS.map((day, i) => (
                            <MenuItem key={i} value={day} disabled={watch('startWeekDay') === day}>
                              {day}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    {errors.endWeekDay && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.endWeekDay.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* currency */}
                <Grid item md={12} xs={12}>
                  <Typography variant='body1' fontWeight='500' color='primary'>
                    Currency <span style={{ color: 'red' }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth >
                    <Controller
                      control={control}
                      name='currency'
                      render={({ field }) => (
                        <Autocomplete
                          options={currencies}
                          id='autocomplete-limit-tags'
                          getOptionLabel={o => (o ? `${o.name} - ${o.cc}` : '')}
                          onChange={(e, data) => field.onChange(data)}
                          defaultValue={field.value}
                          value={field.value}
                          error={Boolean(errors.currency)}
                          renderInput={params => <TextField {...params} label='Currency' />}
                          noOptionsText='No Currency'
                        />
                      )}
                    />
                    {errors.currency && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.currency.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Timezone */}

                <Grid item md={12} xs={12}>
                  <Typography variant='body1' fontWeight='500' color='primary'>
                    Timezone <span style={{ color: 'red' }}>*</span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      control={control}
                      name='timezone'
                      render={({ field }) => (
                        <Autocomplete
                          options={timezones}
                          id='autocomplete-limit-tags'
                          getOptionLabel={o => (o ? `${o.name} - ${o.offset}` : '')}
                          value={field.value}
                          onChange={(e, data) => field.onChange(data)}
                          error={Boolean(errors.timezone)}
                          renderInput={params => (
                            <TextField {...params} label='Timezone' error={errors.timezone} />
                          )}
                          noOptionsText='No Timezone'
                        />
                      )}
                    />
                    {errors.timezone && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.timezone.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* HR */}

                <Grid item md={12} xs={12}>
                  <Typography variant='body1' fontWeight='500' color='primary'>
                    HR Approval <span style={{ color: 'red' }}>*</span>
                  </Typography>
                </Grid>

                {_userStore.users?.length > 0 ? (
                  <Grid item xs={12}>
                    <FormControl fullWidth error={Boolean(errors.leaveHRApprovalUserIds)}>
                      <Controller
                        control={control}
                        name='leaveHRApprovalUserIds'
                        //defaultValue={HRs.selectedHRs}
                        render={({ field }) => (
                          <CustomHRPicker
                            items={HRs.items}
                            values={HRs.selectedHRs}
                            label='Users'
                            onDelete={CollectDeleteHRs}
                            onSelect={collectNewHRs}
                            originalItems={_userStore.users}
                            error={Boolean(errors.leaveHRApprovalUserIds)}
                          />
                        )}
                      />

                      {errors.leaveHRApprovalUserIds && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.leaveHRApprovalUserIds.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                ) : (
                  <Spinner />
                )}

                <Grid item xs={12} className='flex-right'>
                  <Button type='submit' variant='contained' color='primary'>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>

      {!hidden && (
        <Grid container xs={12} sm={6} md={6} lg={6}>
          <img
            src={
              theme.palette.mode === 'dark'
                ? '/images/pages/auth-v2-forgot-password-illustration-dark.png'
                : '/images/pages/auth-v2-forgot-password-illustration-light.png'
            }
            alt='leanprofit-configuration-image'
            width='90%'
            style={{ margin: 'auto' }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default SettingsConfig;
