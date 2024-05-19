import { Grid } from '@mui/material'
import React from 'react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import AnalyticsTrophy from './charts/revenueCard'
import AnalyticsTransactionsCard from './charts/growthCard'
import AnalyticsTotalEarning from './charts/totalEarningCard'
import ApexDonutChart from './charts/ProjectPerformanceChart'
import CrmRevenueReport from './charts/revenueChart'
import ProjectCostCard from './charts/projectCostCard'
import CardStatsLineChart from './charts/projectGrowthChart'
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'
import Icon from 'src/@core/components/icon'
import SessionAnalytics from './charts/analyticsSession'
import CardStatsVertical from './charts/cardStatsVertical'

const financialReports = () => {
  return (
    <ApexChartWrapper>
        <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
                <AnalyticsTrophy/>
            </Grid>
            <Grid item xs={12} md={8}>
              <AnalyticsTransactionsCard/>
            </Grid>
            <Grid item xs={12} md={4}>
            <AnalyticsTotalEarning/>
            </Grid>
            <Grid item xs={12} md={4}>
              <ApexDonutChart/>
            </Grid>
            <Grid item xs={12} md={4}>
              <CrmRevenueReport/>
            </Grid>
            <Grid item xs={12} md={8}>
            <ProjectCostCard/>
            </Grid>
            <Grid item xs={12} md={4}  >
              <Grid container spacing={6}  >
                <Grid item xs={12} md={6}>
                <CardStatsVertical
                  stats='$86.4k'
                  trend='negative'

                  // trendNumber='-18%'
                  title='Resource Billability'
                   
                  icon={<Icon icon='mdi:briefcase-variant-outline' />}
                />
                </Grid>
                <Grid item xs={12} md={6}>
                    <CardStatsVertical
                  stats='23'
                  icon={<Icon icon='mdi:poll' />}
                  color='secondary'
                  
                  // trendNumber='+42%'
                  title='Total Customers'
                  subtitle=''
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                <CardStatsLineChart/>
                </Grid>
                <Grid item xs={12} md={6}>
                <SessionAnalytics/>
                </Grid>
              </Grid>
             
            </Grid>
             



        </Grid>
    </ApexChartWrapper>
  )
}

export default financialReports