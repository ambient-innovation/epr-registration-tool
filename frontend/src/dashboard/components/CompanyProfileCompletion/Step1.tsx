import { yupResolver } from '@hookform/resolvers/yup'
import { Stack, TextField } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import { FormStep, FormStepContainer } from '@/common/components/FormStep'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import {
  requiredStringWithoutWhitespace,
  requiredStringValidator,
} from '@/utils/form-validation.utils'
import { pick } from '@/utils/typescript.utils'

import { useCompanyProfileContext } from './CompanyProfileContext'
import { CompanyProfileData } from './types'

const FIELD_NAMES = [
  'country',
  'postalCode',
  'city',
  'street',
  'streetNumber',
  'additionalAddressInfo',
  'phoneNumber',
  'identificationNumber',
] as const

type FieldName = typeof FIELD_NAMES[number]
type FormData = Pick<CompanyProfileData, FieldName>

export type Step1 = Record<string, never>

const schema: SchemaOf<Record<FieldName, unknown>> = yup.object().shape({
  country: requiredStringValidator(),
  postalCode: yup.string(),
  city: requiredStringValidator(),
  street: requiredStringValidator(),
  streetNumber: yup.string(),
  phoneNumber: requiredStringValidator(),
  additionalAddressInfo: yup.string(),
  identificationNumber: requiredStringWithoutWhitespace(),
})

const resolver = yupResolver(schema)

export const Step1 = (_: Step1) => {
  const { initialData, onSubmit, error } = useCompanyProfileContext()
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
    <FormStep
      onSubmit={handleSubmit(onSubmit)}
      isLoading={
        formState.isSubmitting || (formState.isSubmitSuccessful && !error)
      }
      apolloError={error}
    >
      <FormStepContainer title={t('companyCompletionForm.step1Title')}>
        <Stack spacing={DEFAULT_FORM_SPACING}>
          <TextField
            autoFocus // autofocus first field
            label={t('companyCompletionForm.companyCountry')}
            sx={{
              width: {
                sm: 'calc(50% - (1.25rem / 2))',
                lg: 'calc(50% - (1.5rem / 2))',
              },
            }}
            error={!!errors?.country}
            helperText={errorMsg(errors?.country?.message)}
            required
            {...register('country')}
          />
          <Stack // for some reason the spacing does not work when only defining `sm`
            direction={{ xs: 'column', sm: 'row', md: 'row' }}
            spacing={DEFAULT_FORM_SPACING}
          >
            <TextField
              label={t('companyCompletionForm.companyPostalCode')}
              error={!!errors?.postalCode}
              helperText={errorMsg(errors?.postalCode?.message)}
              fullWidth
              {...register('postalCode')}
            />
            <TextField
              label={t('companyCompletionForm.companyCity')}
              error={!!errors?.city}
              helperText={errorMsg(errors?.city?.message)}
              required
              fullWidth
              {...register('city')}
            />
          </Stack>
          <Stack // for some reason the spacing does not work when only defining `sm`
            direction={{ xs: 'column', sm: 'row', md: 'row' }}
            spacing={DEFAULT_FORM_SPACING}
          >
            <TextField
              label={t('companyCompletionForm.companyStreet')}
              error={!!errors?.street}
              helperText={errorMsg(errors?.street?.message)}
              required
              fullWidth
              {...register('street')}
            />
            <TextField
              label={t('companyCompletionForm.companyStreetNumber')}
              error={!!errors?.streetNumber}
              helperText={errorMsg(errors?.streetNumber?.message)}
              fullWidth
              {...register('streetNumber')}
            />
          </Stack>
          <TextField
            label={t('companyCompletionForm.companyAdditionalAddressInfo')}
            error={!!errors?.additionalAddressInfo}
            helperText={errorMsg(errors?.additionalAddressInfo?.message)}
            fullWidth
            multiline
            {...register('additionalAddressInfo')}
          />
          <TextField
            label={t('companyCompletionForm.companyPhoneNumber.label')}
            error={!!errors?.phoneNumber}
            helperText={
              !!errors?.phoneNumber
                ? errorMsg(errors?.phoneNumber?.message)
                : t('companyCompletionForm.companyPhoneNumber.hint')
            }
            required
            fullWidth
            {...register('phoneNumber')}
          />
        </Stack>
      </FormStepContainer>
      <FormStepContainer
        title={t('companyCompletionForm.companyIdentificationNumber.title')}
        description={t(
          'companyCompletionForm.companyIdentificationNumber.description'
        )}
        mt={8}
      >
        <TextField
          label={t(
            'companyCompletionForm.companyIdentificationNumber.fieldName'
          )}
          error={!!errors?.identificationNumber}
          helperText={errorMsg(errors?.identificationNumber?.message)}
          required
          fullWidth
          {...register('identificationNumber')}
        />
      </FormStepContainer>
    </FormStep>
  )
}
