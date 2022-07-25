import { yupResolver } from '@hookform/resolvers/yup'
import { Divider, Stack, TextField } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import { getTitleOptions } from '@/auth/components/Registration/constants'
import { FormStep, FormStepContainer } from '@/common/components/FormStep'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import { SelectField } from '@/common/components/SelectField'
import { pxToRemAsString } from '@/theme/utils'
import {
  emailValidator,
  requiredStringValidator,
} from '@/utils/form/form-validation.utils'
import { pick } from '@/utils/typescript.utils'

import { useRegistrationContext } from './RegistrationContext'
import { RegistrationData } from './types'

const FIELD_NAMES = [
  'userEmail',
  'userTitle',
  'userFullName',
  'userPosition',
  'userPhone',
] as const
type FieldName = typeof FIELD_NAMES[number]
type FormData = Pick<RegistrationData, FieldName>

export type Step2 = Record<string, never>

const schema: SchemaOf<Record<FieldName, unknown>> = yup.object({
  userEmail: emailValidator(),
  userTitle: requiredStringValidator(),
  userFullName: requiredStringValidator(),
  userPosition: requiredStringValidator(),
  userPhone: requiredStringValidator(),
})

const resolver = yupResolver(schema)

export const Step2 = (_: Step2) => {
  const { initialData, goToPrevStep, onSubmit } = useRegistrationContext()
  const { t } = useTranslation()

  const { register, handleSubmit, formState } = useForm<FormData>({
    mode: 'onTouched',
    resolver,
    defaultValues: pick(initialData, ...FIELD_NAMES),
  })

  const errorMsg = (translationKey: string | undefined): string | undefined =>
    translationKey && (t(translationKey) as string)

  const { errors } = formState

  return (
    <FormStep onSubmit={handleSubmit(onSubmit)} onClickBack={goToPrevStep}>
      <FormStepContainer
        title={t('registrationForm.step2Title')}
        description={t('registrationForm.step2Description')}
      >
        <Stack spacing={DEFAULT_FORM_SPACING}>
          <TextField
            autoFocus // autofocus first field
            label={t('email')}
            error={!!errors?.userEmail}
            helperText={
              errorMsg(errors?.userEmail?.message) ||
              (t('registrationForm.emailHelpText') as string)
            }
            type={'email'}
            required
            dir={'ltr'} // email always written from left
            {...register('userEmail')}
          />
          <Divider />
          <Stack
            // for some reason the spacing does not work when only defining `sm`
            direction={{ xs: 'column', sm: 'row', md: 'row' }}
            spacing={DEFAULT_FORM_SPACING}
          >
            <SelectField
              sx={{
                width: { sm: pxToRemAsString(120) },
              }}
              label={t('registrationForm.title')}
              error={!!errors?.userTitle}
              helperText={errorMsg(errors?.userTitle?.message)}
              defaultValue={initialData.userTitle}
              options={getTitleOptions(t)}
              fullWidth
              required
              {...register('userTitle')}
            />
            <TextField
              label={t('registrationForm.fullName')}
              error={!!errors?.userFullName}
              helperText={errorMsg(errors?.userFullName?.message)}
              fullWidth
              required
              {...register('userFullName')}
            />
          </Stack>
          <TextField
            label={t('registrationForm.position')}
            error={!!errors?.userPosition}
            helperText={errorMsg(errors?.userPosition?.message)}
            required
            {...register('userPosition')}
          />
          <TextField
            label={t('registrationForm.phoneMobileNumber')}
            error={!!errors?.userPhone}
            helperText={errorMsg(errors?.userPhone?.message)}
            required
            {...register('userPhone')}
          />
        </Stack>
      </FormStepContainer>
    </FormStep>
  )
}
