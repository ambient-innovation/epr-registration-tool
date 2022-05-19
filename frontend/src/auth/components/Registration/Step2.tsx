import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Stack, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import {
  companyCountryOptions,
  companyProvinceOptions,
} from '@/auth/components/Registration/mocks'
import { FormStep } from '@/common/components/FormStep'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import {
  emailValidator,
  requiredStringValidator,
} from '@/utils/form-validation.utils'
import { pick } from '@/utils/typescript.utils'

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
  const { initialData, goToPrevStep, onSubmit } = useRegistrationContext()

  const { register, handleSubmit, formState, control } = useForm<FormData>({
    mode: 'onTouched',
    resolver,
    defaultValues: pick(initialData, ...FIELD_NAMES),
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
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            error={!!errors?.companyZipCode}
            helperText={errors?.companyZipCode?.message}
            fullWidth
            {...register('companyZipCode')}
          />
          <TextField
            label={'City'}
            error={!!errors?.companyCity}
            helperText={errors?.companyCity?.message}
            required
            fullWidth
            {...register('companyCity')}
          />
        </Stack>
        <Controller
          control={control}
          name={'companyCountry'}
          render={({ field: { onChange }, formState: { errors } }) => {
            return (
              <Autocomplete
                defaultValue={companyCountryOptions.find(
                  (option) => option.value === initialData.companyCountry
                )}
                options={companyCountryOptions}
                onChange={(_, item) => onChange(item?.value)}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      label={'Country'}
                      error={!!errors?.companyCountry}
                      helperText={errors?.companyCountry?.message}
                      fullWidth
                      required
                    />
                  )
                }}
              />
            )
          }}
        />
        <Controller
          control={control}
          name={'companyProvince'}
          render={({ field: { onChange }, formState: { errors } }) => {
            return (
              <Autocomplete
                defaultValue={companyProvinceOptions.find(
                  (option) => option.value === initialData.companyProvince
                )}
                options={companyCountryOptions}
                onChange={(_, item) => onChange(item?.value)}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      label={'Province'}
                      error={!!errors?.companyProvince}
                      helperText={errors?.companyProvince?.message}
                      fullWidth
                      required
                    />
                  )
                }}
              />
            )
          }}
        />
        <TextField
          label={'Additional address info (optional)'}
          error={!!errors?.companyAddressInfo}
          helperText={errors?.companyAddressInfo?.message}
          fullWidth
          {...register('companyAddressInfo')}
        />
        <TextField
          label={'Company e-mail'}
          error={!!errors?.companyEmail}
          helperText={errors?.companyEmail?.message}
          required
          fullWidth
          {...register('companyEmail')}
        />
        <TextField
          label={'Company phone number (optional)'}
          error={!!errors?.companyPhone}
          helperText={errors?.companyPhone?.message}
          fullWidth
          {...register('companyPhone')}
        />
        <TextField
          label={'Company mobile number (optional)'}
          error={!!errors?.companyMobile}
          helperText={errors?.companyMobile?.message}
          fullWidth
          {...register('companyMobile')}
        />
        <TextField
          label={'Company fax number (optional)'}
          error={!!errors?.companyFax}
          helperText={errors?.companyFax?.message}
          fullWidth
          {...register('companyFax')}
        />
      </Stack>
    </FormStep>
  )
}
