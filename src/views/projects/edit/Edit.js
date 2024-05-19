/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjects, setEditProject } from 'src/store/apps/projects'
import ProjectsEditStepper from 'src/views/projects/edit/ProjectsEditStepper'

const Edit = ({ id }) => {
  const dispatch = useDispatch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch(fetchProjects())
  }, [])

  return (
    <Grid>
      <ProjectsEditStepper id={id} />
    </Grid>
  )
}

export default Edit
