import { defaultSectionSx } from '@/theme/layout'
import { pxToRemAsString, SxStyleObject, SxStyles } from '@/theme/utils'

export const footerSx: SxStyleObject = {
  backgroundColor: 'primary.dark',
  minHeight: pxToRemAsString(88),
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  color: 'common.white',
}

export const footerContainerSx: SxStyles = [
  ...defaultSectionSx,
  {
    py: { xs: 12, md: 13 },
    textAlign: { xs: 'center', sm: 'left' },
  },
]

export const contactColSx: SxStyleObject = {
  gridColumn: { xs: '1 / -1', sm: '5 / 8' },
  mt: { xs: 12, sm: 0 },
  mb: { xs: 6, sm: 0 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: { xs: 'center', sm: 'flex-start' },
}

export const linksColSx: SxStyleObject = {
  gridColumn: { xs: '1 / -1', sm: '9 / -1' },
  display: 'flex',
  flexDirection: 'column',
  alignItems: { xs: 'center', sm: 'flex-start' },
}

export const listItemIconSx: SxStyleObject = { minWidth: pxToRemAsString(25) }

export const listItemSx: SxStyleObject = { color: 'common.white' }

export const logoColSx: SxStyleObject = {
  gridColumn: { xs: '1 / -1', sm: '1 / 4' },
}

export const logoSx: SxStyleObject = {
  fontSize: pxToRemAsString(48),
  textTransform: 'uppercase',
}
