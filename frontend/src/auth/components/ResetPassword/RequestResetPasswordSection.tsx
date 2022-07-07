import { yupResolver } from '@hookform/resolvers/yup'
import { Box, TextField, Typography, Button } from '@mui/material'
import { AxiosError } from 'axios'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { SchemaOf } from 'yup'
import * as yup from 'yup'

import { useUser } from '@/auth/hooks/useUser'
import { getAxiosErrorMessage, handleAxiosError } from '@/auth/utils'
import { ErrorAlert } from '@/common/components/ErrorAlert'
import { FormLayout } from '@/common/components/FormLayout'
import { backgroundSx } from '@/common/components/FormStep/FormStep.styles'
import { ROUTES } from '@/routes'
import { emailValidator } from '@/utils/form-validation.utils'

import { ResetPasswordData } from './types'

export const RESET_PW_COMPLETE_ALERT_KEY = 'resetPasswordRequest'

type FormData = Pick<ResetPasswordData, 'email'>

const schema: SchemaOf<Record<keyof FormData, unknown>> = yup.object().shape({
  email: emailValidator(),
})

export type RequestResetPasswordSection = Record<string, never>

const resolver = yupResolver(schema)

export const RequestResetPasswordSection = (): React.ReactElement => {
  const { t } = useTranslation()
  const router = useRouter()
  const { requestPasswordReset } = useUser()
  const [serverErrorMessage, setServerErrorMessage] = useState<string>('')

  const { register, handleSubmit, formState } = useForm<FormData>({
    mode: 'onTouched',
    resolver,
    defaultValues: {
      email: '',
    },
  })

  const { errors } = formState

  const errorMsg = (translationKey: string | undefined): string | undefined =>
    translationKey && (t(translationKey) as string)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = ({ email }: FormData) => {
    return requestPasswordReset(email)
      .then(() => {
        router.push({
          pathname: ROUTES.login,
          query: {
            alert: RESET_PW_COMPLETE_ALERT_KEY,
          },
        })
      })
      .catch((error: AxiosError) => {
        handleAxiosError(error)
        const errorMessage = getAxiosErrorMessage(error, () => undefined, t)

        setServerErrorMessage(errorMessage)
      })
  }

  return (
    <FormLayout>
      <Typography
        component={'h1'}
        variant={'h4'}
        mb={{ xs: 8, sm: 10, md: 11 }}
      >
        {t('resetPassword.title')}
      </Typography>
      <section>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={backgroundSx}>
            <header>
              <Typography variant={'h6'}>
                {t('resetPassword.forgetPasswordTitle')}
              </Typography>
              <Typography variant={'body1'} mt={{ xs: 5, sm: 6 }}>
                {t('resetPassword.forgetPasswordDescription1')}
              </Typography>
              <Typography variant={'body1'} mt={{ xs: 5, sm: 6 }}>
                {t('resetPassword.forgetPasswordDescription2')}
              </Typography>
            </header>
            <Box marginTop={{ xs: 9, md: 10 }}>
              <TextField
                autoFocus // autofocus first field
                label={t('email')}
                error={!!errors?.email}
                helperText={errorMsg(errors?.email?.message)}
                fullWidth
                required
                {...register('email')}
                dir={'ltr'} // email always written from left
              />
            </Box>
          </Box>
          {serverErrorMessage && (
            <Box mt={5}>
              <ErrorAlert title={t('resetPassword.resetPasswordFailed')}>
                {serverErrorMessage}
              </ErrorAlert>
            </Box>
          )}
          <Box
            component={'footer'}
            sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button
              variant={'contained'}
              type={'submit'}
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting
                ? t('loading')
                : t('resetPassword.sendResetInstructions')}
            </Button>
          </Box>
        </form>
      </section>
    </FormLayout>
  )
}
