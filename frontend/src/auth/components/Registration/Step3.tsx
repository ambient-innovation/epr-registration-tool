import { yupResolver } from '@hookform/resolvers/yup'
import { TextField } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import { FormStep, FormStepContainer } from '@/common/components/FormStep'
import { passwordValidator } from '@/utils/form-validation.utils'

import { useRegistrationContext } from './RegistrationContext'
import { RegistrationData } from './types'

const FIELD_NAMES = ['password'] as const
type FieldName = typeof FIELD_NAMES[number]
type FormData = Pick<RegistrationData, FieldName>

export type Step3 = Record<string, never>

const schema: SchemaOf<Record<FieldName, unknown>> = yup.object({
  password: passwordValidator(),
})
const resolver = yupResolver(schema)

export const Step3 = (_: Step3) => {
  const { data, goToPrevStep, onSubmit, error } = useRegistrationContext()
  const { t } = useTranslation()

  const { register, handleSubmit, formState } = useForm<FormData>({
    mode: 'onTouched',
    resolver,
    defaultValues: {
      password: data.password,
    },
  })

  const errorMsg = (translationKey: string | undefined): string | undefined =>
    translationKey && (t(translationKey) as string)

  const { errors } = formState

  return (
    <FormStep
      onSubmit={handleSubmit(onSubmit)}
      onClickBack={goToPrevStep}
      isLoading={
        formState.isSubmitting || (formState.isSubmitSuccessful && !error)
      }
      isFinalStep
      apolloError={error}
      errorTitle={t('registrationForm.registrationFailed')}
    >
      <FormStepContainer
        title={t('registrationForm.step3Title')}
        description={t('registrationForm.step3Description')}
      >
        <TextField
          autoFocus
          label={t('password')}
          error={!!errors?.password}
          helperText={errorMsg(errors?.password?.message)}
          type={'password'}
          autoComplete={'new-password'} // let the browser give suggestions
          required
          fullWidth
          {...register('password')}
        />
      </FormStepContainer>
    </FormStep>
  )
}
