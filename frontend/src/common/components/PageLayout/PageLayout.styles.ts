import { maxWidthCss, paddedSectionCss } from '@/theme/layout'
import { SxStyles } from '@/theme/utils'

export const wrapperSx: SxStyles = [
  maxWidthCss,
  paddedSectionCss,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
]

export const mainSx: SxStyles = {
  paddingBottom: 12,
}
