import { TextField, TextFieldProps, MenuItem } from '@mui/material'
import { forwardRef } from 'react'

export type SelectField = Omit<TextFieldProps, 'children'> & {
  options: { value: string; label: string }[]
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
