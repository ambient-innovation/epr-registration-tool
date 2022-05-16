// use module augmentation for the theme to accept the new breakpoint values.
import { createBreakpoints } from '@mui/system'

export const breakpoints = createBreakpoints({
  values: { xs: 375, sm: 720, md: 1024, lg: 1440, xl: 2048 },
})

export type BreakpointKeyType = keyof typeof breakpoints.values
