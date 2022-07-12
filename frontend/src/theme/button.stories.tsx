import { Button as MuiButton, Container, Grid } from '@mui/material'
import React from 'react'

export default {
  title: 'Theme/Button',
  parameters: {
    layout: 'centered',
  },
}
type VariantColors = Array<
  Partial<'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'>
>

const buttonColors: VariantColors = [
  'primary',
  'secondary',
  'error',
  'success',
  'info',
  'warning',
]

const containedColors = [...buttonColors]
const outlinedColors = [...buttonColors]
const textColors = [...buttonColors]
const invertedColors: VariantColors = ['primary', 'secondary', 'error']

export const Button = (): React.ReactElement => {
  return (
    <Container>
      <Grid container columnSpacing={2} justifyContent={'start'} rowSpacing={2}>
        {containedColors.map((color, index) => (
          <Grid item xs={3} key={index}>
            <MuiButton variant={'contained'} color={color}>
              {`contained ${color}`}
            </MuiButton>
          </Grid>
        ))}
      </Grid>
      <Grid
        container
        columnSpacing={2}
        justifyContent={'start'}
        rowSpacing={2}
        mt={10}
      >
        {outlinedColors.map((color, index) => (
          <Grid item xs={3} key={index}>
            <MuiButton variant={'outlined'} color={color}>
              {`outlined ${color}`}
            </MuiButton>
          </Grid>
        ))}
      </Grid>
      <Grid
        container
        columnSpacing={2}
        justifyContent={'start'}
        rowSpacing={2}
        mt={10}
      >
        {textColors.map((color, index) => (
          <Grid item xs={3} key={index}>
            <MuiButton variant={'text'} color={color}>
              {`text ${color}`}
            </MuiButton>
          </Grid>
        ))}
      </Grid>
      <Grid
        container
        columnSpacing={2}
        justifyContent={'start'}
        rowSpacing={2}
        mt={10}
        sx={{ backgroundColor: 'primary.main', padding: 5 }}
      >
        {invertedColors.map((color, index) => (
          <Grid item xs={3} key={index}>
            <MuiButton variant={'inverted'} color={color}>
              {`inverted ${color}`}
            </MuiButton>
          </Grid>
        ))}
      </Grid>
      <Grid
        container
        columnSpacing={2}
        justifyContent={'start'}
        rowSpacing={2}
        mt={10}
      >
        <Grid item xs={4}>
          <MuiButton variant={'outlined'} color={'primary'} size={'large'}>
            {'size large'}
          </MuiButton>
        </Grid>
        <Grid item xs={4}>
          <MuiButton variant={'outlined'} color={'primary'} size={'medium'}>
            {'size medium'}
          </MuiButton>
        </Grid>
        <Grid item xs={4}>
          <MuiButton variant={'outlined'} color={'primary'} size={'small'}>
            {'size small'}
          </MuiButton>
        </Grid>
      </Grid>
    </Container>
  )
}
