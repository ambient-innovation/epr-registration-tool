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

import {
  PackagingGroupInput,
  usePackagingReportForecastDetailsQuery,
} from '@/api/__types__'
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
  const { id: packagingReportId } = router.query
  const { data, loading } = usePackagingReportForecastDetailsQuery({
    variables: { packagingReportId: packagingReportId as string },
    fetchPolicy: 'cache-and-network',
  })
  const packagingReport = data?.packagingReport ?? undefined

  if (loading) {
    return <LoadingState />
  }
  if (!packagingReport || !packagingReport.forecast) {
    return <Error statusCode={404} />
  }

  // group materials by packagingGroup
  // todo usememo
  const defaultData: ForecastData = {
    startDate: new Date(
      packagingReport?.year,
      packagingReport?.startMonth - 1,
      1
    ),
    timeframe: packagingReport.timeframe,
    packagingRecords: packagingReport.forecast?.materialRecords.reduce(
      (acc, current) => {
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
      },
      [] as Array<PackagingGroupInput>
    ),
  }

  return (
    <FormLayout>
      <Typography
        component={'h1'}
        variant={'h4'}
        mb={{ xs: 8, sm: 10, md: 11 }}
      >
        {t('reportForm.formLabel')}
      </Typography>
      <ForecastProvider
        defaultData={defaultData}
        packagingReportId={packagingReportId as string}
      >
        <ForecastStepper />
      </ForecastProvider>
    </FormLayout>
  )
}
