import { Breakpoint } from '@mui/system/createTheme/createBreakpoints'

import { pxToRemAsString, SxStyleFunc, SxStyleObject, SxStyles } from './utils'

export const layout = {
  paddingX: {
    xs: pxToRemAsString(24),
    sm: pxToRemAsString(24),
    md: pxToRemAsString(32),
    lg: pxToRemAsString(18),
    xl: '0',
  },
}

export const maxWidthCss: SxStyleFunc = (theme) => ({
  width: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  maxWidth: { md: theme.mixins.layout.maxWidth },
})

export const basePaddedSectionSx: SxStyleObject = {
  boxSizing: 'border-box',
  width: '100%',
}

export const paddedSectionCss: SxStyleObject = {
  ...basePaddedSectionSx,
  paddingLeft: { ...layout.paddingX },
  paddingRight: { ...layout.paddingX },
}

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

export const defaultGridSx: SxStyleObject = {
  display: 'grid',
  gridColumnGap: pxToRemAsString(24),
  gridTemplateColumns: {
    xs: `repeat(${grid.xs.columns}, 1fr)`,
    sm: `repeat(${grid.sm.columns}, 1fr)`,
    md: `repeat(${grid.md.columns}, 1fr)`,
    lg: `repeat(${grid.lg.columns}, 1fr)`,
    xl: `repeat(${grid.xl.columns}, 1fr)`,
  },
}

export const defaultSectionSx = [maxWidthCss, paddedSectionCss, defaultGridSx]

export const defaultContainerSx: SxStyles = [
  ...defaultSectionSx,
  {
    '> *': {
      gridColumn: '1 / -1',
    },
  },
]
