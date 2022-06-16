import {
  Alert,
  AlertTitle,
  Box,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import { AxiosError } from 'axios'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { useUser } from '@/auth/hooks/useUser'
import { getAxiosErrorMessage, handleAxiosError } from '@/auth/utils'
import { ErrorAlert } from '@/common/components/ErrorAlert'
import { FormLayout } from '@/common/components/FormLayout'
import { LoadingState } from '@/common/components/LoadingState'

export type ErrorData = { error?: string }
export type ActivationError = AxiosError<ErrorData>

const SuccessState = (): React.ReactElement => {
  const { t } = useTranslation()

  return (
    <Box>
      <Alert severity={'success'}>
        <AlertTitle>{t('activation.success.title')}</AlertTitle>
        {t('activation.success.message')}
      </Alert>

      <Box
        marginY={10}
        marginX={'auto'}
        display={{ xs: 'none', sm: 'block' }}
        maxWidth={'35rem'}
      >
        <Stepper activeStep={2}>
          <Step>
            <StepLabel>{t('activation.registration')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t('activation.emailConfirmation')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t('activation.activation')}</StepLabel>
          </Step>
        </Stepper>
      </Box>

      <Box mt={5} p={8} bgcolor={'background.light'} borderRadius={3}>
        <Typography component={'h2'} variant={'h6'}>
          {t('activation.nextStepActivation.title')}
        </Typography>
        <Typography mt={6}>
          {t('activation.nextStepActivation.body')}
        </Typography>
      </Box>
    </Box>
  )
}

export const MissingDataState = (): React.ReactElement => {
  const { t } = useTranslation()
  return (
    <ErrorAlert title={t('activation.confirmationFailed')}>
      {t('activation.invalidToken')}
    </ErrorAlert>
  )
}

export const ErrorResponseState = ({ error }: { error: ActivationError }) => {
  const { t } = useTranslation()

  const errorMessage = getAxiosErrorMessage<ErrorData>(
    error,
    (data) => `activation.serverErrors.${data.error}`,
    t
  )

  return (
    <ErrorAlert title={t('activation.confirmationFailed')}>
      {errorMessage}
    </ErrorAlert>
  )
}

export const EmailConfirmation = (): React.ReactElement => {
  const { t } = useTranslation()
  const router = useRouter()
  const { activate } = useUser()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<null | ActivationError>(null)

  const { ident, token } = router.query

  // check token + ident is present + both are not arrays (?ident=...&ident=...)
  const dataIsValid =
    ident && token && typeof ident === 'string' && typeof token === 'string'

  useEffect(() => {
    if (dataIsValid) {
      activate(ident, token)
        .catch((error) => {
          handleAxiosError(error)
          setError(error)
        })
        .finally(() => setIsLoading(false))
    } else if (router.isReady) {
      // --> ident or token is missing
      // check router ready state, because initial rendering
      // will be without query parameters (due to SSR)
      setIsLoading(false)
    }
  }, [dataIsValid, router, activate, ident, token, router.isReady])

  return (
    <FormLayout>
      <Typography component={'h1'} variant={'h4'} mb={{ xs: 5, md: 8, lg: 10 }}>
        {t('activation.emailConfirmation')}
      </Typography>
      {isLoading ? (
        <LoadingState />
      ) : !dataIsValid ? (
        <MissingDataState />
      ) : error ? (
        <ErrorResponseState error={error} />
      ) : (
        <SuccessState />
      )}
    </FormLayout>
  )
}
