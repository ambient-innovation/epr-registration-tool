import { Theme as MaterialUITheme } from '@mui/material'
import { createTheme } from '@mui/material/styles'

import { pxToRemAsString } from '@/theme/utils'

import { BorderRadius, borderRadius } from './borderRadius'
import { breakpoints } from './breakpoints'
import { palette } from './colorsPalette'
import { components } from './components'
import { shadows } from './shadows'
import { spacing } from './spacing'
import { typography } from './typography'

// https://mui.com/material-ui/customization/palette/#adding-new-colors
declare module '@mui/material/styles/createMixins' {
  interface Mixins {
    toolbar: CSSProperties
    hero: CSSProperties
    layout: CSSProperties
  }
  interface MixinsOptions extends Partial<Mixins> {
    toolbar: CSSProperties
    hero: CSSProperties
    layout: CSSProperties
  }
}

// Create a theme instance.
export const theme = createTheme({
  palette,
  shadows,
  breakpoints,
  typography,
  spacing,
  shape: {
    borderRadius,
  },
  mixins: {
    toolbar: { borderRadius: 2 },
    hero: { maxWidth: pxToRemAsString(1600) },
    layout: { maxWidth: pxToRemAsString(1024) },
  },
  components,
})

// https://mui.com/material-ui/customization/palette/#adding-new-colors
declare module '@mui/material' {
  interface Theme {
    shape: {
      borderRadius: BorderRadius
    }
  }
  interface ThemeOptions {
    shape: {
      borderRadius: BorderRadius
    }
  }
}

/**
 * note: ALWAYS use the theme like this if you need to import it
 * import { Theme } from '@mui/material'
 * **/

// Re-declare the emotion theme to have the properties of the MaterialUiTheme
// --> make css={(theme) => ...} work with mui theme
// https://github.com/emotion-js/emotion/discussions/2291#discussioncomment-491185x
declare module '@emotion/react' {
  export interface Theme extends MaterialUITheme {}
}
