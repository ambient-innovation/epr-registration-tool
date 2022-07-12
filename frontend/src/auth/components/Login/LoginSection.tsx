import { yupResolver } from '@hookform/resolvers/yup'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { AxiosError } from 'axios'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { SchemaOf } from 'yup'
import * as yup from 'yup'

import { CHANGE_PW_COMPLETE_ALERT_KEY } from '@/accountSettings/components/AccountSettingsSection/ChangePasswordForm/ChangePasswordForm'
import { RESET_PW_COMPLETE_ALERT_KEY } from '@/auth/components/ResetPassword/ResetPasswordSection'
import { useUser } from '@/auth/hooks/useUser'
import { getAxiosErrorMessage, handleAxiosError } from '@/auth/utils'
import { ErrorAlert } from '@/common/components/ErrorAlert'
import { FormLayout } from '@/common/components/FormLayout'
import { backgroundSx } from '@/common/components/FormStep/FormStep.styles'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import { PasswordInput } from '@/common/components/PasswordInput'
import { ROUTES } from '@/routes'
import {
  emailValidator,
  requiredStringValidator,
} from '@/utils/form-validation.utils'

import { footerSx, signInButton } from './LoginSection.styles'
import { FormData } from './types'

export interface AxiosErrorData {
  nonFieldErrors: string[]
}

const schema: SchemaOf<Record<keyof FormData, unknown>> = yup.object().shape({
  email: emailValidator(),
  password: requiredStringValidator(),
  rememberMe: yup.boolean(),
})

const resolver = yupResolver(schema)

type LoginError = AxiosError<{ nonFieldErrors?: string[] }>

export const LoginSection = (): React.ReactElement => {
  const { t } = useTranslation()
  const router = useRouter()
  const { login } = useUser()
  const [serverError, setServerError] = useState<null | LoginError>(null)

  const { register, handleSubmit, formState } = useForm<FormData>({
    mode: 'onTouched',
    resolver,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const { errors } = formState

  const errorMsg = (translationKey: string | undefined): string | undefined =>
    translationKey && (t(translationKey) as string)

  const onSubmit = ({ email, password, rememberMe }: FormData) => {
    return login(email, password, rememberMe)
      .then(() => router.push(ROUTES.dashboard))
      .catch((error: LoginError) => {
        handleAxiosError(error)
        setServerError(error)
      })
  }

  return (
    <FormLayout>
      {(router.query.alert === RESET_PW_COMPLETE_ALERT_KEY ||
        router.query.alert === RESET_PW_COMPLETE_ALERT_KEY ||
        router.query.alert === CHANGE_PW_COMPLETE_ALERT_KEY) && (
        <Box mb={11}>
          <Alert
            sx={{ alignItems: 'center' }}
            variant={'filled'}
            severity={'success'}
          >
            <Typography variant={'body2'}>
              {t(`loginForm.${router.query.alert}`)}
            </Typography>
          </Alert>
        </Box>
      )}
      <Typography
        component={'h1'}
        variant={'h4'}
        mb={{ xs: 8, sm: 10, md: 11 }}
      >
        {t('login')}
      </Typography>
      <section>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={backgroundSx}>
            <header>
              <Typography variant={'h6'}>{t('loginForm.title')}</Typography>
              <Typography variant={'body1'} mt={{ xs: 5, sm: 6 }}>
                {t('loginForm.description')}
              </Typography>
            </header>
            <Box marginTop={{ xs: 9, md: 10 }}>
              <Stack spacing={DEFAULT_FORM_SPACING}>
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
                <PasswordInput
                  error={!!errors?.password}
                  helperText={errorMsg(errors?.password?.message)}
                  required
                  fullWidth
                  {...register('password')}
                />
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <FormControlLabel
                    control={<Checkbox />}
                    label={t('loginForm.rememberMe')}
                    {...register('rememberMe')}
                  />
                  <NextLink href={ROUTES.forgetPassword} passHref>
                    <Link>{t('loginForm.resetPassword')}</Link>
                  </NextLink>
                </Stack>
              </Stack>
            </Box>
          </Box>
          {serverError && (
            <Box mt={5}>
              <ErrorAlert title={t('loginForm.loginFailed')}>
                {getAxiosErrorMessage(
                  serverError,
                  (data) =>
                    data.nonFieldErrors &&
                    `serverErrors.${data.nonFieldErrors[0]}`,
                  t
                )}
              </ErrorAlert>
            </Box>
          )}
          <Box component={'footer'} sx={footerSx}>
            <NextLink href={ROUTES.registration} passHref>
              <Link>{t('loginForm.registerLink')}</Link>
            </NextLink>
            <Button
              variant={'contained'}
              type={'submit'}
              disabled={formState.isSubmitting}
              sx={signInButton}
            >
              {formState.isSubmitting ? t('loading') : t('loginForm.signIn')}
            </Button>
          </Box>
        </form>
      </section>
    </FormLayout>
  )
}
