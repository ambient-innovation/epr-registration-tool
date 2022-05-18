import { TypographyOptions } from '@mui/material/styles/createTypography'

import { breakpoints } from './breakpoints'
import { pxToRemAsString } from './utils'

export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  bold: '600',
}

export const typography: TypographyOptions = {
  fontFamily: 'Noto Sans',
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  h1: {
    fontSize: pxToRemAsString(60),
    fontWeight: fontWeights.light,
    lineHeight: '116.7%',
    letterSpacing: -1.5,
    [breakpoints.up('lg')]: {
      fontSize: pxToRemAsString(96),
    },
  },
  h2: {
    fontSize: pxToRemAsString(48),
    fontWeight: fontWeights.light,
    lineHeight: '120%',
    letterSpacing: -0.5,
    [breakpoints.up('lg')]: {
      fontSize: pxToRemAsString(60),
    },
  },
  h3: {
    fontSize: pxToRemAsString(36),
    fontWeight: fontWeights.medium,
    lineHeight: '116%',
    [breakpoints.up('lg')]: {
      fontSize: pxToRemAsString(48),
    },
  },
  h4: {
    fontSize: pxToRemAsString(30),
    fontWeight: fontWeights.medium,
    lineHeight: '123%',
    letterSpacing: 0.25,
    [breakpoints.up('lg')]: {
      fontSize: pxToRemAsString(34),
    },
  },
  h5: {
    fontSize: pxToRemAsString(24),
    fontWeight: fontWeights.medium,
    lineHeight: '133%',
  },
  h6: {
    fontSize: pxToRemAsString(20),
    fontWeight: fontWeights.bold,
    lineHeight: '160%',
    letterSpacing: 0.15,
  },
  body1: {
    fontSize: pxToRemAsString(16),
    fontWeight: fontWeights.medium,
    lineHeight: '150%',
    letterSpacing: 0.15,
  },
  body2: {
    fontSize: pxToRemAsString(14),
    fontWeight: fontWeights.medium,
    lineHeight: '143%',
    letterSpacing: 0.17,
  },
  subtitle1: {
    fontSize: pxToRemAsString(16),
    fontWeight: fontWeights.medium,
    lineHeight: '175%',
    letterSpacing: 0.15,
  },
  subtitle2: {
    fontSize: pxToRemAsString(14),
    fontWeight: fontWeights.bold,
    lineHeight: '157%',
    letterSpacing: 0.1,
  },
  overline: {
    fontSize: pxToRemAsString(12),
    fontWeight: fontWeights.medium,
    lineHeight: '266%',
    letterSpacing: 0.1,
  },
  caption: {
    fontSize: pxToRemAsString(12),
    fontWeight: fontWeights.medium,
    lineHeight: '166%',
    letterSpacing: 0.1,
  },
}
