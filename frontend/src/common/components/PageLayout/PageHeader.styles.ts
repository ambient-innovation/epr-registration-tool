import { pxToRemAsString } from '@/theme/utils'

import { SxStyleObject } from '../../../theme/utils'

export const headerSx: SxStyleObject = {
  backgroundColor: 'primary.main',
  minHeight: pxToRemAsString(88),
  display: 'flex',
  position: 'relative',
  zIndex: 'appBar',
  alignItems: 'center',
}

export const listItemButtonSx: SxStyleObject = {
  '&.Mui-selected, &:hover': {
    backgroundColor: 'primary.light',
  },
}
