import { ApolloError } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, Box, Stack, TextField, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { SchemaOf } from 'yup'
import * as yup from 'yup'

import { EmailChangeRequestType } from '@/api/__types__'
import { getTitleOptions } from '@/auth/components/Registration/constants'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import { FormSubmitFooter } from '@/common/components/FormSubmitFooter'
import { SelectField } from '@/common/components/SelectField'
import { pxToRemAsString } from '@/theme/utils'
import {
  emailValidator,
  requiredStringValidator,
} from '@/utils/form/form-validation.utils'

import {
  formBackgroundSx,
  formFooterSx,
} from '../AccountSettingsSection.styles'
import { EditAccountData } from './types'

const schema: SchemaOf<Record<keyof EditAccountData, unknown>> = yup
  .object()
  .shape({
    title: yup.string(),
    email: emailValidator(),
    position: yup.string(),
    phoneOrMobile: yup.string(),
    fullName: requiredStringValidator(),
  })

const resolver = yupResolver(schema)

export const EditAccountFormHeader = () => {
  const { t } = useTranslation()

  return (
    <header>
      <Typography component={'h2'} variant={'h3'}>
        {t('accountSettings.editAccountForm.title')}
      </Typography>
      <Typography variant={'body1'} mt={{ xs: 5, sm: 6 }}>
        {t('accountSettings.editAccountForm.description')}
      </Typography>
    </header>
  )
}

export interface EditAccountForm {
  defaultValues: EditAccountData
  emailChangeRequest: EmailChangeRequestType | undefined
  onSubmit: (data: EditAccountData) => void
  error: ApolloError | undefined
}
export const EditAccountForm = ({
  defaultValues,
  emailChangeRequest,
  onSubmit,
  error,
}: EditAccountForm): React.ReactElement => {
  const isSubmittedSuccessfulRef = useRef(false)

  const { t } = useTranslation()

  const { register, handleSubmit, formState, reset } = useForm<EditAccountData>(
    {
      mode: 'onTouched',
      resolver,
      defaultValues,
    }
  )

  const { errors } = formState
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset(defaultValues)
    }
    // explicitly exclude `formState` from dependencies
    // --> only reset form when defaultValues change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, reset])

  if (formState.isSubmitSuccessful) {
    // avoid submission state turning back on form reset()
    isSubmittedSuccessfulRef.current = true
  }

  const errorMsg = (translationKey: string | undefined): string | undefined =>
    translationKey && (t(translationKey) as string)

  return (
    <>
      {isSubmittedSuccessfulRef.current && !formState.isDirty && (
        <Box mb={11}>
          <Alert
            sx={{ alignItems: 'center' }}
            variant={'filled'}
            severity={'success'}
          >
            <Typography variant={'body2'}>
              {t('accountSettings.editAccountForm.notification')}
            </Typography>
          </Alert>
        </Box>
      )}
      <section>
        <form
          // do not propagate errors --> display error
          onSubmit={(e) => handleSubmit(onSubmit)(e).catch(() => null)}
          noValidate
        >
          <Box sx={formBackgroundSx}>
            <EditAccountFormHeader />
            <Box marginTop={{ xs: 9, md: 10 }}>
              <Stack spacing={DEFAULT_FORM_SPACING}>
                <TextField
                  label={t('accountSettings.editAccountForm.email')}
                  error={!!errors?.email}
                  helperText={
                    !!errorMsg(errors?.email?.message)
                      ? errorMsg(errors?.email?.message)
                      : emailChangeRequest?.isValid
                      ? t(
                          'accountSettings.editAccountForm.emailConfirmNeededHelpText'
                        )
                      : (t(
                          'accountSettings.editAccountForm.emailHelpText'
                        ) as string)
                  }
                  type={'email'}
                  required
                  dir={'ltr'} // email always written from left
                  {...register('email')}
                />
                <Stack
                  // for some reason the spacing does not work when only defining `sm`
                  direction={{ xs: 'column', sm: 'row', md: 'row' }}
                  spacing={DEFAULT_FORM_SPACING}
                >
                  <SelectField
                    sx={{
                      width: { sm: pxToRemAsString(140) },
                    }}
                    label={t('accountSettings.editAccountForm.title')}
                    error={!!errors?.title}
                    helperText={errorMsg(errors?.title?.message)}
                    defaultValue={defaultValues?.title || ''}
                    options={getTitleOptions(t)}
                    fullWidth
                    required
                    {...register('title')}
                  />
                  <TextField
                    label={t('accountSettings.editAccountForm.fullName')}
                    error={!!errors?.fullName}
                    helperText={errorMsg(errors?.fullName?.message)}
                    fullWidth
                    required
                    {...register('fullName')}
                  />
                </Stack>
                <TextField
                  label={t('accountSettings.editAccountForm.position')}
                  error={!!errors?.position}
                  helperText={errorMsg(errors?.position?.message)}
                  required
                  {...register('position')}
                />
                <TextField
                  label={t('accountSettings.editAccountForm.phoneNumber')}
                  error={!!errors?.phoneOrMobile}
                  helperText={errorMsg(errors?.phoneOrMobile?.message)}
                  required
                  {...register('phoneOrMobile')}
                />
              </Stack>
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
          />
        </form>
      </section>
    </>
  )
}
