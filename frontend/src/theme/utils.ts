export const pxToRem = (px: number): string | number => {
  return px / 16
}
export const pxToRemAsString = (px: number): string => {
  return px / 16 + 'rem'
}
