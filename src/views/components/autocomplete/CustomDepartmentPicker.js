import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Avatar, Box, Chip } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { getInitials } from 'src/@core/utils/get-initials'

const CustomDepartmentPicker = ({ values, items, label, setDepartments }) => {
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
    setSelectedValues(values.flat())
    const index = _options.findIndex(o => o.skillName === newValue[0].skillName)
    _options.splice(index, 1)
    setOptions(_options)
    setDepartments && setDepartments(values.flat())
  }

  const handleDelete = selectedValue => {
    const values = [...selectedValues]
    const person = items.find(o => o.skillName === selectedValue.skillName)
    const indx = values.findIndex(o => o.skillName === selectedValue.skillName)
    values.splice(indx, 1)
    !options.includes(person) && options.push(person)
    setOptions(options)
    setSelectedValues(values)
    setDepartments && setDepartments(values)
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
        getOptionLabel={option => option.skillName}
        renderInput={params => <TextField {...params} label={label} />}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 3 }}>
        {selectedValues.map((selectedValue, key) => {
          return (
            <Chip
              key={key}
              color='primary'
              variant='filled'
              onDelete={() => handleDelete(selectedValue)}
              label={selectedValue.skillName}
              size='small'
              sx={{ m: 1.5 }}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default React.memo(CustomDepartmentPicker)
