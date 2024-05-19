

import styled from '@emotion/styled';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react'
import ReactApexcharts from 'src/@core/components/react-apexcharts';

const ProgressBar = () => {



  const options = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    series: [65],
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        }
      },
    },
    labels: ['Cricket'],
  }

  // Styled Grid component
  const StyledGrid = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    [theme.breakpoints.up('sm')]: {
      borderRight: `1px solid ${theme.palette.divider}`
    }
  }))



  return (
    <Card sx={{ height: 380 }}>
      <Grid container>
        <StyledGrid item xs={12}>
          <CardContent sx={{ height: '100%', '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
            <Typography variant='h6'>Total Profit</Typography>
            <ReactApexcharts type='radialBar' height={300} options={options} series={[65]} />
          </CardContent>
        </StyledGrid>

      </Grid>
    </Card >
  )
}

export default ProgressBar
