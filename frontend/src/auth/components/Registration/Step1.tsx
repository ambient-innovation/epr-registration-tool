import { yupResolver } from '@hookform/resolvers/yup'
import { Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import { FormStep } from '@/common/components/FormStep'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import { SelectField } from '@/common/components/SelecField'
import {
  companyRegistrationNumberValidator,
  requiredStringValidator,
} from '@/utils/form-validation.utils'

import { initialData, useRegistrationContext } from './RegistrationContext'
import { RegistrationData } from './types'

const companySectorOptions = [
  {
    value: 'sector1',
    label: 'Sector1',
  },
  {
    value: 'sector2',
    label: 'Sector2',
  },
  {
    value: 'sector3',
    label: 'Sector3',
  },
  {
    value: 'sector4',
    label: 'Sector4',
  },
]
const companySubSectorOptions = [
  {
    value: 'subsector1',
    label: 'SubSector1',
  },
  {
    value: 'subsector2',
    label: 'SubSector2',
  },
  {
    value: 'subsector3',
    label: 'SubSector3',
  },
  {
    value: 'subsector4',
    label: 'SubSector4',
  },
]
const FIELD_NAMES = [
  'companyName',
  'companyRegistrationNumber',
  'companySector',
  'companySubSector',
] as const

type FieldName = typeof FIELD_NAMES[number]
type FormData = Pick<RegistrationData, FieldName>

export type Step1 = Record<string, never>

const schema: SchemaOf<Record<keyof FormData, string>> = yup.object().shape({
  companyName: requiredStringValidator(),
  companyRegistrationNumber: companyRegistrationNumberValidator(),
  companySector: requiredStringValidator(),
  companySubSector: requiredStringValidator(),
})

const resolver = yupResolver(schema)

export const Step1 = (_: Step1) => {
  const { data, onSubmit } = useRegistrationContext()

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
        <SelectField
          label={'Sector'}
          error={!!errors?.companySector}
          helperText={errors?.companySector?.message}
          inputProps={register('companySector')}
          options={companySectorOptions}
          defaultValue={initialData.companySector}
          required
          fullWidth
          {...register('companySector')}
        />
        <SelectField
          label={'Subsector'}
          error={!!errors?.companySubSector}
          helperText={errors?.companySubSector?.message}
          inputProps={register('companySubSector')}
          defaultValue={initialData.companySubSector}
          options={companySubSectorOptions}
          required
          fullWidth
          {...register('companySubSector')}
        />
      </Stack>
    </FormStep>
  )
}
