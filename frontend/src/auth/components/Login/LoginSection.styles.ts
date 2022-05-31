import { fontWeights } from '@/theme/typography'
import { pxToRemAsString, SxStyleObject } from '@/theme/utils'

export const footerSx: SxStyleObject = {
  marginTop: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

export const signInButton = {
  fontWeight: fontWeights.bold,
  textTransform: 'uppercase',
  marginLeft: 5,
  minWidth: pxToRemAsString(42),
  '&.Mui-focusVisible': {
    outline: '0.125rem solid #4299E1',
  },
}
