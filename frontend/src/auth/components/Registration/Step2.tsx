import { yupResolver } from '@hookform/resolvers/yup'
import { Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import {
  companyCountryOptions,
  companyProvinceOptions,
} from '@/auth/components/Registration/mocks'
import { FormStep } from '@/common/components/FormStep'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import { SelectField } from '@/common/components/SelecField'
import {
  emailValidator,
  requiredStringValidator,
} from '@/utils/form-validation.utils'

import { useRegistrationContext } from './RegistrationContext'
import { RegistrationData } from './types'

const FIELD_NAMES = [
  'companyStreet',
  'companyZipCode',
  'companyCity',
  'companyCountry',
  'companyProvince',
  'companyAddressInfo',
  'companyEmail',
  'companyPhone',
  'companyMobile',
  'companyFax',
] as const

type FieldName = typeof FIELD_NAMES[number]
type FormData = Pick<RegistrationData, FieldName>

export type Step2 = Record<string, never>

const schema: SchemaOf<Record<keyof FormData, unknown>> = yup.object().shape({
  companyStreet: requiredStringValidator(),
  companyCity: requiredStringValidator(),
  companyCountry: requiredStringValidator(),
  companyProvince: requiredStringValidator(),
  companyEmail: emailValidator(),
  companyZipCode: yup.string(),
  companyAddressInfo: yup.string(),
  companyPhone: yup.string(),
  companyMobile: yup.string(),
  companyFax: yup.string(),
})

const resolver = yupResolver(schema)

export const Step2 = (_: Step2) => {
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
      title={'Enter your company address and contact information'}
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
          label={'Street, number'}
          error={!!errors?.companyStreet}
          helperText={errors?.companyStreet?.message}
          defaultValue={defaultValues.companyStreet}
          required
          fullWidth
          {...register('companyStreet')}
        />
        <Stack
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
          spacing={DEFAULT_FORM_SPACING}
        >
          <TextField
            label={'Postal code'}
            type={'number'}
            error={!!errors?.companyZipCode}
            helperText={errors?.companyZipCode?.message}
            defaultValue={defaultValues.companyZipCode}
            required
            fullWidth
            {...register('companyZipCode')}
          />
          <TextField
            label={'City'}
            error={!!errors?.companyCity}
            helperText={errors?.companyCity?.message}
            defaultValue={defaultValues.companyCity}
            required
            fullWidth
            {...register('companyCity')}
          />
        </Stack>
        <SelectField
          label={'Country'}
          error={!!errors?.companyCountry}
          helperText={errors?.companyCountry?.message}
          defaultValue={defaultValues.companyCountry}
          options={companyCountryOptions}
          required
          fullWidth
          {...register('companyCountry')}
        />
        <SelectField
          label={'Province'}
          error={!!errors?.companyProvince}
          helperText={errors?.companyProvince?.message}
          defaultValue={defaultValues.companyProvince}
          options={companyProvinceOptions}
          required
          fullWidth
          {...register('companyProvince')}
        />
        <TextField
          label={'Additional address info (optional)'}
          error={!!errors?.companyAddressInfo}
          helperText={errors?.companyAddressInfo?.message}
          defaultValue={defaultValues.companyAddressInfo}
          fullWidth
          {...register('companyAddressInfo')}
        />
        <TextField
          label={'Company e-mail'}
          error={!!errors?.companyEmail}
          helperText={errors?.companyEmail?.message}
          defaultValue={defaultValues.companyEmail}
          required
          fullWidth
          {...register('companyEmail')}
        />
        <TextField
          label={'Company phone number (optional)'}
          error={!!errors?.companyPhone}
          helperText={errors?.companyPhone?.message}
          defaultValue={defaultValues.companyPhone}
          fullWidth
          {...register('companyPhone')}
        />
        <TextField
          label={'Company mobile number (optional)'}
          error={!!errors?.companyMobile}
          helperText={errors?.companyMobile?.message}
          defaultValue={defaultValues.companyMobile}
          fullWidth
          {...register('companyMobile')}
        />
        <TextField
          label={'Company fax number (optional)'}
          error={!!errors?.companyFax}
          helperText={errors?.companyFax?.message}
          defaultValue={defaultValues.companyFax}
          fullWidth
          {...register('companyFax')}
        />
      </Stack>
    </FormStep>
  )
}
