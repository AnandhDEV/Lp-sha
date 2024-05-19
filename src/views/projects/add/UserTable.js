/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { DataGrid, GridEditInputCell, useGridApiRef } from '@mui/x-data-grid';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { NODATA } from 'src/helpers/constants';
import Select from 'src/@core/theme/overrides/select';
import {
    Autocomplete,
    CardHeader,
    Checkbox,
    FormControlLabel,
    Menu,
    Radio,
    RadioGroup,
    StepContent,
    Switch,
    TextField
} from '@mui/material'
import { MenuItem } from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux'
import { fetchAssigneeRoles, setAssignees, setProjectRoles, assigneeRoles } from 'src/store/apps/projects';


const UserTable = ({ selectedUsers, managerAssignments, setManagerAssignments }) => {
    const [error, setError] = useState('');
    const dispatch = useDispatch()

    const apiRef = useGridApiRef();

    const store = useSelector(state => state.projects)

    const handleEditCellChange = (meta) => {
        let updatedRow = apiRef.current.getRowWithUpdatedValues(meta.id, meta.field)
        setManagerAssignments(managerAssignments?.map(item => item.email === meta.id ? updatedRow : item))
    }

    const handleCheckChange = (row, value) => {
        const updatedUserRole = managerAssignments?.map(item => item.email === row?.email ? { ...item, projectRoleId: value?.projectRoleId } : item);
        setManagerAssignments(updatedUserRole)
    }

    // const handleCheckChange = (e, email) => {
    //     const selectedRoleId = e.target.value; 
    //     setManagerAssignments(managerAssignments.map(item =>
    //         item.email === email ? { ...item, projectRoleId: selectedRoleId } : item
    //     ));
    // };


    const columns = [
        { field: 'userName', headerName: 'Name', width: 400 },
        {
            field: 'allocatedProjectCost', headerName: 'Cost', width: 200, editable: true, type: "number",
            align: 'left',
            headerAlign: "left",
            renderEditCell: (params) => (
                <GridEditInputCell
                    {...params}
                    onKeyDown={(e) => {
                        if (e.key === '-' || e.key === '+') {
                            e.preventDefault();
                        }
                    }}
                    inputProps={{ min: 0 }}
                />
            )
        },
        {
            field: 'availablePercentage',
            headerName: 'Availability %',
            width: 200,
            editable: true,
            type: "number",
            align: 'left',
            headerAlign: "left",

            renderEditCell: (params) => (
                <GridEditInputCell
                    {...params}
                    onKeyDown={(e) => {
                        // if (e.key === '-' || e.key === '+') {
                        //     e.preventDefault();
                        // }
                        const currentValue = parseFloat(e.target.value + e.key);
                        if (e.key === '-' || e.key === '+' || currentValue > 100) {
                            e.preventDefault();
                        }
                    }}
                    inputProps={{ min: 1, max: 100 }}
                />
            )


        },
        // {
        //     field: 'projectRoleId',
        //     headerName: 'Assign as Project Manager',
        //     width: 400,
        //     renderCell: (params) => (
        //         <Switch
        //             checked={params.value === 3}
        //             onChange={(e) => handleCheckChange(e, params.row.email)}
        //         />
        //     ),
        // },

        // {
        //     field: 'projectRoleId',
        //     headerName: 'Project Role Name',
        //     width: 20000,
        //     renderCell: (params) => (
        //         <Autocomplete
        //             options={store.assigneeRoles || []}
        //             id='autocomplete-limit-tags'
        //             getOptionLabel={option => option.projectRoleName || option}
        //             onChange={(e, v) => handleCheckChange(e, params.row.email)}
        //             value={params.value || 'user'}
        //             renderInput={params => (
        //                 <TextField {...params} sx={{ width: '1000' }} />
        //             )}
        //             noOptionsText='No Roles'
        //         />

        //     ),
        // },
        {
            field: 'projectRoleName',
            headerName: 'Project Role Name',
            width: 1000,
            renderCell: ({ row, value }) => (
                <Autocomplete
                    options={store.assigneeRoles || []}
                    id='autocomplete-limit-tags'
                    getOptionLabel={option => option.projectRoleName || option}
                    onChange={(e, v) => handleCheckChange(row, v)}
                    defaultValue={"User"}
                    value={value}
                    sx={{ width: '20%' }}
                    noOptionsText='No Roles'
                    renderInput={params => (
                        <TextField {...params} variant="standard"
                        //  InputProps={{ disableUnderline: true }}
                        />
                    )}
                />
            ),
        },


    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={managerAssignments}
                columns={columns}
                pageSize={5}
                getRowId={(row) => row.email}
                apiRef={apiRef}
                onCellEditStop={handleEditCellChange}
                localeText={{ noRowsLabel: NODATA.noData('assignee') }}
            />
        </div>
    );
};

export default UserTable;
