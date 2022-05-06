import { createTheme } from '@mui/material/styles'

import { breakpoints } from '@/theme/breakpoints'
import { palette } from '@/theme/colorsPalette'
import { shadows } from '@/theme/shadows'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

// Create a theme instance.
export const theme = createTheme({
  palette,
  shadows,
  spacing,
  breakpoints,
  shape: {
    borderRadius: 1.25, // raduis will be multiplue by 1.25 px
  },
  typography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          // https://www.sitepoint.com/understanding-and-using-rem-units-in-css/
          fontSize: '62.5%' /* 62.5% of 16px = 10px = 1rem */,
        },
      },
    },
  },
})
