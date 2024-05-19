import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Avatar, Box, Chip } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { getInitials } from 'src/@core/utils/get-initials'

const CustomPeoplePicker = ({ items, label, onSelect }) => {
  const [selectedValues, setSelectedValues] = React.useState([])
  const [fieldValue, setFieldValue] = React.useState([])
  const [options, setOptions] = React.useState([])
  React.useEffect(() => {
    setOptions(items)
  }, [items])

  const handleChange = (event, newValue) => {
    var _options = [...options]
    const values = [...selectedValues.flat(), newValue[0]]
    setSelectedValues(values.flat())
    const index = _options.findIndex(o => o.userName === newValue[0].userName)
    _options.splice(index, 1)
    setOptions(_options)
    onSelect(values.flat())
  }

  const handleDelete = selectedValue => {
    const values = [...selectedValues]
    const person = items.find(o => o.userName === selectedValue.userName)
    const indx = values.findIndex(o => o.userName === selectedValue.userName)
    values.splice(indx, 1)
    !options.includes(person) && options.push(person)
    setOptions(options)
    setSelectedValues(values)
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
        getOptionLabel={option => option.userName}
        renderInput={params => <TextField {...params} label={label} />}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 3 }}>
        {selectedValues.map((selectedValue, key) => {
          return (
            <Chip
              key={key}
              avatar={<Avatar src={`/images/avatars/${key + 1}.png`} />}
              color='primary'
              variant='outlined'
              onDelete={() => handleDelete(selectedValue)}
              label={selectedValue.userName}
              size='small'
              sx={{ m: 1.5 }}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default React.memo(CustomPeoplePicker)
