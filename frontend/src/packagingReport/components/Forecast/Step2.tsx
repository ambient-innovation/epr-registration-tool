import { yupResolver } from '@hookform/resolvers/yup'
import { Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import { usePackagingBaseDataQuery } from '@/api/__types__'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { FormStep } from '@/common/components/FormStep'
import { LoadingState } from '@/common/components/LoadingState'
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
      // check if groups are duplicated
      const groupsArr = packagingRecords?.map(function (item) {
        return item.packagingGroupId
      })
      let duplicatedGroupIndex = -1
      const isGroupDuplicate = groupsArr?.some(function (item, idx) {
        const duplicated = groupsArr.indexOf(item) != idx
        if (duplicated) {
          duplicatedGroupIndex = idx
        }
        return duplicated
      })
      if (isGroupDuplicate) {
        return this.createError({
          path: `packagingRecords.${duplicatedGroupIndex}.packagingGroupId`,
          message: 'validations.notUniqueGroups',
        })
      }
      // check if group materials are duplicated
      let duplicatedMaterialIndex = -1
      const isMaterialDuplicate = packagingRecords?.some((group, index) => {
        const materialArr = group.materialRecords?.map(function (item) {
          return item.materialId
        })
        duplicatedGroupIndex = index

        return materialArr?.some(function (item, idx) {
          const duplicated = materialArr.indexOf(item) != idx
          if (duplicated) {
            duplicatedMaterialIndex = idx
          }
          return duplicated
        })
      })

      if (isMaterialDuplicate) {
        return this.createError({
          path: `packagingRecords.${duplicatedGroupIndex}.materialRecords.${duplicatedMaterialIndex}.materialId`,
          message: 'validations.notUniqueGroupsMaterials',
        })
      }
      return true
    },
  })

const resolver = yupResolver(schema)

export const Step2 = (_: Step2) => {
  const { initialData, onSubmit, goToPrevStep, isReadonlyForm } =
    useForecastContext()
  const defaultValues = pick(initialData, ...FIELD_NAMES)
  const { data, loading, error } = usePackagingBaseDataQuery()

  const packagingGroups = data?.packagingGroups || []
  const packagingMaterials = data?.packagingMaterials || []
  const { handleSubmit, control } = useForm<FormData>({
    mode: 'onTouched',
    resolver,
    defaultValues,
  })

  if (loading) {
    return <LoadingState />
  }

  return (
    <FormStep onSubmit={handleSubmit(onSubmit)} onClickBack={goToPrevStep}>
      {!!error ? (
        <ApolloErrorAlert error={error} />
      ) : (
        <Stack spacing={8} role={'list'}>
          <PackagingArrayField
            readOnly={isReadonlyForm}
            control={control}
            defaultValues={defaultValues.packagingRecords}
            packagingGroups={packagingGroups}
            packagingMaterials={packagingMaterials}
          />
        </Stack>
      )}
    </FormStep>
  )
}
