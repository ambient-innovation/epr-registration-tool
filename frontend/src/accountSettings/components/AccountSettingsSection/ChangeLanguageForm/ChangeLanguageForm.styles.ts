import { fontWeights } from '@/theme/typography'
import { pxToRemAsString, SxStyleObject, SxStyles } from '@/theme/utils'

export const paddingSx: SxStyleObject = {
  padding: {
    xs: 6,
    sm: 7,
    md: 8,
  },
}

export const footerSx: SxStyleObject = { mr: { xs: 6, sm: 7, md: 0 } }

export const backgroundSx: SxStyles = [
  paddingSx,
  { backgroundColor: 'background.light', borderRadius: 3 },
]

export const submitButton = {
  fontWeight: fontWeights.bold,
  textTransform: 'uppercase',
  minWidth: pxToRemAsString(42),
  '&.Mui-focusVisible': {
    outline: '0.125rem solid #4299E1',
  },
  ml: 'auto',
}
