/**
 * Calculate bytes to KB or MB
 * @param  {number} bytes     Amount of bytes.
 * @param  {number} decimals  The number of digits to appear after the decimal point.
 * @return {string}           Calculated value with the respective unit.
 * */

export const bytesToSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i].toString()
  )
}
