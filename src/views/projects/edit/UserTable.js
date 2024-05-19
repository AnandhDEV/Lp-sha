/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'
import { useState } from 'react'
import Switch from '@mui/material/Switch'
import { Card, Grid, TextField } from '@mui/material'

const UserTable = ({ selectedUsers, managerAssignments, setManagerAssignments }) => {
  const apiRef = useGridApiRef()

  const handleEditCellChange = meta => {
    let updatedRow = apiRef.current.getRowWithUpdatedValues(meta.id, meta.field)
    setManagerAssignments(
      managerAssignments?.map(item => (item.email === meta.id ? updatedRow : item))
    )
  }

  const handleCheckChange = (e, email) => {
    let ismanager = e.target.checked
    setManagerAssignments(
      managerAssignments?.map(item =>
        item.email === email ? { ...item, projectRoleId: ismanager ? 3 : 4 } : item
      )
    )
  }

  useEffect(() => {
    setManagerAssignments(selectedUsers && [])
  }, [selectedUsers])

  const columns = [
    { width: 200, field: 'userName', headerName: 'Name' },
    {
      width: 200,
      field: 'allocatedProjectCost',
      headerName: 'Cost',
      editable: true,
      type: 'number',
      align: 'left',
      headerAlign: 'left'
    },
    {
      width: 200,
      field: 'availablePercentage',
      headerName: 'Available Percentage',
      editable: true,
      type: 'number',
      align: 'left',
      headerAlign: 'left'
    },
    {
      width: 200,
      field: 'projectRoleId',
      headerName: 'Assign as Project Manager',
      renderCell: params => (
        <Switch
          checked={params.value === 3}
          onChange={e => handleCheckChange(e, params.row.email)}

          // checked={managerAssignments[params.row.id]}
          // onChange={() =>
          //     setManagerAssignments((prevAssignments) => ({
          //         ...prevAssignments,
          //         [params.row.id]: !prevAssignments[params.row.id],
          //     }))
          // }
        />
      )
    }
  ]

  return (
    <Card xs={12} sx={{ maxWidth: '100%' }}>
      <DataGrid
        autoHeight
        autoPageSize
        rows={managerAssignments || []}
        columns={columns}
        pageSize={5}
        getRowId={row => row?.email}
        apiRef={apiRef}
        // cellEditStart={handleCellEditCommit}
        // onCellEditStart={handleEditCellChange}
        onCellEditStop={handleEditCellChange}
      />
    </Card>
  )
}

export default UserTable
