import { Box, Typography } from '@mui/material'

import { handleError } from '@/utils/error.utils'

export type Homepage = Record<string, never>

const TestingError = (_: Homepage): React.ReactElement => {
  handleError('An error triggered by `/sentry/testing-error`')
  return (
    <div>
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
        <Typography variant={'h1'} sx={{ color: 'primary.main' }} gutterBottom>
          {'EPR Registration Tool'}
        </Typography>
        <Typography
          variant={'h5'}
          component={'h2'}
          gutterBottom
          sx={{ color: 'secondary.main' }}
        >
          {'Testing Sentry Connection'}
        </Typography>
      </Box>
    </div>
  )
}

export default TestingError
