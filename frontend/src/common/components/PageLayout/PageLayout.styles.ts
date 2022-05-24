import { css } from '@emotion/react'

import { maxWidthCss, paddedSectionCss } from '@/theme/layout'

export const wrapperCss = css`
  ${maxWidthCss};
  ${paddedSectionCss};
  display: flex;
  align-items: center;
  justify-content: space-between;
`
