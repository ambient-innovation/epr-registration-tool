import { css } from '@emotion/react'

import { BreakpointKeyType, breakpoints } from '@/theme/breakpoints'

export const layout = {
  maxWidth: {
    desktop: '128rem',
  },
  paddingX: {
    mobile: '2.4rem',
    tablet: '3.2rem',
    laptop: '1.8rem',
    desktop: '0',
  },
}
export const maxWidthCss = css`
  width: 100%;
  margin-left: auto;
  margin-right: auto;

  ${breakpoints.up('laptop')} {
    max-width: ${layout.maxWidth.desktop};
  }
`

export const paddedSectionCss = css`
  box-sizing: border-box;
  width: 100%;
  padding-left: ${layout.paddingX.mobile};
  padding-right: ${layout.paddingX.mobile};

  ${breakpoints.up('tablet')} {
    padding-left: ${layout.paddingX.tablet};
    padding-right: ${layout.paddingX.tablet};
  }

  ${breakpoints.up('laptop')} {
    padding-left: ${layout.paddingX.laptop};
    padding-right: ${layout.paddingX.laptop};
  }

  ${breakpoints.up('desktop')} {
    padding-left: ${layout.paddingX.desktop};
    padding-right: ${layout.paddingX.desktop};
  }
`
interface ColumnConfig {
  columns: number
  columnWidth: string
  gutter: string
}

export const grid: Record<BreakpointKeyType, ColumnConfig> = {
  mobile: {
    columns: 6,
    columnWidth: '4.8rem',
    gutter: '0.8rem',
  },
  tablet: {
    columns: 9,
    columnWidth: '6.4rem',
    gutter: '1.6rem',
  },
  laptop: {
    columns: 12,
    columnWidth: '6.4rem',
    gutter: '2rem',
  },
  desktop: {
    columns: 12,
    columnWidth: '8rem',
    gutter: '2rem',
  },
}

export const defaultGridGapCss = css`
  grid-column-gap: ${grid.mobile.gutter};

  ${breakpoints.up('tablet')} {
    grid-column-gap: ${grid.tablet.gutter};
  }
  ${breakpoints.up('laptop')} {
    grid-column-gap: ${grid.laptop.gutter};
  }
  ${breakpoints.up('desktop')} {
    grid-column-gap: ${grid.desktop.gutter};
  }
`
export const defaultGridCss = css`
  ${defaultGridGapCss};
  display: grid;
  grid-template-columns: repeat(${grid.mobile.columns}, 1fr);

  ${breakpoints.up('tablet')} {
    grid-template-columns: repeat(${grid.tablet.columns}, 1fr);
  }
  ${breakpoints.up('laptop')} {
    grid-template-columns: repeat(${grid.laptop.columns}, 1fr);
  }
  ${breakpoints.up('desktop')} {
    grid-template-columns: repeat(${grid.desktop.columns}, 1fr);
  }
`

export const defaultSectionCss = css`
  ${maxWidthCss};
  ${paddedSectionCss};
  ${defaultGridCss};
`
