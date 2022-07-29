import { pxToRemAsString, SxStyleObject } from '@/theme/utils'

export const downloadListGrid: SxStyleObject = {
  display: 'grid',
  gridColumnGap: pxToRemAsString(24),
  gridRowGap: pxToRemAsString(24),
  gridAutoFlow: 'dense',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    lg: 'repeat(3, 1fr)',
  },
}
