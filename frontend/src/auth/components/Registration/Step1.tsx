import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Checkbox, Chip, Stack, TextField } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import { useCompanySectorsQuery } from '@/api/__types__'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { FormStep } from '@/common/components/FormStep'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import { requiredStringValidator } from '@/utils/form-validation.utils'
import { pick } from '@/utils/typescript.utils'

import { useRegistrationContext } from './RegistrationContext'
import { RegistrationData } from './types'

const FIELD_NAMES = [
  'companyName',
  'companySectorId',
  'companySubSectorIds',
] as const

type FieldName = typeof FIELD_NAMES[number]
type FormData = Pick<RegistrationData, FieldName>

export type Step1 = Record<string, never>

const schema: SchemaOf<Record<FieldName, unknown>> = yup.object().shape({
  companyName: requiredStringValidator(),
  companySectorId: requiredStringValidator(),
  companySubSectorIds: yup.array().min(1, 'validations.requiredMultiselect'),
})

const resolver = yupResolver(schema)

export const Step1 = (_: Step1) => {
  const { initialData, onSubmit } = useRegistrationContext()
  const { t } = useTranslation()

  const { data: sectorsData, error } = useCompanySectorsQuery()

  const companySectorOptions =
    sectorsData?.sectors.map((sector) => ({
      id: sector.id,
      label: sector.name,
    })) || []

  const { register, handleSubmit, formState, control, watch, setValue } =
    useForm<FormData>({
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
        {error && <ApolloErrorAlert error={error} />}
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
          name={'companySectorId'}
          render={({ field: { onChange, ref }, formState: { errors } }) => {
            return (
              <Autocomplete
                defaultValue={companySectorOptions.find(
                  (option) => option.id === initialData.companySectorId
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={companySectorOptions}
                onChange={(_, value) => {
                  onChange(value?.id)
                  // Reset selected sub sectors when changeing the sector
                  setValue(
                    'companySubSectorIds',
                    initialData.companySubSectorIds
                  )
                }}
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
          render={({
            field: { onChange, ref, value: selectedIds },
            formState: { errors },
          }) => {
            const companySectorId = watch('companySectorId')
            const companySubSectorsOptions =
              (companySectorId &&
                sectorsData &&
                sectorsData.sectors
                  .find((sector) => sector.id === companySectorId)
                  ?.subsectors?.map((subsector) => ({
                    id: subsector.id,
                    label: subsector.name,
                  }))) ||
              []

            const selectedValues = companySubSectorsOptions.filter(
              (option) => selectedIds.indexOf(option.id) !== -1
            )

            return (
              <Autocomplete
                multiple
                options={companySubSectorsOptions}
                noOptionsText={'Please select a sector first'}
                disableCloseOnSelect
                value={selectedValues}
                renderTags={(items, getTagProps) => {
                  return items.map(({ id, label }, index) => {
                    return (
                      <Chip
                        {...getTagProps({ index })}
                        color={'secondary'}
                        key={id}
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
                  onChange(items.map(({ id }) => id))
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
