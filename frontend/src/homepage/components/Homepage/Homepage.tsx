import { Box, Typography } from '@mui/material'

import { containerCss } from '@/homepage/components/Homepage/Homepage.styles'

export const Homepage = () => (
  <div css={containerCss}>
    <Box
      sx={{
        my: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        boxShadow: 3,
        borderRadius: 3,
      }}
    >
      <Typography variant="h1" sx={{ color: 'primary.main' }} gutterBottom>
        EPR Registration Tool
      </Typography>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ color: 'secondary.main' }}
      >
        Home page (in progress ...)
      </Typography>
    </Box>
  </div>
)
