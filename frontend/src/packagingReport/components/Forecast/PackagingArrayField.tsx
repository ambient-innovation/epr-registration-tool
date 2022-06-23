import AddIcon from '@mui/icons-material/Add'
import { Autocomplete, Button, Divider, Stack, TextField } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { Controller, useFieldArray } from 'react-hook-form'
import { Control } from 'react-hook-form/dist/types/form'

import { MaterialType, PackagingGroupType } from '@/api/__types__'
import { FormStepContainer } from '@/common/components/FormStep'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'

import { MaterialArrayField } from './MaterialArrayField'
import { FormData } from './Step2'
import { ForecastData } from './types'

export interface PackagingArrayField {
  control: Control<FormData>
  readOnly: boolean
  defaultValues: ForecastData['packagingRecords']
  packagingGroups: Array<PackagingGroupType>
  packagingMaterials: Array<MaterialType>
}

export const PackagingArrayField = ({
  control,
  readOnly,
  defaultValues,
  packagingGroups,
  packagingMaterials,
}: PackagingArrayField) => {
  const { t } = useTranslation()

  const { fields, append, remove } = useFieldArray({
    name: 'packagingRecords',
    control,
  })
  const errorMsg = (translationKey: string | undefined): string | undefined =>
    translationKey && (t(translationKey) as string)

  return (
    <>
      {fields.map((item, index) => (
        <FormStepContainer
          key={item?.id}
          title={t('reportForm.packagingEntryNum', { num: index + 1 })}
          description={t('reportForm.packagingEntryDescription')}
          role={'listitem'}
        >
          <Stack spacing={DEFAULT_FORM_SPACING}>
            <>
              {index !== 0 && (
                <Button
                  variant={'text'}
                  color={'error'}
                  onClick={() => remove(index)}
                  disabled={readOnly}
                >
                  {t('reportForm.deleteEntry')}
                </Button>
              )}
              <Controller
                control={control}
                name={`packagingRecords.${index}.packagingGroupId`}
                render={({
                  field: { onChange, ref },
                  formState: { errors },
                }) => {
                  return (
                    <Autocomplete
                      defaultValue={packagingGroups.find(
                        (option) =>
                          option.id === defaultValues?.[index]?.packagingGroupId
                      )}
                      readOnly={readOnly}
                      options={packagingGroups}
                      onChange={(_, option) => onChange(option?.id)}
                      getOptionLabel={(option) => option?.name}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            inputRef={ref}
                            label={t('reportForm.packagingGroup')}
                            error={
                              !!errors.packagingRecords?.[index]
                                ?.packagingGroupId
                            }
                            helperText={errorMsg(
                              errors.packagingRecords?.[index]?.packagingGroupId
                                ?.message
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
              <Divider />
              <Stack spacing={DEFAULT_FORM_SPACING} role={'list'}>
                <MaterialArrayField
                  readOnly={readOnly}
                  packagingMaterials={packagingMaterials}
                  nestIndex={index}
                  {...{ control, defaultValues }}
                />
              </Stack>
            </>
          </Stack>
        </FormStepContainer>
      ))}

      <Button
        variant={'contained'}
        disabled={readOnly}
        startIcon={<AddIcon />}
        sx={{ alignSelf: 'start' }}
        onClick={() =>
          append({
            packagingGroupId: '',
            materialRecords: [{ materialId: '', quantity: 0 }],
          })
        }
      >
        {t('reportForm.addEntry')}
      </Button>
    </>
  )
}
