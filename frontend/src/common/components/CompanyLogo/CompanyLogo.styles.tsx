import { pxToRemAsString, SxStyleObject } from '@/theme/utils'

export const logoWrapperSx: SxStyleObject = {
  bgcolor: 'background.light',
  height: { xs: pxToRemAsString(140), sm: pxToRemAsString(172) },
  width: { xs: pxToRemAsString(140), sm: pxToRemAsString(172) },
  position: 'relative',
  borderRadius: pxToRemAsString(6),
  '.editLogo-button': {
    opacity: 0,
    pointerEvents: 'none',
  },
  img: {
    borderRadius: 3,
    '&:hover': {
      opacity: 0.5,
    },
  },
  '&:hover': {
    '.editLogo-button': {
      opacity: 1,
    },
  },
  button: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    width: 'fit-content',
  },
}
