import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Typography } from '@mui/material'
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
import { FormSubmitFooter } from '@/common/components/FormSubmitFooter'
import { PasswordInput } from '@/common/components/PasswordInput'
import { ROUTES } from '@/routes'

import { passwordValidator } from '../../../utils/form-validation.utils'
import { ResetPasswordData } from './types'

export const RESET_PW_COMPLETE_ALERT_KEY = 'resetPasswordComplete'

export type ErrorData = { error?: string }
export type ResetPasswordError = AxiosError<ErrorData>
type FormData = Pick<ResetPasswordData, 'password'>

const schema: SchemaOf<Record<keyof FormData, unknown>> = yup.object().shape({
  password: passwordValidator(),
})

export type ResetPasswordSection = Record<string, never>

const resolver = yupResolver(schema)
export const ResetPasswordSection = (): React.ReactElement => {
  const { t } = useTranslation()
  const router = useRouter()
  const { resetPassword } = useUser()
  const [serverErrorMessage, setServerErrorMessage] = useState<string>('')

  const { register, handleSubmit, formState } = useForm<FormData>({
    mode: 'onTouched',
    resolver,
    defaultValues: {
      password: '',
    },
  })

  const { errors } = formState

  const errorMsg = (translationKey: string | undefined): string | undefined =>
    translationKey && (t(translationKey) as string)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = ({ password }: FormData) => {
    const { ident, token } = router.query
    return resetPassword(ident as string, token as string, password)
      .then(() => {
        router.push({
          pathname: ROUTES.login,
          query: {
            alert: RESET_PW_COMPLETE_ALERT_KEY,
          },
        })
      })
      .catch((error: ResetPasswordError) => {
        handleAxiosError(error)
        const errorMessage = getAxiosErrorMessage<ErrorData>(
          error,
          (data) => `resetPassword.serverErrors.${data.error}`,
          t
        )

        setServerErrorMessage(errorMessage)
      })
  }

  return (
    <FormLayout>
      <Typography
        component={'h1'}
        variant={'h1'}
        mb={{ xs: 8, sm: 10, md: 11 }}
      >
        {t('resetPassword.title')}
      </Typography>
      <section>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={backgroundSx}>
            <header>
              <Typography variant={'h3'}>
                {t('resetPassword.newPasswordTitle')}
              </Typography>
              <Typography variant={'body1'} mt={{ xs: 5, sm: 6 }}>
                {t('resetPassword.newPasswordDescription')}
              </Typography>
            </header>
            <Box marginTop={{ xs: 9, md: 10 }}>
              <PasswordInput
                error={!!errors?.password}
                helperText={errorMsg(errors?.password?.message)}
                required
                fullWidth
                {...register('password')}
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
          <FormSubmitFooter
            isSubmitting={formState.isSubmitting}
            buttonLabelKey={'resetPassword.saveNewPassword'}
          />
        </form>
      </section>
    </FormLayout>
  )
}
