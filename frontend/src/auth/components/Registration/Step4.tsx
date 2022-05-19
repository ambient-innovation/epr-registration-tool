import { yupResolver } from '@hookform/resolvers/yup'
import { TextField } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import { FormStep } from '@/common/components/FormStep'
import { passwordValidator } from '@/utils/form-validation.utils'

import { useRegistrationContext } from './RegistrationContext'
import { RegistrationData } from './types'

const FIELD_NAMES = ['password'] as const
type FieldName = typeof FIELD_NAMES[number]
type FormData = Pick<RegistrationData, FieldName>

export type Step4 = Record<string, never>

const schema: SchemaOf<Record<FieldName, unknown>> = yup.object({
  password: passwordValidator(),
})
const resolver = yupResolver(schema)

export const Step4 = (_: Step4) => {
  const { data, goToPrevStep, onSubmit, isLoading } = useRegistrationContext()
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
      title={t('registrationForm.step4Title')}
      description={t('registrationForm.step4Description')}
      onSubmit={handleSubmit(onSubmit)}
      onClickBack={goToPrevStep}
      isLoading={isLoading}
      isFinalStep
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
    </FormStep>
  )
}
