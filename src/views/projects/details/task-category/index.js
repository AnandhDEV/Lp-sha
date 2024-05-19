import { Grid, Typography } from '@mui/material'
import { unwrapResult } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories, fetchProjectMembers, fetchTasks, setEmpty } from 'src/store/apps/projects'
import EmptyTask from 'src/views/projects/details/task-category/tasks/EmptyTask'
import TaskLists from 'src/views/projects/details/task-category/tasks/TaskLists'

const TaskCategory = ({ id }) => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const [isLoading, setLoading] = useState(true)


  useEffect(() => {
    dispatch(fetchTasks(id))
      .then(unwrapResult)
      .then(res => {
        setLoading(!isLoading)
        res?.result.tasksByCategory?.length > 0
          ? dispatch(setEmpty(false))
          : dispatch(setEmpty(true))
      })
  }, [id])


  const handleLoading = loading => {
    setLoading(loading)
  }

  //return <TaskLists />
  return <TaskLists isLoading={isLoading} setLoading={setLoading} id={id} />
}

export default TaskCategory
