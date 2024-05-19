import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import { Autocomplete, CircularProgress, FormHelperText, Grid, Tab } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import { fetchConfig, addConfig, fetchHRApprovals, setEditProjectStatus, setEditDepartment } from 'src/store/settings';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import MuiTabList from '@mui/lab/TabList';
import Icon from 'src/@core/components/icon';
import SimpleBackdrop from 'src/@core/components/spinner';
import DepartmentConfig from 'src/views/configuration/department';
import SettingsConfig from 'src/views/configuration/settings';
import SkillsConfig from 'src/views/configuration/skills';
import NewSkill from 'src/views/configuration/skills/NewSkill';
import dynamic from 'next/dynamic';
import NewProjectStatus from 'src/views/configuration/project-status/NewProjectStatus';
import NewDepartment from 'src/views/configuration/department/NewDepartment';
import { useAuth } from 'src/hooks/useAuth';
import ProjectsStats from 'src/views/projects/reports/ProjectsStats';
import TimeSheetExport from 'src/views/projects/reports/ExportTimesheet';

const TabList = styled(MuiTabList)(({ theme }) => ({
    '& .MuiTabs-indicator': {
        display: 'none'
    },
    '& .Mui-selected': {
        borderBottom: `3px solid ${theme.palette.primary.main}`,
        color: `${theme.palette.primary.main} !important`
    },
    '& .MuiTab-root': {
        minWidth: 65,
        minHeight: 38,
        paddingTop: theme.spacing(2.5),
        paddingBottom: theme.spacing(2.5),
        [theme.breakpoints.up('sm')]: {
            minWidth: 130
        }
    }
}));

const Reports = ({ tab, id }) => {
    const [activeTab, setActiveTab] = useState('ProjectsStats');
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState(0);

    // ** Hooks
    const router = useRouter();
    const hideText = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const store = useSelector(state => state.settings);
    const auth = useAuth();
    const roleId = auth.user?.roleId;

    const handleChange = (event, value) => {
        setIsLoading(true);
        setActiveTab(value);
        router
            .push({
                pathname: `/projects/reports/${value}/${id}`
            })
            .then(() => setIsLoading(false));
    };

    useEffect(() => {
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [tab]);

    const tabContentList = {
        report: <ProjectsStats id={id} tab={tab} />,
        timesheet: <TimeSheetExport id={id} tab={tab} />

    };

    const tabs = [
        { name: 'report', icon: 'mdi:chart-box' },
        { name: 'timesheet', icon: 'mdi:chart-box' },
    ];


    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <TabContext value={activeTab}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} display='flex' justifyContent='space-between' alignItems='center'>
                            <TabList
                                variant='scrollable'
                                scrollButtons='auto'
                                onChange={handleChange}
                                aria-label='basic tabs example'
                            >
                                {tabs.map((tab, key) => (
                                    <Tab
                                        key={key}
                                        value={tab.name}
                                        label={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    ...(!hideText && { '& svg': { mr: 2 } })
                                                }}
                                            >
                                                <Icon fontSize={20} icon={tab.icon} />
                                                {!hideText && tab.name}
                                            </Box>
                                        }
                                    />
                                ))}
                            </TabList>
                        </Grid>
                        <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
                            <TabPanel sx={{ p: 0 }} value={activeTab}>
                                {tabContentList[activeTab]}
                            </TabPanel>
                        </Grid>
                    </Grid>
                </TabContext>
            </Grid>
        </Grid>
    );
};

export default Reports;
