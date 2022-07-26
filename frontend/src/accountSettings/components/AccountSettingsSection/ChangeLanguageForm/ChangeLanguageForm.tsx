import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, Box, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import React, { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SchemaOf } from 'yup'
import * as yup from 'yup'

import { LanguageEnum, useChangeLanguageMutation } from '@/api/__types__'
import { useUser } from '@/auth/hooks/useUser'
import { ME } from '@/auth/queries/me'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { FormSubmitFooter } from '@/common/components/FormSubmitFooter'
import { LoadingState } from '@/common/components/LoadingState'
import { SelectField } from '@/common/components/SelectField'
import { getLanguageOptions } from '@/common/contants'

import {
  formBackgroundSx,
  formFooterSx,
} from '../AccountSettingsSection.styles'
import { ChangeLanguageData } from './types'

const schema: SchemaOf<Record<keyof ChangeLanguageData, unknown>> = yup
  .object()
  .shape({
    languageCode: yup.mixed<LanguageEnum>().oneOf(Object.values(LanguageEnum)),
  })

const resolver = yupResolver(schema)

export const ChangeLanguageForm = (): React.ReactElement => {
  const titleId = useId()
  const descriptionId = useId()

  const { t } = useTranslation()
  const { user } = useUser()
  const [showSuccess, setShowSuccess] = useState(false)
  const { register, handleSubmit, formState } = useForm<ChangeLanguageData>({
    mode: 'onTouched',
    resolver,
    defaultValues: {
      languageCode: LanguageEnum.en,
    },
  })

  const [changeLanguageMutation, { error }] = useChangeLanguageMutation()

  const { errors } = formState

  const errorMsg = (translationKey: string | undefined): string | undefined =>
    translationKey && (t(translationKey) as string)

  const onSubmit = ({ languageCode }: ChangeLanguageData) => {
    return (
      changeLanguageMutation({
        variables: {
          languageCode,
        },
        refetchQueries: [ME],
      })
        .then(() => setShowSuccess(true))
        // handle error via error object returned by useMutation
        .catch(() => null)
    )
  }

  return !user ? (
    <LoadingState />
  ) : (
    <>
      {showSuccess && (
        <Box mb={11}>
          <Alert
            sx={{ alignItems: 'center' }}
            variant={'filled'}
            severity={'success'}
          >
            <Typography variant={'body2'}>
              {t('accountSettings.changeLanguageForm.notification')}
            </Typography>
          </Alert>
        </Box>
      )}
      <section aria-labelledby={titleId} aria-describedby={descriptionId}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={formBackgroundSx}>
            <header>
              <Typography id={titleId} component={'h2'} variant={'h3'}>
                {t('accountSettings.changeLanguageForm.title')}
              </Typography>
              <Typography
                id={descriptionId}
                variant={'body1'}
                mt={{ xs: 5, sm: 6 }}
              >
                {t('accountSettings.changeLanguageForm.description')}
              </Typography>
            </header>
            <Box marginTop={{ xs: 9, md: 10 }}>
              <SelectField
                label={t('accountSettings.changeLanguageForm.label')}
                error={!!errors?.languageCode}
                helperText={errorMsg(errors?.languageCode?.message)}
                defaultValue={user && user.languagePreference}
                options={getLanguageOptions()}
                fullWidth
                required
                {...register('languageCode')}
              />
            </Box>
          </Box>
          {error && (
            <Box mt={5}>
              <ApolloErrorAlert
                title={t(
                  'accountSettings.changeLanguageForm.languageChangeFailed'
                )}
                error={error}
              />
            </Box>
          )}
          <FormSubmitFooter
            sx={formFooterSx}
            isSubmitting={formState.isSubmitting}
            buttonLabelKey={'accountSettings.submitChanges'}
          />
        </form>
      </section>
    </>
  )
}
