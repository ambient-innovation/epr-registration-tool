import { SxProps, Theme } from '@mui/material'

import { pxToRemAsString } from '@/theme/utils'

export const backgroundSx: SxProps<Theme> = {
  backgroundColor: 'background.light',
  borderRadius: 3,
  padding: {
    xs: 6,
    sm: 7,
    md: 8,
  },
}

export const buttonWrapperSx: SxProps<Theme> = {
  marginTop: 6,
  display: 'flex',
  justifyContent: 'flex-end',

  button: {
    fontWeight: 600, // note --> maybe move to theme
    textTransform: 'uppercase',

    '&:nth-child(1)': {},

    '&:nth-child(2)': {
      marginLeft: 5,
      minWidth: pxToRemAsString(42),
    },

    '&.Mui-focusVisible': {
      outline: '0.125rem solid #4299E1',
    },
  },
}
