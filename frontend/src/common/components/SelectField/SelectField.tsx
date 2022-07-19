import { TextField, TextFieldProps, MenuItem } from '@mui/material'
import { forwardRef } from 'react'

export type SelectField = Omit<TextFieldProps, 'children' | 'defaultValue'> & {
  options: { value: string; label: string }[]
  // Make `defaultValue` non-optional:
  // With `select={true}` we have to explicitly pass a defaultValue
  // because the actual input element, which react-hook-form controls,
  // is hidden and therefore cannot reflect the default value
  defaultValue?: TextFieldProps['defaultValue']
}

export const SelectField = forwardRef<HTMLInputElement, SelectField>(
  ({ options, select = true, ...props }, ref) => {
    return (
      <TextField ref={ref} select={select} {...props}>
        {options.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>
    )
  }
)
