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

import { passwordValidator } from '../../../utils/form-validation.utils'
import { ResetPasswordData } from './types'

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
            alert: 'resetPasswordComplete',
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
                {t('resetPassword.newPasswordTitle')}
              </Typography>
              <Typography variant={'body1'} mt={{ xs: 5, sm: 6 }}>
                {t('resetPassword.newPasswordDescription')}
              </Typography>
            </header>
            <Box marginTop={{ xs: 9, md: 10 }}>
              <TextField
                label={t('password')}
                error={!!errors?.password}
                helperText={errorMsg(errors?.password?.message)}
                type={'password'}
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
                : t('resetPassword.saveNewPassword')}
            </Button>
          </Box>
        </form>
      </section>
    </FormLayout>
  )
}
