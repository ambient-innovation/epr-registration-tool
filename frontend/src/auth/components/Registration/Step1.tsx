import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Stack, TextField } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import { getDistributorTypeOptions } from '@/auth/components/Registration/constants'
import { FormStep } from '@/common/components/FormStep'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import { requiredStringValidator } from '@/utils/form-validation.utils'
import { pick } from '@/utils/typescript.utils'

import { useRegistrationContext } from './RegistrationContext'
import { RegistrationData } from './types'

const FIELD_NAMES = ['companyName', 'companyDistributorType'] as const

type FieldName = typeof FIELD_NAMES[number]
type FormData = Pick<RegistrationData, FieldName>

export type Step1 = Record<string, never>

const schema: SchemaOf<Record<FieldName, unknown>> = yup.object().shape({
  companyName: requiredStringValidator(),
  companyDistributorType: requiredStringValidator().nullable(),
})

const resolver = yupResolver(schema)

export const Step1 = (_: Step1) => {
  const { initialData, onSubmit } = useRegistrationContext()
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
      title={t('registrationForm.step1Title')}
      description={t('registrationForm.step1Description')}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={DEFAULT_FORM_SPACING}>
        <TextField
          autoFocus // autofocus first field
          label={t('registrationForm.companyName')}
          error={!!errors?.companyName}
          helperText={errorMsg(errors?.companyName?.message)}
          fullWidth
          required
          {...register('companyName')}
        />
        <Controller
          control={control}
          name={'companyDistributorType'}
          render={({ field: { onChange, ref }, formState: { errors } }) => {
            const distributorOptions = getDistributorTypeOptions(t)
            return (
              <Autocomplete
                defaultValue={
                  initialData.companyDistributorType &&
                  distributorOptions.find(
                    (option) =>
                      option.value === initialData.companyDistributorType
                  )
                }
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                options={distributorOptions}
                onChange={(_, value) => {
                  onChange(value?.value)
                }}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      inputRef={ref}
                      label={t('registrationForm.companyDistributorType.label')}
                      error={!!errors?.companyDistributorType}
                      helperText={errorMsg(
                        errors?.companyDistributorType?.message
                      )}
                      fullWidth
                      required
                    />
                  )
                }}
              />
            )
          }}
        />
      </Stack>
    </FormStep>
  )
}
