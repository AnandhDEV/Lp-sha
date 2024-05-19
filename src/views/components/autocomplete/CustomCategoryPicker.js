import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Avatar, Box, Chip } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { getInitials } from 'src/@core/utils/get-initials'

const CustomCategoryPicker = ({ values, items, label, setCategories, setItems, originalItems }) => {
  const [selectedValues, setSelectedValues] = React.useState([])
  const [fieldValue, setFieldValue] = React.useState([])
  const [options, setOptions] = React.useState([])
  React.useEffect(() => {
    setOptions(items)
    setSelectedValues(values)
  }, [items, values])

  const handleChange = (event, newValue) => {
    var _options = [...options]
    const values = [...selectedValues.flat(), newValue[0]]
    setCategories(values.flat())
    const index = _options.findIndex(o => o.name === newValue[0].name)
    _options.splice(index, 1)
    setItems(_options)
  }

  const handleDelete = selectedValue => {
    const values = [...selectedValues]
    const person = originalItems.find(o => o.name === selectedValue.name)
    const indx = values.findIndex(o => o.name === selectedValue.name)
    values.splice(indx, 1)
    !options.includes(person) && options.push(person)
    setItems(options)
    setCategories(values)
  }

  return (
    <Box>
      <Autocomplete
        multiple
        fullWidth
        limitTags={3}
        disablePortal
        id='combo-box-demo'
        value={fieldValue}
        onChange={handleChange}
        options={options}
        getOptionLabel={option => option.name}
        renderInput={params => <TextField {...params} label={label} />}
        noOptionsText="No Categories"
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 3 }}>
        {selectedValues.map((selectedValue, key) => {
          return (
            <Chip
              key={key}
              color='primary'
              variant='filled'
              onDelete={() => handleDelete(selectedValue)}
              label={selectedValue.name}
              size='small'
              sx={{ m: 1.5 }}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default React.memo(CustomCategoryPicker)
