import { defaultGridSx, layout, maxWidthCss } from '@/theme/layout'
import { pxToRemAsString, SxStyleObject, SxStyles } from '@/theme/utils'

export const containerSx: SxStyles = [
  maxWidthCss,
  defaultGridSx,
  {
    paddingX: {
      ...layout.paddingX,
      xs: 0,
      sm: 0,
    },
  },
]

export const backgroundSx: SxStyleObject = {
  backgroundColor: 'background.light',
  borderRadius: { xs: 0, sm: 3 },
  px: {
    xs: 8,
  },
  py: {
    xs: 10,
    sm: 9,
    md: 8,
  },
}

export const filterFieldSx: SxStyleObject = {
  width: { sm: pxToRemAsString(230) },
}

export const paginationContainerSx: SxStyleObject = {
  display: 'flex',
  justifyContent: 'center',
  mt: { xs: 8, sm: 9, md: 10 },
}
