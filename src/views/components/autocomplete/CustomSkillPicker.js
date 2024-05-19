import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Avatar, Box, Chip } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { getInitials } from 'src/@core/utils/get-initials'

const CustomSkillPicker = ({ values, items, label, setSkills, onRemove, originalItems }) => {
  const [selectedValues, setSelectedValues] = React.useState([])
  const [fieldValue, setFieldValue] = React.useState([])
  const [options, setOptions] = React.useState([])
  React.useEffect(() => {
  const _items = [...items];
   const sortedItems = _items?.length ? _items?.sort(function(a,b){
      return a.skillName.localeCompare(b.skillName);
  }) : [];
    setOptions(sortedItems)
    setSelectedValues(values)
  }, [items, values])

  const handleChange = (event, newValue) => {
    const selectedSkills = [...selectedValues, ...newValue]
    setSelectedValues(selectedSkills)
    const remainingOptions = options.filter(option => !selectedSkills.includes(option))
    setOptions(remainingOptions.sort(function(a,b){
      return a.skillName.localeCompare(b.skillName);
  }))
    setSkills && setSkills(selectedSkills)
  }

  const handleDelete = selectedValue => {
    const values = [...selectedValues]
    const _skill = originalItems.find(o => o.skillName === selectedValue.skillName)
    const indx = values.findIndex(o => o.skillName === selectedValue.skillName)
    values.splice(indx, 1)
    !options.includes(_skill) && options.push(_skill)
    setOptions(options.sort(function(a,b){
      return a.skillName.localeCompare(b.skillName);
  }))
    setSkills(values)
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
        getOptionLabel={option => option?.skillName}
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

export default React.memo(CustomSkillPicker)
