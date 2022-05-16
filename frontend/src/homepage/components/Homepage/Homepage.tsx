import { Box, Typography } from '@mui/material'

import { useExampleQuery } from '@/api/__types__'

import { containerCss } from './Homepage.styles'

export type Homepage = Record<string, never>

export const Homepage = (_: Homepage): React.ReactElement => {
  const { data, loading } = useExampleQuery()

  return (
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
        <Typography variant="h2">
          {loading ? 'loading...' : data?.helloWorld}
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
}
