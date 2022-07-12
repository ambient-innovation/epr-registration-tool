import { ThemeOptions } from '@mui/material/styles/createTheme'

import { borderRadius } from './borderRadius'
import { palette } from './colorsPalette'

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    inverted: true
  }
}

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
  MuiButton: {
    variants: [
      {
        props: { variant: 'inverted' },
        style: ({ theme }) => ({
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.common.white,
          border: `1px solid ${theme.palette.primary.main}`,
          '&:hover': {
            backgroundColor: theme.palette.grey['300'],
          },
        }),
      },
      {
        props: { variant: 'inverted', color: 'secondary' },
        style: ({ theme }) => ({
          color: theme.palette.secondary.main,
          backgroundColor: theme.palette.common.white,
          border: `1px solid ${theme.palette.secondary.main}`,
          '&:hover': {
            backgroundColor: theme.palette.grey['300'],
          },
        }),
      },
      {
        props: { variant: 'inverted', color: 'error' },
        style: ({ theme }) => ({
          color: theme.palette.error.main,
          backgroundColor: theme.palette.common.white,
          border: `1px solid ${theme.palette.secondary.main}`,
          '&:hover': {
            backgroundColor: theme.palette.grey['300'],
          },
        }),
      },
    ],
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
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: borderRadius[3],
      },
    },
  },
}
