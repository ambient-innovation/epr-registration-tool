import { Box, Container, Grid, Typography } from '@mui/material'
import React from 'react'

import { palette } from './colorsPalette'

export default {
  title: 'Theme/Colors',
  parameters: {
    layout: 'centered',
  },
}

export const Palette = (): React.ReactElement => {
  return (
    <Container>
      <Grid container rowSpacing={2} columnSpacing={2}>
        {Object.entries(palette).map(([name, variants]) => (
          <>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant={'h3'} component={'h1'}>
                {name}
              </Typography>
            </Grid>
            {Object.entries(variants).map(([name, color]) => (
              <Grid item xs={12} md={4} key={name}>
                <Box
                  alignItems={'center'}
                  sx={{
                    width: '100%',
                    height: '5vh',
                    borderRadius: '0.4rem',
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: color as string,
                    padding: 2,
                  }}
                >
                  <Typography
                    variant={'h4'}
                    component={'h2'}
                    sx={{ color: '#fff' }}
                  >
                    {name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </>
        ))}
      </Grid>
    </Container>
  )
}
