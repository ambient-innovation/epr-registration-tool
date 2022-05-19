import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Checkbox, Chip, Stack, TextField } from '@mui/material'
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
  companySubSectorIds: yup
    .array()
    .min(1, 'The Field must have at least 1 item'),
})

const resolver = yupResolver(schema)

export const Step1 = (_: Step1) => {
  const { initialData, onSubmit } = useRegistrationContext()

  const { register, handleSubmit, formState, control } = useForm<FormData>({
    mode: 'onTouched',
    resolver,
    defaultValues: pick(initialData, ...FIELD_NAMES),
  })

  const { errors } = formState

  return (
    <FormStep
      title={'Enter general company information'}
      description={
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ' +
        'Aenean commodo ligula eget dolor. Aenean massa. ' +
        'Cum sociis natoque penatibus et magnis dis parturient montes, ' +
        'nascetur ridiculus mus.'
      }
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={DEFAULT_FORM_SPACING}>
        <TextField
          autoFocus // autofocus first field
          label={'Name of company'}
          error={!!errors?.companyName}
          helperText={errors?.companyName?.message}
          fullWidth
          required
          {...register('companyName')}
        />
        <TextField
          fullWidth
          label={'Company registration number'}
          error={!!errors?.companyRegistrationNumber}
          helperText={errors?.companyRegistrationNumber?.message}
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
                      label={'Sectors'}
                      error={!!errors?.companySectorId}
                      helperText={errors?.companySectorId?.message}
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
                    label={'Subsectors'}
                    inputRef={ref}
                    error={!!errors?.companySubSectorIds}
                    helperText={(errors?.companySubSectorIds as any)?.message}
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
