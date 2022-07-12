import { defaultGridSx, layout, maxWidthCss } from '@/theme/layout'
import { SxStyleObject, SxStyles } from '@/theme/utils'

export const containerCss: SxStyles = [
  maxWidthCss,
  defaultGridSx,
  {
    paddingX: {
      ...layout.paddingX,
      xs: 0,
    },
  },
]

const contentColumnBaseSx: SxStyleObject = {
  paddingTop: 11,
  paddingBottom: 11,
  display: 'flex',
  flexDirection: 'column',
}

export const formColumnSx: SxStyles = [
  contentColumnBaseSx,
  {
    paddingTop: { xs: 0, md: 11 },
    gridColumn: { xs: '1 / -1', md: '4/-3' },
  },
]

export const tabsColumnSx: SxStyles = [
  contentColumnBaseSx,
  {
    gridColumn: { xs: '1 / -1', md: '1/-11' },
  },
]
