import { defaultSectionSx } from '@/theme/layout'
import { SxStyles } from '@/theme/utils'

export const containerCss: SxStyles = [
  ...defaultSectionSx,
  {
    '> *': {
      gridColumn: '1 / -1',
    },
  },
]
