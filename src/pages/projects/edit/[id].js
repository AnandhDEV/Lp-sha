import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import Edit from 'src/views/projects/edit/Edit'

const ProjectEdit = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <Grid>
      <Edit id={id} />
    </Grid>
  )
}

export default ProjectEdit
