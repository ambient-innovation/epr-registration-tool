import { Box, Button, Typography } from '@mui/material'
import React, { memo } from 'react'
import { FormEventHandler } from 'react'

import { backgroundSx, buttonWrapperSx } from './FormStep.styles'

export interface FormStep {
  title: string
  description?: string
  onClickBack?: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
  children: React.ReactNode
  isFinalStep?: boolean
  isLoading?: boolean
}

export const FormStep = memo(
  ({
    onClickBack,
    onSubmit,
    children,
    isFinalStep,
    title,
    description,
    isLoading,
  }: FormStep) => {
    return (
      <section>
        <form onSubmit={onSubmit} noValidate>
          <Box component={'header'} sx={backgroundSx}>
            <Typography variant={'h6'}>{title}</Typography>
            {description && (
              <Typography variant={'body1'} mt={{ xs: 5, sm: 6 }}>
                {description}
              </Typography>
            )}
            <Box marginTop={{ xs: 9, md: 10 }}>{children}</Box>
          </Box>
          <Box component={'footer'} sx={buttonWrapperSx}>
            <Button
              variant={'text'}
              onClick={onClickBack}
              disabled={!onClickBack || isLoading}
            >
              {'Prev'}
            </Button>
            <Button variant={'contained'} type={'submit'} disabled={isLoading}>
              {isLoading ? 'Loading ...' : isFinalStep ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </form>
      </section>
    )
  }
)
