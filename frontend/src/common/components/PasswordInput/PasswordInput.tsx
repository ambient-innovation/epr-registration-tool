import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { useTranslation } from 'next-i18next'
import React, { forwardRef, useState } from 'react'

export const PasswordInput = forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    const { t } = useTranslation()
    const [showPassword, setShowPassword] = useState(false)

    const handleMouseDownPassword = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      event.preventDefault()
    }

    return (
      <TextField
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        label={t('password')}
        InputProps={{
          endAdornment: (
            <InputAdornment position={'end'}>
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={handleMouseDownPassword}
                edge={'end'}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    )
  }
)
