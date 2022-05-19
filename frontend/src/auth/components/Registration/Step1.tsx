import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Checkbox, Chip, Stack, TextField } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import {
  companySectorOptions,
  companySubSectorsOptions,
} from '@/auth/components/Registration/mocks'
import { FormStep } from '@/common/components/FormStep'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import {
  companyRegistrationNumberValidator,
  requiredStringValidator,
} from '@/utils/form-validation.utils'
import { pick } from '@/utils/typescript.utils'

import { useRegistrationContext } from './RegistrationContext'
import { RegistrationData } from './types'

const FIELD_NAMES = [
  'companyName',
  'companyRegistrationNumber',
  'companySectorId',
  'companySubSectorIds',
] as const

type FieldName = typeof FIELD_NAMES[number]
type FormData = Pick<RegistrationData, FieldName>

export type Step1 = Record<string, never>

const schema: SchemaOf<Record<keyof FormData, unknown>> = yup.object().shape({
  companyName: requiredStringValidator(),
  companyRegistrationNumber: companyRegistrationNumberValidator(),
  companySectorId: requiredStringValidator(),
  companySubSectorIds: yup.array().min(1, 'requiredMultiselect'),
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
        <TextField
          dir={'ltr'}
          fullWidth
          label={t('registrationForm.registrationNumber')}
          error={!!errors?.companyRegistrationNumber}
          helperText={errorMsg(errors?.companyRegistrationNumber?.message)}
          required
          {...register('companyRegistrationNumber')}
        />
        <Controller
          control={control}
          name={'companySectorId'}
          render={({ field: { onChange, ref }, formState: { errors } }) => {
            return (
              <Autocomplete
                defaultValue={companySectorOptions.find(
                  (option) => option.value === initialData.companySectorId
                )}
                options={companySectorOptions}
                onChange={(_, item) => onChange(item?.value)}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      inputRef={ref}
                      label={t('registrationForm.sector')}
                      error={!!errors?.companySectorId}
                      helperText={errorMsg(errors?.companySectorId?.message)}
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
          name={'companySubSectorIds'}
          render={({ field: { onChange, ref }, formState: { errors } }) => {
            return (
              <Autocomplete
                multiple
                options={companySubSectorsOptions}
                disableCloseOnSelect
                renderTags={(items, getTagProps) => {
                  return items.map(({ value, label }, index) => {
                    return (
                      <Chip
                        {...getTagProps({ index })}
                        color={'secondary'}
                        key={value}
                        sx={{
                          color: 'white',
                          '& .MuiChip-deleteIcon': {
                            display: 'none',
                          },
                        }}
                        label={label}
                      />
                    )
                  })
                }}
                onChange={(_, items) => {
                  onChange(items.map(({ value }) => value))
                }}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      style={{ marginRight: 8 }}
                      color={'secondary'}
                      checked={selected}
                    />
                    {option.label}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('registrationForm.subsector')}
                    inputRef={ref}
                    error={!!errors?.companySubSectorIds}
                    helperText={errorMsg(
                      (errors?.companySubSectorIds as any)?.message
                    )}
                    fullWidth
                    required
                  />
                )}
              />
            )
          }}
        />
      </Stack>
    </FormStep>
  )
}
