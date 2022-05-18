import { yupResolver } from '@hookform/resolvers/yup'
import { TextField } from '@mui/material'
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

  const { register, handleSubmit, formState } = useForm<FormData>({
    mode: 'onTouched',
    resolver,
    defaultValues: {
      password: data.password,
    },
  })

  const { errors } = formState

  return (
    <FormStep
      title={'Choose a password'}
      description={
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo\n' +
        'ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis\n' +
        'dis parturient montes, nascetur ridiculus mus.'
      }
      onSubmit={handleSubmit(onSubmit)}
      onClickBack={goToPrevStep}
      isLoading={isLoading}
      isFinalStep
    >
      <TextField
        autoFocus
        label={'Password'}
        error={!!errors?.password}
        helperText={errors?.password?.message}
        type={'password'}
        required
        fullWidth
        {...register('password')}
      />
    </FormStep>
  )
}
