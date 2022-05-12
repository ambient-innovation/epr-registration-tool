import { css } from '@emotion/react'

import { breakpoints } from '@/theme/breakpoints'
import { palette } from '@/theme/colorsPalette'
import { grid, layout } from '@/theme/layout'
import { pxToRem } from '@/theme/utils'

const fullHeightCss = css`
  // to be placed in another flex container
  // --> take remaining space
  flex-grow: 1;
  // allow children to do the same
  // --> define flex container
  display: flex;
`

export const containerCss = css`
  ${fullHeightCss};
  position: relative;
  width: 100%;
`

export const imageGap = {
  lg: `(${grid.lg.columnWidth} + ${grid.lg.gutter}) * 1.8`, // (2 * column + gutter) - (gutter/2)
  xl: `(${grid.xl.columnWidth} + ${grid.xl.gutter}) * 1.5`, // (2 * column + gutter) - (gutter/2)
}

export const imageWrapperCss = css`
  // xs
  top: 0;
  height: 100vh;
  background: ${palette.grey?.['500']};
  max-width: calc(${layout.maxWidth.hero} / 2);
  position: fixed;

  display: none;

  ${breakpoints.up('lg')} {
    display: block;

    width: calc(50% - ${imageGap.lg});
    right: calc(50% + ${imageGap.lg});
  }

  ${breakpoints.up('xl')} {
    width: calc(50% - (${imageGap.xl}));
    right: calc(50% + (${imageGap.xl}));
  }
`

export const contentColumnCss = css`
  grid-column: 1 / -1;
  padding-top: ${pxToRem(40)}rem;
  padding-bottom: ${pxToRem(40)}rem;
  display: flex;
  flex-direction: column;

  ${breakpoints.up('md')} {
    grid-column: 2 / -2;
  }

  ${breakpoints.up('lg')} {
    grid-column: 6 / -2;
  }
`
