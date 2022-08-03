import { fontWeights } from '@/theme/typography'
import { pxToRemAsString, SxStyleObject } from '@/theme/utils'

export const wrapperSx: SxStyleObject = {
  position: 'relative',
  display: 'block',
}

export const headingWrapperSx: SxStyleObject = {
  zIndex: '1',
  position: 'absolute',
  left: '0',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
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
