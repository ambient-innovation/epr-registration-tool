import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { useId } from 'react'
import { useForm } from 'react-hook-form'
import { ref, SchemaOf } from 'yup'
import * as yup from 'yup'

import { useChangePasswordMutation } from '@/api/__types__'
import { useUser } from '@/auth/hooks/useUser'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import { FormSubmitFooter } from '@/common/components/FormSubmitFooter'
import { PasswordInput } from '@/common/components/PasswordInput'
import {
  passwordValidator,
  requiredStringValidator,
} from '@/utils/form-validation.utils'

import { backgroundSx, footerSx } from './ChangePasswordForm.styles'
import { ChangePasswordData } from './types'

export const CHANGE_PW_COMPLETE_ALERT_KEY = 'changePasswordComplete'

const schema: SchemaOf<Record<keyof ChangePasswordData, unknown>> = yup
  .object()
  .shape({
    oldPassword: requiredStringValidator(),
    newPassword: passwordValidator().notOneOf(
      [ref('oldPassword')],
      'validations.identicalPasswordNotAllowed'
    ),
  })

const resolver = yupResolver(schema)

export const ChangePasswordForm = (): React.ReactElement => {
  const titleId = useId()
  const firstDescriptionId = useId()
  const secondDescriptionId = useId()
  const descriptionId = firstDescriptionId.concat(' ', secondDescriptionId)

  const { t } = useTranslation()
  const { setLoggedIn } = useUser()
  const router = useRouter()
  const { register, handleSubmit, formState } = useForm<ChangePasswordData>({
    mode: 'onTouched',
    resolver,
    defaultValues: {
      newPassword: '',
      oldPassword: '',
    },
  })
  const [ChangePasswordMutation, { error }] = useChangePasswordMutation()

  const { errors } = formState

  const errorMsg = (translationKey: string | undefined): string | undefined =>
    translationKey && (t(translationKey) as string)

  const onSubmit = ({ newPassword, oldPassword }: ChangePasswordData) => {
    return (
      ChangePasswordMutation({
        variables: {
          oldPassword,
          newPassword,
        },
      })
        .then(() => {
          // no need to call the logout mutation as the session is already invalidated by django in case of PW change.
          // ProtectedRoute redirects automatically to the login page. We add the query parameters here and they will
          // be preserved during the redirect.
          router
            .replace({
              pathname: router.pathname,
              query: { alert: CHANGE_PW_COMPLETE_ALERT_KEY },
            })
            .then(() => setLoggedIn(false))
        })
        // handle error via error object returned by useMutation
        .catch(() => null)
    )
  }

  return (
    <section aria-labelledby={titleId} aria-describedby={descriptionId}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={backgroundSx}>
          <header>
            <Typography id={titleId} component={'h2'} variant={'h3'}>
              {t('accountSettings.changePasswordForm.title')}
            </Typography>
            <Typography
              id={firstDescriptionId}
              variant={'body1'}
              mt={{ xs: 5, sm: 6 }}
            >
              {t('accountSettings.changePasswordForm.description1')}
            </Typography>
            <Typography
              id={secondDescriptionId}
              variant={'body1'}
              mt={{ xs: 5, sm: 6 }}
            >
              {t('accountSettings.changePasswordForm.description2')}
            </Typography>
          </header>
          <Box marginTop={{ xs: 9, md: 10 }}>
            <Stack spacing={DEFAULT_FORM_SPACING}>
              <PasswordInput
                label={t('accountSettings.changePasswordForm.oldPassword')}
                error={!!errors?.oldPassword}
                helperText={
                  errors?.oldPassword?.message
                    ? errorMsg(errors?.oldPassword?.message)
                    : t(
                        'accountSettings.changePasswordForm.oldPasswordHelpText'
                      )
                }
                required
                fullWidth
                {...register('oldPassword')}
              />
              <PasswordInput
                label={t('accountSettings.changePasswordForm.newPassword')}
                error={!!errors?.newPassword}
                helperText={errorMsg(errors?.newPassword?.message)}
                required
                fullWidth
                {...register('newPassword')}
              />
            </Stack>
          </Box>
        </Box>
        {error && (
          <Box mt={5}>
            <ApolloErrorAlert
              title={t(
                'accountSettings.changePasswordForm.passwordResetFailed'
              )}
              error={error}
            />
          </Box>
        )}
        <FormSubmitFooter
          sx={footerSx}
          isSubmitting={formState.isSubmitting}
          buttonLabelKey={
            'accountSettings.changePasswordForm.submitChangePassword'
          }
        />
      </form>
    </section>
  )
}
