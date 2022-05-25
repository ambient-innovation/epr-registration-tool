import { Theme } from '@mui/material'
import { SxProps } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'

export const pxToRem = (px: number): string | number => {
  return px / 16
}
export const pxToRemAsString = (px: number): string => {
  return px / 16 + 'rem'
}

export type SxStyleObject = SystemStyleObject<Theme>
export type SxStyleFunc = (theme: Theme) => SystemStyleObject<Theme>
export type SxStyles = SxProps<Theme>
