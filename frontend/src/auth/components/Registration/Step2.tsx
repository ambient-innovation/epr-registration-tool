import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Stack, TextField } from '@mui/material'
import { useTranslation } from 'next-i18next'
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
  const { t } = useTranslation()

  const { register, handleSubmit, formState, control } = useForm<FormData>({
    mode: 'onTouched',
    resolver,
    defaultValues: pick(initialData, ...FIELD_NAMES),
  })

  const errorMsg = (translationKey: string | undefined): string | undefined =>
    translationKey && (t(translationKey) as string)

  const { errors } = formState
  return (
    <FormStep
      title={t('registrationForm.step2Title')}
      description={t('registrationForm.step2Description')}
      onSubmit={handleSubmit(onSubmit)}
      onClickBack={goToPrevStep}
    >
      <Stack spacing={DEFAULT_FORM_SPACING}>
        <TextField
          autoFocus // autofocus first field
          label={t('registrationForm.streetAndNumber')}
          error={!!errors?.companyStreet}
          helperText={errorMsg(errors?.companyStreet?.message)}
          required
          fullWidth
          {...register('companyStreet')}
        />
        <Stack
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
          spacing={DEFAULT_FORM_SPACING}
        >
          <TextField
            dir={'ltr'}
            label={t('registrationForm.postalCode')}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            error={!!errors?.companyZipCode}
            helperText={errorMsg(errors?.companyZipCode?.message)}
            fullWidth
            {...register('companyZipCode')}
          />
          <TextField
            label={t('registrationForm.city')}
            error={!!errors?.companyCity}
            helperText={errorMsg(errors?.companyCity?.message)}
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
                      label={t('registrationForm.country')}
                      error={!!errors?.companyCountry}
                      helperText={errorMsg(errors?.companyCountry?.message)}
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
                      label={t('registrationForm.province')}
                      error={!!errors?.companyProvince}
                      helperText={errorMsg(errors?.companyProvince?.message)}
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
          label={t('registrationForm.additionalAddressInfo')}
          error={!!errors?.companyAddressInfo}
          helperText={errorMsg(errors?.companyAddressInfo?.message)}
          fullWidth
          {...register('companyAddressInfo')}
        />
        <TextField
          dir={'ltr'} // email is always from left to right
          label={t('registrationForm.companyEmail')}
          error={!!errors?.companyEmail}
          helperText={errorMsg(errors?.companyEmail?.message)}
          required
          fullWidth
          {...register('companyEmail')}
        />
        <TextField
          dir={'ltr'} // numbers is always from left to right
          label={t('registrationForm.companyPhoneNumber')}
          error={!!errors?.companyPhone}
          helperText={errorMsg(errors?.companyPhone?.message)}
          fullWidth
          {...register('companyPhone')}
        />
        <TextField
          dir={'ltr'}
          label={t('registrationForm.companyMobileNumber')}
          error={!!errors?.companyMobile}
          helperText={errorMsg(errors?.companyMobile?.message)}
          fullWidth
          {...register('companyMobile')}
        />
        <TextField
          dir={'ltr'}
          label={t('registrationForm.companyFaxNumber')}
          error={!!errors?.companyFax}
          helperText={errorMsg(errors?.companyFax?.message)}
          fullWidth
          {...register('companyFax')}
        />
      </Stack>
    </FormStep>
  )
}
