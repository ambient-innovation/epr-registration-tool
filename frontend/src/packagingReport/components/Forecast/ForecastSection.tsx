import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
} from '@mui/material'
import { useTranslation } from 'next-i18next'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import {
  PackagingGroupInput,
  usePackagingReportForecastDetailsQuery,
} from '@/api/__types__'
import { ApolloErrorAlert } from '@/common/components/ApolloErrorAlert'
import { FormLayout } from '@/common/components/FormLayout'
import { LoadingState } from '@/common/components/LoadingState'
import { ForecastData } from '@/packagingReport/components/Forecast/types'

import { ForecastProvider, useForecastContext } from './ForecastContext'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from './Step3'

export type ForecastStepper = Record<string, never>
export const ForecastStepper = (_: ForecastStepper): React.ReactElement => {
  const { activeStep } = useForecastContext()
  const { t } = useTranslation()
  return (
    <Stepper activeStep={activeStep} orientation={'vertical'}>
      <Step>
        <StepLabel>{t('reportForm.timeframe')}</StepLabel>
        <StepContent TransitionProps={{ unmountOnExit: false }}>
          <Step1 />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>{t('reportForm.packagingDetails')}</StepLabel>
        <StepContent TransitionProps={{ unmountOnExit: false }}>
          <Step2 />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>{t('reportForm.estimatedFees')}</StepLabel>
        <StepContent TransitionProps={{ unmountOnExit: false }}>
          <Step3 />
        </StepContent>
      </Step>
    </Stepper>
  )
}

export type ForecastSection = Record<string, never>

export const ForecastSection = (_: ForecastSection): React.ReactElement => {
  const { t } = useTranslation()

  return (
    <FormLayout>
      <Typography
        component={'h1'}
        variant={'h4'}
        mb={{ xs: 8, sm: 10, md: 11 }}
      >
        {t('reportForm.formLabel')}
      </Typography>
      <ForecastProvider>
        <ForecastStepper />
      </ForecastProvider>
    </FormLayout>
  )
}

export type ForecastChangeSection = Record<string, never>

export const ForecastChangeSection = (
  _: ForecastChangeSection
): React.ReactElement => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id: packagingReportId } = router.query as { id: string }
  const { data, loading, error } = usePackagingReportForecastDetailsQuery({
    variables: { packagingReportId: packagingReportId },
    // user will update this report, so it should be updated in the cache also after submit.
    fetchPolicy: 'cache-and-network',
  })
  const packagingReport = data?.packagingReport ?? undefined

  // group materials by packagingGroup
  const defaultData: ForecastData | undefined = useMemo(
    () =>
      packagingReport && {
        startDate: new Date(
          packagingReport?.year,
          packagingReport?.startMonth - 1,
          1
        ),
        timeframe: packagingReport.timeframe,
        packagingRecords: !packagingReport.forecast?.materialRecords.length
          ? []
          : packagingReport.forecast?.materialRecords.reduce((acc, current) => {
              const {
                quantity,
                packagingGroup: { id: packagingGroupId },
                packagingMaterial: { id: materialId },
              } = current
              const materialObj = { quantity, materialId }
              const groupIndex = acc.findIndex(
                (item) => item.packagingGroupId === packagingGroupId
              )
              if (groupIndex === -1) {
                acc = [
                  ...acc,
                  { packagingGroupId, materialRecords: [{ ...materialObj }] },
                ]
              } else {
                acc[groupIndex] = {
                  packagingGroupId,
                  materialRecords: [
                    ...acc[groupIndex].materialRecords,
                    { ...materialObj },
                  ],
                }
              }
              return acc
            }, [] as Array<PackagingGroupInput>),
      },
    [packagingReport]
  )
  return (
    <FormLayout>
      <Typography
        component={'h1'}
        variant={'h4'}
        mb={{ xs: 8, sm: 10, md: 11 }}
      >
        {t('reportForm.formLabel')}
      </Typography>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ApolloErrorAlert error={error} />
      ) : !packagingReport || !packagingReport.forecast || !defaultData ? (
        <Error statusCode={404} />
      ) : (
        <ForecastProvider
          defaultData={defaultData}
          packagingReportId={packagingReportId}
        >
          <ForecastStepper />
        </ForecastProvider>
      )}
    </FormLayout>
  )
}
