// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'

const Remainings = props => {
    // ** Props
    const { title, subtitle, icon, stats, trendNumber, optionsMenuProps, color = 'primary', trend = 'positive' } = props

    return (
        <Card sx={{ border: theme => `1px solid ${theme.palette.primary.main}`, background: '#f5f5f5' }}>
            <CardContent>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{title}</Typography>
                <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', mb: 1.5, justifyConten: "center", alignItems: 'center' }}>
                    <Typography variant='h4' sx={{ mr: 2 }}>
                        {stats}
                    </Typography>
                </Box>
            </CardContent>
        </Card >
    )
}

export default Remainings
