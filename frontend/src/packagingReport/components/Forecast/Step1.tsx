import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Stack, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { add, isValid } from 'date-fns'
import { useTranslation } from 'next-i18next'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { SchemaOf } from 'yup'

import {
  TimeframeType,
  useHasOverlappingPackagingReportsQuery,
} from '@/api/__types__'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { ErrorAlert } from '@/common/components/ErrorAlert'
import { FormStep, FormStepContainer } from '@/common/components/FormStep'
import { DEFAULT_FORM_SPACING } from '@/common/components/FormStep/constants'
import {
  requiredDateValidator,
  requiredStringValidator,
} from '@/utils/form/form-validation.utils'
import { pick } from '@/utils/typescript.utils'
import { startOfNextMonth } from '@/utils/utils.date'

import {
  forecastTimeframeOptions,
  timeframeNumberValue,
} from '../../../common/contants'
import { useForecastContext } from './ForecastContext'
import { ForecastData } from './types'

const FIELD_NAMES = ['startDate', 'timeframe'] as const

type FieldName = (typeof FIELD_NAMES)[number]
type FormData = Pick<ForecastData, FieldName>

export type Step1 = Record<string, never>

const schema: SchemaOf<Record<keyof FormData, unknown>> = yup
  .object()
  .shape({
    startDate: requiredDateValidator()
      .typeError('validations.reportStartDateValid')
      .min(startOfNextMonth(), 'validations.startDateMin')
      .nullable(),
    timeframe: requiredStringValidator(),
  })
  .test({
    name: 'reportNotExceedingOneYear',
    test: function ({ startDate, timeframe }) {
      if (startDate && timeframe) {
        const startMonth = startDate.getMonth() + 1
        const timeframeValue = timeframeNumberValue[timeframe as TimeframeType]

        if (startMonth + (timeframeValue - 1) > 12) {
          return this.createError({
            path: `timeframe`,
            message: 'validations.reportExceedsOneYear',
          })
        }
      }
      return true
    },
  })

const resolver = yupResolver(schema)

export const Step1 = (_: Step1) => {
  const { initialData, onSubmit, isTimeframeReadonly, packagingReportId } =
    useForecastContext()
  const { t } = useTranslation()

  const { handleSubmit, control, watch } = useForm<FormData>({
    mode: 'onTouched',
    // in Report edit form, the start date validations is not relevant.
    // (in create case the start date should be in the future)
    // we don't send this info in the edit mutation
    resolver: isTimeframeReadonly ? undefined : resolver,
    defaultValues: pick(initialData, ...FIELD_NAMES),
  })

  const { timeframe, startDate } = watch()

  const year = startDate.getFullYear()
  const startMonth = startDate.getMonth() + 1

  const errorMsg = (translationKey: string | undefined): string | undefined =>
    translationKey && (t(translationKey) as string)

  const {
    data,
    error: errorCheckingOverlapping,
    loading: checkingOverlapping,
  } = useHasOverlappingPackagingReportsQuery({
    variables: { packagingReportId, year, startMonth, timeframe },
  })

  const hasOverlappingPackagingReports =
    data?.hasOverlappingPackagingReports ?? false

  return (
    <FormStep onSubmit={handleSubmit(onSubmit)} isLoading={checkingOverlapping}>
      <FormStepContainer
        title={t('reportForm.step1Title')}
        description={
          isTimeframeReadonly
            ? t('reportForm.step1ReadonlyDescription')
            : t('reportForm.step1Description')
        }
      >
        <Stack spacing={DEFAULT_FORM_SPACING}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              control={control}
              name={'startDate'}
              render={({
                field: { onChange, ref, value },
                formState: { errors },
              }) => {
                return (
                  <DatePicker
                    autoFocus
                    inputFormat={'MMM yyyy'}
                    views={['month', 'year']}
                    minDate={add(new Date(), { months: 1 })} // starting from next month
                    onChange={(value) => {
                      isValid(value) && !!value
                        ? // starting from beginning of the month
                          onChange(
                            new Date(value.getFullYear(), value.getMonth(), 1)
                          )
                        : onChange(value)
                    }}
                    readOnly={isTimeframeReadonly}
                    value={value}
                    inputRef={ref}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('reportForm.startDate')}
                        fullWidth
                        error={!!errors?.startDate}
                        helperText={errorMsg(errors?.startDate?.message)}
                        required
                      />
                    )}
                  />
                )
              }}
            />
          </LocalizationProvider>
          <Controller
            control={control}
            name={'timeframe'}
            render={({ field: { onChange, ref }, formState: { errors } }) => {
              return (
                <Autocomplete
                  defaultValue={forecastTimeframeOptions(t).find(
                    (option) => option.value === initialData.timeframe
                  )}
                  options={forecastTimeframeOptions(t)}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  readOnly={isTimeframeReadonly}
                  onChange={(_, item) => onChange(item?.value)}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        inputRef={ref}
                        label={t('reportForm.timeframe')}
                        error={!!errors?.timeframe}
                        helperText={errorMsg(errors?.timeframe?.message)}
                        fullWidth
                        required
                      />
                    )
                  }}
                />
              )
            }}
          />
          {errorCheckingOverlapping && (
            <ApolloErrorAlert error={errorCheckingOverlapping} />
          )}
          {hasOverlappingPackagingReports && (
            <ErrorAlert title={t('error')}>
              {t('serverErrors.timeframeOverlap')}
            </ErrorAlert>
          )}
        </Stack>
      </FormStepContainer>
    </FormStep>
  )
}
