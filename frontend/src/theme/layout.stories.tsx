import { Box, Typography } from '@mui/material'

import { defaultSectionSx } from './layout'

export default {
  title: 'Theme/Grid',
}

export const Default = (): React.ReactElement => {
  return (
    <>
      <Box sx={defaultSectionSx} bgcolor={'gray.50'}>
        <Typography gridColumn={'1/-1'} gutterBottom>
          {'Change the size of the preview above to see the grid in different'}
          {'sizes'}
        </Typography>
        <Box sx={{ height: '50vh', backgroundColor: 'primary.light' }} />
        <Box sx={{ height: '50vh', backgroundColor: 'primary.light' }} />
        <Box sx={{ height: '50vh', backgroundColor: 'primary.light' }} />
        <Box sx={{ height: '50vh', backgroundColor: 'primary.light' }} />
        <Box sx={{ height: '50vh', backgroundColor: 'primary.light' }} />
        <Box sx={{ height: '50vh', backgroundColor: 'primary.light' }} />
        <Box sx={{ height: '50vh', backgroundColor: 'primary.light' }} />
        <Box sx={{ height: '50vh', backgroundColor: 'primary.light' }} />
        <Box sx={{ height: '50vh', backgroundColor: 'primary.light' }} />
        <Box sx={{ height: '50vh', backgroundColor: 'primary.light' }} />
        <Box sx={{ height: '50vh', backgroundColor: 'primary.light' }} />
        <Box sx={{ height: '50vh', backgroundColor: 'primary.light' }} />
      </Box>
    </>
  )
}
