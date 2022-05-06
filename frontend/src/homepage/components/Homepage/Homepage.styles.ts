import { css } from '@emotion/react'

import { defaultSectionCss } from '@/theme/layout'

export const containerCss = css`
  ${defaultSectionCss};

  > * {
    grid-column: 1 / -1;
  }
`
