import { ThemeOptions } from '@mui/material/styles/createTheme'

import { borderRadius } from './borderRadius'
import { palette } from './colorsPalette'

export const components: ThemeOptions['components'] = {
  MuiButtonBase: {
    defaultProps: {
      // No more ripple, on the whole application 💣!
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        borderRadius: borderRadius[2],
        '&.Mui-focusVisible': {
          outline: '0.125rem solid #4299E1',
        },
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      asterisk: {
        // hide asterisk --> we mark optional fields instead
        display: 'none',
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        backgroundColor: palette.background.paper,
      },
    },
  },
  MuiStepIcon: {
    styleOverrides: {
      root: {
        '&.Mui-active': {
          circle: {
            fill: palette.background.light,
            stroke: palette.secondary.main,
            strokeWidth: 2,
            r: 11,
          },
          text: {
            fill: palette.text.primary,
          },
        },
        '&.Mui-completed': {
          path: {
            fill: palette.secondary.main,
          },
        },
      },
    },
  },
}