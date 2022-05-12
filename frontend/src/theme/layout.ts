import { css } from '@emotion/react'
import { Breakpoint } from '@mui/system/createTheme/createBreakpoints'

import { breakpoints } from './breakpoints'
import { pxToRem, pxToRemAsString } from './utils'

export const layout = {
  maxWidth: {
    md: pxToRemAsString(1024),
    hero: pxToRemAsString(1600),
  },
  paddingX: {
    xs: pxToRemAsString(24),
    sm: pxToRemAsString(24),
    md: pxToRemAsString(32),
    lg: pxToRemAsString(18),
    xl: '0',
  },
}

export const maxWidthCss = css`
  width: 100%;
  margin-left: auto;
  margin-right: auto;

  ${breakpoints.up('md')} {
    max-width: ${layout.maxWidth.md};
  }
`

export const paddedSectionCss = css`
  // xs
  box-sizing: border-box;
  width: 100%;
  padding-left: ${layout.paddingX.xs};
  padding-right: ${layout.paddingX.xs};

  ${breakpoints.up('sm')} {
    padding-left: ${layout.paddingX.sm};
    padding-right: ${layout.paddingX.sm};
  }
  ${breakpoints.up('md')} {
    padding-left: ${layout.paddingX.md};
    padding-right: ${layout.paddingX.md};
  }

  ${breakpoints.up('lg')} {
    padding-left: ${layout.paddingX.lg};
    padding-right: ${layout.paddingX.lg};
  }

  ${breakpoints.up('xl')} {
    padding-left: ${layout.paddingX.xl};
    padding-right: ${layout.paddingX.xl};
  }
`
interface ColumnConfig {
  columns: number
  columnWidth: string
  gutter: string
}

export const grid: Record<Breakpoint, ColumnConfig> = {
  xs: {
    columns: 10,
    columnWidth: pxToRemAsString(12),
    gutter: pxToRemAsString(24),
  },
  sm: {
    columns: 12,
    columnWidth: pxToRemAsString(24),
    gutter: pxToRemAsString(24),
  },
  md: {
    columns: 12,
    columnWidth: pxToRemAsString(49),
    gutter: pxToRemAsString(24),
  },
  lg: {
    columns: 12,
    columnWidth: pxToRemAsString(74),
    gutter: pxToRemAsString(24),
  },
  xl: {
    columns: 12,
    columnWidth: pxToRemAsString(102),
    gutter: pxToRemAsString(24),
  },
}

export const defaultGridCss = css`
  // xs
  display: grid;
  grid-column-gap: ${pxToRem(24)}rem;
  grid-template-columns: repeat(${grid.xs.columns}, 1fr);

  ${breakpoints.up('sm')} {
    grid-template-columns: repeat(${grid.sm.columns}, 1fr);
  }
  ${breakpoints.up('md')} {
    grid-template-columns: repeat(${grid.md.columns}, 1fr);
  }
  ${breakpoints.up('lg')} {
    grid-template-columns: repeat(${grid.lg.columns}, 1fr);
  }
  ${breakpoints.up('xl')} {
    grid-template-columns: repeat(${grid.xl.columns}, 1fr);
  }
`

export const defaultSectionCss = css`
  ${maxWidthCss};
  ${paddedSectionCss};
  ${defaultGridCss};
`
