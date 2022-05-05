// use module augmentation for the theme to accept the new breakpoint values.
import { createBreakpoints } from '@mui/system'

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false // removes the breakpoint
    sm: false
    md: false
    lg: false
    xl: false
    mobile: true // adds the `mobile` breakpoint
    tablet: true
    laptop: true
    desktop: true
  }
}

export const breakpoints = createBreakpoints({
  // equivalent to 'sm', 'md', 'lg', 'xl'
  keys: ['mobile', 'tablet', 'laptop', 'desktop'],
  values: { mobile: 480, tablet: 768, laptop: 992, desktop: 1280 },
})

export type BreakpointKeyType = keyof typeof breakpoints.values
