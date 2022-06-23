import { fontWeights } from '@/theme/typography'
import { pxToRemAsString, SxStyleObject } from '@/theme/utils'

export const cardContentSx: SxStyleObject = {
  position: 'relative',
  padding: {
    xs: 6,
    sm: 8,
  },
}

export const statusChipSx: SxStyleObject = {
  color: 'common.white',
  fontSize: pxToRemAsString(12),
  fontWeight: fontWeights.bold,
  lineHeight: '166%',
  height: pxToRemAsString(20),
  mt: { xs: 6, sm: 0 },
  ml: { xs: 0, sm: 6 },
}
