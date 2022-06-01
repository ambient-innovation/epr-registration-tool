import { yupResolver } from '@hookform/resolvers/yup'
import {
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

import { useUser } from '@/auth/hooks/useUser'
import { ErrorAlert } from '@/common/components/ErrorAlert'
import { FormLayout } from '@/common/components/FormLayout'
import { backgroundSx } from '@/common/components/FormStep/FormStep.styles'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
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

export const LoginSection = (): React.ReactElement => {
  const { t } = useTranslation()
  const router = useRouter()
  const { login } = useUser()
  const [nonFieldErrors, setNonFieldErrors] = useState<string[]>([])

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
    login(email, password, rememberMe)
      .then(() => router.push(ROUTES.home))
      .catch((error: AxiosError) => {
        const nonFieldErrors = (error.response?.data as AxiosErrorData)
          .nonFieldErrors || ['unknownError']
        setNonFieldErrors(nonFieldErrors)
      })
  }

  return (
    <FormLayout>
      <Typography
        component={'h1'}
        variant={'h4'}
        mb={{ xs: 8, sm: 10, md: 11 }}
      >
        {t('login')}
      </Typography>
      <section>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box component={'header'} sx={backgroundSx}>
            <Typography variant={'h6'}>{t('loginForm.title')}</Typography>
            <Typography variant={'body1'} mt={{ xs: 5, sm: 6 }}>
              {t('loginForm.description')}
            </Typography>
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
                />
                <TextField
                  label={t('password')}
                  error={!!errors?.password}
                  helperText={errorMsg(errors?.password?.message)}
                  type={'password'}
                  required
                  fullWidth
                  {...register('password')}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label={t('loginForm.rememberMe')}
                  {...register('rememberMe')}
                />
              </Stack>
            </Box>
          </Box>
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
          {nonFieldErrors.length > 0 &&
            nonFieldErrors.map((error) => (
              <ErrorAlert
                title={t(`common:serverErrors.${error}`)}
                key={error}
                sx={{ marginTop: 4, borderRadius: 3 }}
              />
            ))}
        </form>
      </section>
    </FormLayout>
  )
}
