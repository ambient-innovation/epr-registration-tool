import { yupResolver } from '@hookform/resolvers/yup'
import { Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import { FormStep } from '@/common/components/FormStep'
import { pick } from '@/utils/typescript.utils'

import { useForecastContext } from './ForecastContext'
import { PackagingArrayField } from './PackagingArrayField'
import { ForecastData } from './types'

const FIELD_NAMES = ['packagingRecords'] as const

type FieldName = typeof FIELD_NAMES[number]
export type FormData = Pick<ForecastData, FieldName>

export type Step2 = Record<string, never>

const schema: SchemaOf<Record<keyof FormData, unknown>> = yup
  .object()
  .shape({
    packagingRecords: yup
      .array()
      .of(
        yup.object().shape({
          packagingGroupId: yup.string().required('validations.required'),
          materialRecords: yup
            .array()
            .of(
              yup.object().shape({
                materialId: yup.string().required('validations.required'),
                quantity: yup
                  .number()
                  .typeError('validations.numberType')
                  .required('validations.required')
                  .moreThan(0, 'validations.greaterThanZero'),
              })
            )
            .min(1, 'validations.atLeastOnPackagingMaterial'),
        })
      )
      .min(1, 'validations.atLeastOnPackagingGroup'),
  })
  .test({
    message: 'unique',
    test: function ({ packagingRecords }) {
      const valueArr = packagingRecords?.map(function (item) {
        return item.packagingGroupId
      })
      let duplicatedGroupIndex = 0
      const isDuplicate = valueArr?.some(function (item, idx) {
        const duplicated = valueArr.indexOf(item) != idx
        if (duplicated) {
          duplicatedGroupIndex = idx
        }
        return duplicated
      })
      return isDuplicate
        ? this.createError({
            path: `packagingRecords.${duplicatedGroupIndex}.packagingGroupId`,
            message: 'validations.notUniqueGroups',
          })
        : true
    },
  })

const resolver = yupResolver(schema)

export const Step2 = (_: Step2) => {
  const { initialData, onSubmit, goToPrevStep } = useForecastContext()
  const defaultValues = pick(initialData, ...FIELD_NAMES)
  const { handleSubmit, control } = useForm<FormData>({
    mode: 'onTouched',
    resolver,
    defaultValues,
  })

  return (
    <FormStep onSubmit={handleSubmit(onSubmit)} onClickBack={goToPrevStep}>
      <Stack spacing={8} role={'list'}>
        <PackagingArrayField
          control={control}
          defaultValues={defaultValues.packagingRecords}
        />
      </Stack>
    </FormStep>
  )
}