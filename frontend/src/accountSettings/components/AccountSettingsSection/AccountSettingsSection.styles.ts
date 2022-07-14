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

export const paddingSx: SxStyleObject = {
  padding: {
    xs: 6,
    sm: 7,
    md: 8,
  },
}

export const formFooterSx: SxStyleObject = { mr: { xs: 6, sm: 7, md: 0 } }

export const formBackgroundSx: SxStyles = [
  paddingSx,
  { backgroundColor: 'background.light', borderRadius: 3 },
]
