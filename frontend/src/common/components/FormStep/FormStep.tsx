import { ApolloError } from '@apollo/client'
import { Box, Button, Typography, BoxProps } from '@mui/material'
import { useTranslation } from 'next-i18next'
import React, { memo } from 'react'
import { FormEventHandler } from 'react'

import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'

import { backgroundSx, buttonWrapperSx } from './FormStep.styles'

export interface FormStep {
  onClickBack?: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
  children: React.ReactNode
  isFinalStep?: boolean
  isLoading?: boolean
  apolloError?: ApolloError
  errorTitle?: string
  readOnly?: boolean
}

export interface FormStepContainer extends BoxProps {
  title: string
  description?: string
  children: React.ReactNode
}
export const FormStepContainer = ({
  title,
  description,
  children,
  ...boxProps
}: FormStepContainer) => (
  <Box component={'header'} sx={backgroundSx} {...boxProps}>
    <Typography variant={'h3'}>{title}</Typography>
    {description && (
      <Typography variant={'body1'} mt={{ xs: 5, sm: 6 }}>
        {description}
      </Typography>
    )}
    <Box marginTop={{ xs: 9, md: 10 }}>{children}</Box>
  </Box>
)

export const FormStep = memo(
  ({
    onClickBack,
    onSubmit,
    children,
    isFinalStep,
    isLoading,
    apolloError,
    errorTitle,
    readOnly = false,
  }: FormStep) => {
    const { t } = useTranslation()
    return (
      <section>
        <form onSubmit={onSubmit} noValidate>
          {children}
          {apolloError && (
            <Box mt={4}>
              <ApolloErrorAlert error={apolloError} title={errorTitle} />
            </Box>
          )}
          <Box component={'footer'} sx={buttonWrapperSx}>
            {!!onClickBack && (
              <Button
                variant={'text'}
                onClick={onClickBack}
                disabled={!onClickBack || isLoading}
              >
                {t('prev')}
              </Button>
            )}
            {!readOnly && (
              <Button
                variant={'contained'}
                type={'submit'}
                disabled={isLoading || readOnly}
              >
                {isLoading
                  ? t('loading')
                  : isFinalStep
                  ? t('submit')
                  : t('next')}
              </Button>
            )}
          </Box>
        </form>
      </section>
    )
  }
)
