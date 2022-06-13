import { grid } from '@/theme/layout'
import { SxStyleFunc, SxStyleObject, SxStyles } from '@/theme/utils'

const fullHeightCss: SxStyleObject = {
  // to be placed in another flex container
  // --> take remaining space
  flexGrow: 1,
  // allow children to do the same
  // --> define flex container
  display: 'flex',
}

export const containerCss: SxStyles = [
  fullHeightCss,
  {
    position: 'relative',
    width: '100%',
  },
]

export const imageGap = {
  md: `(${grid.md.columnWidth} + ${grid.md.gutter}) * 2.1`, // (2 * column + gutter) - (gutter/2)
  lg: `(${grid.lg.columnWidth} + ${grid.lg.gutter}) * 1.8`, // (2 * column + gutter) - (gutter/2)
  xl: `(${grid.xl.columnWidth} + ${grid.xl.gutter}) * 1.5`, // (2 * column + gutter) - (gutter/2)
}

export const imageWrapperSx: SxStyleFunc = (theme) => ({
  // xs
  top: 0,
  height: '100vh',
  backgroundColor: theme.palette.background.light,
  maxWidth: `calc(${theme.mixins.hero.maxWidth} / 2)`,
  position: 'fixed',

  display: 'none',

  [theme.breakpoints.up('md')]: {
    display: 'block',
    width: `calc(50% - ${imageGap.md})`,
    right: `calc(50% + ${imageGap.md})`,
  },

  [theme.breakpoints.up('lg')]: {
    width: `calc(50% - ${imageGap.lg})`,
    right: `calc(50% + ${imageGap.lg})`,
  },

  [theme.breakpoints.up('xl')]: {
    width: `calc(50% - ${imageGap.xl})`,
    right: `calc(50% + ${imageGap.xl})`,
  },
})

const contentColumnBaseSx: SxStyleObject = {
  paddingTop: 11,
  paddingBottom: 11,
  display: 'flex',
  flexDirection: 'column',
}

export const contentColumnWithHeroSx: SxStyles = [
  contentColumnBaseSx,
  {
    gridColumn: { xs: '1 / -1', md: '6/-1', lg: '6/-2' },
  },
]

export const contentColumnSx: SxStyles = [
  contentColumnBaseSx,
  {
    gridColumn: { xs: '1 / -1' },
  },
]
