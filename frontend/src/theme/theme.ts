import { createTheme } from '@mui/material/styles'

import { breakpoints } from './breakpoints'
import { palette } from './colorsPalette'
import { shadows } from './shadows'
import { typography } from './typography'

// Create a theme instance.
export const theme = createTheme({
  palette,
  shadows,
  spacing: 2, // spacing={4} => 2 * 4 = 8px
  breakpoints,
  shape: {
    borderRadius: 1.25, // raduis will be multiplue by 1.25 px
  },
  typography,
})
