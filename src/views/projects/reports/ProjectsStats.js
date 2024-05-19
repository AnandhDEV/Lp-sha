import { Grid, Typography } from '@mui/material'
import React, { memo, useEffect, useState } from 'react'
import BurnedCostPie from 'src/views/projects/reports/chart/ApexDonutChart'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import ProjectProfit from 'src/views/projects/reports/chart/ProjectProfit'
import TaskStatus from 'src/views/projects/reports/chart/TaskStatus'
import PendingTaskPriority from 'src/views/projects/reports/chart/PendingTaskPriority'
import ResourceUtilizationIndex from 'src/views/projects/reports/chart/ResourceUtlizationIndex'
import RevenueIndex from 'src/views/projects/reports/chart/RevenueIndex'
import TaskEfficiency from 'src/views/projects/reports/chart/TaskEfficiency'
import TaskProgressPie from 'src/views/projects/reports/chart/TaskProgress'
import TaskProgressArea from 'src/views/projects/reports/chart/TaskProgressArea'
import TaskCompletionRate from './chart/TaskCompletionRate'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectsReport } from 'src/store/apps/projects'
import { useRouter } from 'next/router'
// import { fetchBurnedCost } from 'src/store/apps/reports'
// import { fetchTaskProgress } from 'src/store/apps/reports'
import {
  fetchBurnedCost,
  fetchTaskProgress,
  fetchTaskCompletionRate,
  fetchProjectProfitReport,
  fetchPendingTaskPriorityReport,
  fetchTaskStatusCountReport,
  fetchTaskProgressGraphReport,
  fetchResourceUtilizationCostReport,
  fetcTaskEfficiencyIndexReport,
  fetchResourceUtilizationReport
} from 'src/store/apps/reports'
import { unwrapResult } from '@reduxjs/toolkit'
import FallbackSpinner, { BackdropSpinner } from 'src/@core/components/spinner'
import toast from 'react-hot-toast'
import { NODATA } from 'src/helpers/constants'
import CustomBackButton from 'src/@core/components/back-button'

const ProjectsStats = ({ id, tab }) => {
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(false)
  const { projectReport } = useSelector(state => state.projects)

  const router = useRouter()
  //const perviousTab = localStorage.getItem('previousTab')

  const { burnedCost,
    taskProgressPercentage,
    taskCompletionRatePercentage,
    projectProfitAndRate,
    pendingTaskPriorityResponse,
    taskStatusCount,
    taskProgressGraph,
    resourceUtilizationCost,
    taskEfficiencyIndexPercentage,
    resourceUtilizationPercentage } = useSelector(state => state.reports)


  useEffect(() => {
    setLoader(true)
    if (id) {
      dispatch(fetchProjectsReport(id))
        .then(unwrapResult)
        .then(() => {
          setLoader(false)
        })
        .catch(error => {
          setLoader(false)
          toast.error(NODATA.error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleBack = () => {
    router.push({ pathname: `/projects/details/task/${id}` })
  }



  useEffect(() => {
    setLoader(true)
    if (id) {
      dispatch(fetchBurnedCost(id)),
        dispatch(fetchTaskProgress(id)),
        dispatch(fetchTaskCompletionRate(id)),
        dispatch(fetchProjectProfitReport(id)),
        dispatch(fetchPendingTaskPriorityReport(id)),
        dispatch(fetchTaskStatusCountReport(id)),
        dispatch(fetchTaskProgressGraphReport(id)),
        dispatch(fetchResourceUtilizationCostReport(id)),
        dispatch(fetcTaskEfficiencyIndexReport(id)),
        dispatch(fetchResourceUtilizationReport(id))
          // .then(([burnedCostResult, taskProgressResult,taskCompletionRateResult]) => {
          //   unwrapResult(burnedCostResult)
          //   unwrapResult(taskProgressResult)
          //   unwrapResult(taskCompletionRateResult)
          //   setLoader(false)
          // })
          .then(() => { setLoader(false) })
          .catch(error => {
            setLoader(false)
            toast.error(NODATA.error)
          })

    }
  }, [id])


  return (
    <>
      {loader ? (
        <BackdropSpinner />
      ) : (
        <>
          <Grid container spacing={6}>
            <Typography variant="h4" gutterBottom style={{ fontSize: '24px', color: '#8A2BE2' }}>
              {/* <CustomBackButton title={projectProfitAndRate?.projectName} onClickBack={handleBack}  /> */}
              <CustomBackButton title={projectProfitAndRate?.projectName} onClickBack={handleBack} />
            </Typography>
          </Grid>
          <ApexChartWrapper >
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                {/* <ProjectProfit details={projectReport?.projectProfitDto || {}} /> */}
                <ProjectProfit details={projectProfitAndRate} />
                <br />
                <TaskCompletionRate details={taskCompletionRatePercentage || {}} />
              </Grid>
              <Grid item xs={12} md={3} lg={3} sm={6}>
                {/* <BurnedCostPie details={projectReport?.burnedCostReportDto || {}} /> */}
                {/* <BurnedCostPie details={{ burnedCostPercentage: burnedCost } || {}} /> */}
                <BurnedCostPie details={burnedCost || {}} />
              </Grid>
              <Grid item xs={12} md={3} lg={3} sm={6}>
                {/* <TaskProgressPie details={projectReport?.taskProgressDto || {}} /> */}
                <TaskProgressPie details={{ taskProgressPercentage } || {}} />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <TaskStatus details={taskStatusCount?.taskCounts || []} />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={4}>
                <TaskEfficiency details={taskEfficiencyIndexPercentage || {}} />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={4}>
                <ResourceUtilizationIndex details={resourceUtilizationPercentage || {}} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <RevenueIndex details={resourceUtilizationCost || {}} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <PendingTaskPriority details={pendingTaskPriorityResponse?.taskPriorityCounts} />
              </Grid>
              <Grid item xs={12} sm={6} md={8} lg={8}>
                <TaskProgressArea details={taskProgressGraph || {}} />
              </Grid>
            </Grid>
          </ApexChartWrapper>
        </>
      )}
    </>
  )
}

export default memo(ProjectsStats)
