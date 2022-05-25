import { css } from '@emotion/react'

// because 'next/image' does not accept sx prop we use here css
export const imageCss = css`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`
