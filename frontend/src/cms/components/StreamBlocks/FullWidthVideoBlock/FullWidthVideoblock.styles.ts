import { fontWeights } from '@/theme/typography'
import { pxToRemAsString, SxStyleObject } from '@/theme/utils'

export const wrapperSx: SxStyleObject = {
  position: 'relative',
  display: 'block',
}

export const headingWrapperSx: SxStyleObject = {
  zIndex: '1',
  position: 'absolute',
  left: pxToRemAsString(14),
  top: '20%',
  transform: 'translateY(-50%)',
  width: '100%',
  display: 'flex',
}

export const headingSx: SxStyleObject = {
  backgroundColor: '#ffffffe6',
  padding: 6,
  maxWidth: '80%',
  fontSize: {
    xs: pxToRemAsString(14),
    sm: pxToRemAsString(24),
    lg: pxToRemAsString(34),
  },
  fontWeight: fontWeights.regular,
  lineHeight: '123%',
  letterSpacing: 0.25,
}

export const videoPlayerWrapper: SxStyleObject = {
  height: {
    xs: pxToRemAsString(275),
    sm: pxToRemAsString(350),
    md: pxToRemAsString(450),
    lg: pxToRemAsString(550),
  },
  width: '100%',
}
