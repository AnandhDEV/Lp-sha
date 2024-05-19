// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRandomColor } from 'src/helpers/helpers'
import { CHART_COLORS, NODATA } from 'src/helpers/constants'
import { useTheme } from '@emotion/react'
import { Spinner } from 'src/@core/components/spinner'
import { fetchDashboard } from 'src/store/absence-management'
import { setDate } from 'date-fns'

const RADIAN = Math.PI / 180

const renderCustomizedLabel = props => {
  // ** Props
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill='#fff' textAnchor='middle' dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const renderPieValue = props => {
  // ** Props
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill='#fff' textAnchor='middle' dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const LeaveDetails = () => {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const dispatch = useDispatch()
  const store = useSelector(state => state.leaveManagement)
  const theme = useTheme()

  useEffect(() => {
    const _data = []
    const colors = CHART_COLORS(theme)
    store.dashboards?.forEach((p, i) => {
      _data.push({
        name: p.name,
        value: p.balanceCount,
        color: colors[i] == null ? colors[1] : colors[i]
      })
    })

    if (store.dashboards != null) {
      const available = _data.map(o => o.value)
      const isShow = available.some(o => o > 0)
      setShow(!isShow && store.policies != null && store.policies.length == 0)
      setData(_data)
      setLoading(false)
    }

    return () => {
      setShow(false)
    }
  }, [store.dashboards])

  return (
    <Card>
      <CardHeader
        title='Available Leaves'
        subheaderTypographyProps={{
          sx: { color: theme => `${theme.palette.text.disabled} !important` }
        }}
      />
      <CardContent>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {data.length > 0 || (store.policies != null && store.policies.length > 0) ? (
              <>
                <Box sx={{ height: data?.length > 0 ? 280 : 0 }}>
                  <ResponsiveContainer>
                    <PieChart style={{ direction: 'ltr' }} stroke='none'>
                      <Pie data={data} innerRadius={50} dataKey='value' label labelLine={false}>
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 4, justifyContent: 'center' }}>
                  {data.map((item, key) => (
                    <Box
                      key={key}
                      sx={{
                        mr: 6,
                        display: 'flex',
                        alignItems: 'center',
                        '& svg': { mr: 1.5, color: item.color }
                      }}
                    >
                      <Icon icon='mdi:circle' fontSize='0.75rem' />
                      <Typography variant='body2'>{item.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <div className='gap-1'>
                <Typography>{NODATA.noLeave}</Typography>
                <img
                  src='/images/cards/pose_m18.png'
                  alt=''
                  height='80'
                  style={{ marginTop: -30 }}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default LeaveDetails
