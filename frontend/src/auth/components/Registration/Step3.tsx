import { yupResolver } from '@hookform/resolvers/yup'
import { Divider, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import { titleOptions } from '@/auth/components/Registration/mocks'
import { FormStep } from '@/common/components/FormStep'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import { SelectField } from '@/common/components/SelecField'
import { pxToRemAsString } from '@/theme/utils'
import {
  emailValidator,
  requiredStringValidator,
} from '@/utils/form-validation.utils'

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

export type Step3 = Record<string, never>

const schema: SchemaOf<Record<keyof FormData, unknown>> = yup.object({
  userEmail: emailValidator(),
  userTitle: requiredStringValidator(),
  userFullName: requiredStringValidator(),
  userPosition: requiredStringValidator(),
  userPhone: requiredStringValidator(),
})

const resolver = yupResolver(schema)

export const Step3 = (_: Step3) => {
  const { data, goToPrevStep, onSubmit } = useRegistrationContext()

  const defaultValues = FIELD_NAMES.reduce((acc, next) => {
    acc[next] = data[next]
    return acc
  }, {} as FormData)

  const { register, handleSubmit, formState } = useForm<FormData>({
    mode: 'onTouched',
    resolver,
    defaultValues,
  })

  const { errors } = formState

  return (
    <FormStep
      title={'Provide a contact person'}
      description={
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo\n' +
        'ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis\n' +
        'dis parturient montes, nascetur ridiculus mus.'
      }
      onSubmit={handleSubmit(onSubmit)}
      onClickBack={goToPrevStep}
    >
      <Stack spacing={DEFAULT_FORM_SPACING}>
        <TextField
          autoFocus // autofocus first field
          label={'Email'}
          error={!!errors?.userEmail}
          helperText={
            errors?.userEmail?.message ||
            'Attention: This is the E-mail your company will use to log in to the EPR Registration Tool.'
          }
          defaultValue={defaultValues.userEmail}
          type={'email'}
          required
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
            label={'Title'}
            error={!!errors?.userTitle}
            helperText={errors?.userTitle?.message}
            defaultValue={defaultValues.userTitle}
            options={titleOptions}
            fullWidth
            required
            {...register('userTitle')}
          />
          <TextField
            // sx={{ flexGrow: { sm: 1 } }}
            label={'Full name'}
            error={!!errors?.userFullName}
            helperText={errors?.userFullName?.message}
            defaultValue={defaultValues.userFullName}
            fullWidth
            required
            {...register('userFullName')}
          />
        </Stack>
        <TextField
          label={'Position'}
          error={!!errors?.userPosition}
          helperText={errors?.userPosition?.message}
          defaultValue={defaultValues.userPosition}
          required
          {...register('userPosition')}
        />
        <TextField
          label={'Phone / mobile number'}
          error={!!errors?.userPhone}
          helperText={errors?.userPhone?.message}
          defaultValue={defaultValues.userPhone}
          required
          {...register('userPhone')}
        />
      </Stack>
    </FormStep>
  )
}
