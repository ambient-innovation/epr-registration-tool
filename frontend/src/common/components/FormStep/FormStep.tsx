import { ApolloError } from '@apollo/client'
import { Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import React, { memo } from 'react'
import { FormEventHandler } from 'react'

import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'

import { backgroundSx, buttonWrapperSx } from './FormStep.styles'

export interface FormStep {
  title: string
  description?: string
  onClickBack?: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
  children: React.ReactNode
  isFinalStep?: boolean
  isLoading?: boolean
  apolloError?: ApolloError
  errorTitle?: string
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
    apolloError,
    errorTitle,
  }: FormStep) => {
    const { t } = useTranslation()
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
          {apolloError && (
            <Box mt={4}>
              <ApolloErrorAlert error={apolloError} title={errorTitle} />
            </Box>
          )}
          <Box component={'footer'} sx={buttonWrapperSx}>
            <Button
              variant={'text'}
              onClick={onClickBack}
              disabled={!onClickBack || isLoading}
            >
              {t('prev')}
            </Button>
            <Button variant={'contained'} type={'submit'} disabled={isLoading}>
              {isLoading
                ? 'Loading ...'
                : isFinalStep
                ? t('submit')
                : t('next')}
            </Button>
          </Box>
        </form>
      </section>
    )
  }
)
