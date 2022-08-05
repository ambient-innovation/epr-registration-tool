import { pxToRemAsString, SxStyleObject } from '@/theme/utils'

export const autoMarginSx: SxStyleObject = {
  marginTop: 'auto',
  marginBottom: 'auto',
}

export const videoPlayerWrapper: SxStyleObject = {
  width: '100%',
  height: {
    xs: pxToRemAsString(200),
    sm: pxToRemAsString(350),
    md: pxToRemAsString(300),
  },
}
