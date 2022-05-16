import { Grid, Typography } from '@mui/material'

import { fontWeights } from './typography'

export default {
  title: 'Theme/Typography',
  parameters: {
    layout: 'centered',
  },
}

export const Variants = (): React.ReactElement => {
  return (
    <Grid container sx={{ textAlign: 'center' }} spacing={2}>
      <Grid item xs={12}>
        <Typography variant={'h1'}>H1 Heading</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'h2'}>H2 Heading</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'h3'}>H3 Heading</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'h4'}>H4 Heading</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'h5'}>H5 Heading</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'h6'}>H6 Heading</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'body1'}>body1</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'body2'}>body2</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'subtitle1'}>subtitle1</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'subtitle2'}>subtitle2</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'overline'}>overline</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'caption'}>caption</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>No Style</Typography>
      </Grid>
    </Grid>
  )
}

export const Weights = (): React.ReactElement => {
  return (
    <Grid container textAlign={'center'} spacing={2} fontSize={'3rem'}>
      <Grid item>
        <Typography fontWeight={fontWeights.light}>Light</Typography>
      </Grid>
      <Grid item>
        <Typography fontWeight={fontWeights.regular}>Regular</Typography>
      </Grid>
      <Grid item>
        <Typography fontWeight={fontWeights.medium}>Medium</Typography>
      </Grid>
      <Grid item>
        <Typography fontWeight={fontWeights.bold}>Bold</Typography>
      </Grid>
    </Grid>
  )
}
