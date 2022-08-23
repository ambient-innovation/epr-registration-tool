// --> Documentation
// https://mui.com/material-ui/customization/palette/#adding-new-colors
declare module '@mui/material/styles' {
  interface TypeBackground {
    default: string
    paper: string
    light: string
  }
}

const primaryColors = {
  main: '#16284C',
  light: '#435078',
  dark: '#000024',
  contrastText: '#fff',
}

const secondaryColors = {
  main: '#B6A268',
  light: '#D9CBA3',
  dark: '#85743C',
  contrastText: '#fff',
}

export const palette = {
  primary: primaryColors,
  secondary: secondaryColors,
  text: {
    primary: primaryColors.main,
  },
  error: {
    main: '#D32F2F',
    dark: '#C62828',
  },
  background: {
    light: '#F3F4F6',
    paper: '#FFF',
  },
  common: {
    black: '#121212',
    white: '#fff',
  },
  success: { main: '#2E7D32' },
}

export type ColorPalette = typeof palette
