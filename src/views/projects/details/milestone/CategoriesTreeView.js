// ** MUI Imports
import Accordion from '@mui/material/Accordion'
import Typography from '@mui/material/Typography'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Box } from '@mui/system'
import { TASk_LIST } from 'src/helpers/constants'

const CategoriesTreeView = ({ categories }) => {
  return (
    <div>
      {categories &&
        categories.map((category, i) => (
          <Accordion key={i} sx={{ mt: 1 }}>
            <AccordionSummary
              id='panel-header-1'
              aria-controls='panel-content-1'
              // expandIcon={<Icon icon='mdi:chevron-down' />}
            >
              <Typography>{category.name}</Typography>
            </AccordionSummary>
            {/* <AccordionDetails></AccordionDetails> */}
          </Accordion>
        ))}
    </div>
  )
}

export default CategoriesTreeView
