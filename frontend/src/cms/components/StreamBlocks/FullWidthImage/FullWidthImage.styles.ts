import { SxStyleObject } from '@/theme/utils'

export const wrapperSx: SxStyleObject = {
  position: 'relative',
  display: 'flex',
}

export const headingWrapperSx: SxStyleObject = {
  zIndex: '1',
  position: 'absolute',
  left: '0',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
}

export const headingSx: SxStyleObject = {
  backgroundColor: '#ffffffe6',
  padding: 6,
  maxWidth: '80%',
}
