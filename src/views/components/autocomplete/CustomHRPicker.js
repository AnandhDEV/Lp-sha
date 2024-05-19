import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Avatar, Box, Chip } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { getInitials } from 'src/@core/utils/get-initials'

const CustomHRPicker = ({ items, values, label, onSelect, onDelete, originalItems, error }) => {
  const [selectedValues, setSelectedValues] = React.useState([])
  const [fieldValue, setFieldValue] = React.useState([])
  const [options, setOptions] = React.useState([])
  React.useEffect(() => {
    const sortedItems = items.sort(function(a,b){
      return a.firstName.localeCompare(b.firstName);
  })
    setOptions(sortedItems)
    setSelectedValues(values)
  }, [items, values])

  const handleChange = (event, newValue) => {
    var _options = [...options]
    const values = [...selectedValues.flat(), newValue[0]]
    setSelectedValues(values.flat())
    const index = _options.findIndex(o => o.fullName === newValue[0].fullName)
    _options.splice(index, 1)
    setOptions(_options.sort(function(a,b){
      return a.firstName.localeCompare(b.firstName);
  }))
    onSelect(values.flat())
  }

  const handleDelete = selectedValue => {
    const values = [...selectedValues]
    const person = originalItems.find(o => o.fullName === selectedValue.fullName)
    const indx = values.findIndex(o => o.fullName === selectedValue.fullName)
    values.splice(indx, 1)
    !options.includes(person) && options.push(person)
    setOptions(options.sort(function(a,b){
      return a.firstName.localeCompare(b.firstName);
  }))
    setSelectedValues(values)
    onDelete(person)
  }

  return (
    <Box>
      <Autocomplete
        error={error}
        multiple
        fullWidth
        limitTags={3}
        disablePortal
        id='combo-box-demo'
        value={fieldValue}
        onChange={handleChange}
        options={options}
        getOptionLabel={option => option.fullName}
        renderInput={params => <TextField {...params} label={label} />}
        noOptionsText='No Users'
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 3 }}>
        {selectedValues?.map((selectedValue, key) => {
          return (
            <Chip
              key={key}
              avatar={<Avatar src={`/images/avatars/${key + 1}.png`} />}
              color='primary'
              variant='outlined'
              onDelete={() => handleDelete(selectedValue)}
              label={selectedValue.fullName}
              size='small'
              sx={{ m: 1.5 }}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default React.memo(CustomHRPicker)
