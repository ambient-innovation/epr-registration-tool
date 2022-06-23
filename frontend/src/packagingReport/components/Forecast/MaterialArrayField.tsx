import AddIcon from '@mui/icons-material/Add'
import {
  Autocomplete,
  Button,
  Divider,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import { useTranslation } from 'next-i18next'
import { Controller, useFieldArray } from 'react-hook-form'
import { Control } from 'react-hook-form/dist/types/form'

import { MaterialType } from '@/api/__types__'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'

import { FormData } from './Step2'
import { ForecastData } from './types'

export interface MaterialArrayField {
  control: Control<FormData>
  readOnly: boolean
  nestIndex: number
  defaultValues: ForecastData['packagingRecords']
  packagingMaterials: Array<MaterialType>
}

export const MaterialArrayField = ({
  control,
  readOnly,
  nestIndex,
  defaultValues,
  packagingMaterials,
}: MaterialArrayField) => {
  const { t } = useTranslation()

  const { fields, append } = useFieldArray({
    control,
    name: `packagingRecords.${nestIndex}.materialRecords`,
  })
  const errorMsg = (translationKey: string | undefined): string | undefined =>
    translationKey && (t(translationKey) as string)

  return (
    <>
      {fields.map((item, index) => (
        <Stack key={item?.id} spacing={DEFAULT_FORM_SPACING} role={'listitem'}>
          <Controller
            control={control}
            name={`packagingRecords.${nestIndex}.materialRecords.${index}.materialId`}
            render={({ field: { onChange, ref }, formState: { errors } }) => {
              return (
                <Autocomplete
                  defaultValue={packagingMaterials.find(
                    (option) =>
                      option.id ===
                      defaultValues?.[nestIndex]?.materialRecords?.[index]
                        ?.materialId
                  )}
                  readOnly={readOnly}
                  options={packagingMaterials}
                  onChange={(_, option) => onChange(option?.id)}
                  getOptionLabel={(option) => option?.name}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        inputRef={ref}
                        label={t('reportForm.material')}
                        error={
                          !!errors.packagingRecords?.[nestIndex]
                            ?.materialRecords?.[index]?.materialId
                        }
                        helperText={errorMsg(
                          errors.packagingRecords?.[nestIndex]
                            ?.materialRecords?.[index]?.materialId?.message
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
          <Controller
            control={control}
            name={`packagingRecords.${nestIndex}.materialRecords.${index}.quantity`}
            render={({
              field: { onChange, ref, value },
              formState: { errors },
            }) => (
              <TextField
                disabled={readOnly}
                label={'Quantity'}
                inputRef={ref}
                value={value}
                error={
                  !!errors.packagingRecords?.[nestIndex]?.materialRecords?.[
                    index
                  ]?.quantity
                }
                helperText={errorMsg(
                  errors.packagingRecords?.[nestIndex]?.materialRecords?.[index]
                    ?.quantity?.message
                )}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position={'start'}>
                      {t('kg')}
                    </InputAdornment>
                  ),
                }}
                onChange={onChange}
              />
            )}
          />
          <Divider />
        </Stack>
      ))}
      <Button
        variant={'text'}
        startIcon={<AddIcon />}
        disabled={readOnly}
        sx={{ alignSelf: 'start' }}
        onClick={() =>
          append({
            materialId: '',
            quantity: 0,
          })
        }
      >
        {t('reportForm.addMaterial')}
      </Button>
    </>
  )
}
