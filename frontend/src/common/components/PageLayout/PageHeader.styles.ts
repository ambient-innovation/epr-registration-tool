import { maxWidthCss, paddedSectionCss } from '@/theme/layout'
import { pxToRemAsString } from '@/theme/utils'
import { SxStyles } from '@/theme/utils'

import { SxStyleObject } from '../../../theme/utils'

export const headerSx: SxStyleObject = {
  backgroundColor: 'primary.main',
  minHeight: pxToRemAsString(88),
  display: 'flex',
  position: 'relative',
  zIndex: 'appBar',
  alignItems: 'center',
}

export const headerContainerSx: SxStyles = [
  maxWidthCss,
  paddedSectionCss,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
]

export const listItemButtonSx: SxStyleObject = {
  '&.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: 'primary.light',
  },
  '&:hover': {
    textDecoration: 'underline',
  },
}
