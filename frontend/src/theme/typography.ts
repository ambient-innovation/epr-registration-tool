import { TypographyOptions } from '@mui/material/styles/createTypography'

import { breakpoints } from '@/theme/breakpoints'

export const typography: TypographyOptions = {
  fontFamily: 'Noto Sans',
  h1: {
    fontSize: '6rem',
    fontWeight: 700,
    lineHeight: '100%',
    [breakpoints.up('laptop')]: {
      fontSize: '7.2rem',
    },
  },
  h2: {
    fontSize: '4.8rem',
    fontWeight: 700,
    lineHeight: '100%',
    [breakpoints.up('laptop')]: {
      fontSize: '6rem',
    },
  },
  h3: {
    fontSize: '3.6rem',
    fontWeight: 700,
    lineHeight: '120%',
    [breakpoints.up('laptop')]: {
      fontSize: '4.8rem',
      lineHeight: '100%',
    },
  },
  h4: {
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: '133%',
    [breakpoints.up('laptop')]: {
      fontSize: '3.6rem',
      lineHeight: '120%',
    },
  },
  h5: {
    fontSize: '2.4rem',
    fontWeight: 700,
    lineHeight: '133%',
    [breakpoints.up('laptop')]: {
      fontSize: '3rem',
      lineHeight: '120%',
    },
  },
  h6: {
    fontSize: '2rem',
    lineHeight: '120%',
  },
  // todo body1, ...
}
