import { Typography } from '@mui/material'
import { Grid } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'

import { usePackagingReportFeesEstimationQuery } from '@/api/__types__'
import { FormStep, FormStepContainer } from '@/common/components/FormStep'
import { fontWeights } from '@/theme/typography'

import { timeframeDisplayValue } from '../../../common/contants'
import { useForecastContext } from './ForecastContext'

export type Step3 = Record<string, never>

export const Step3 = (_: Step3) => {
  const {
    data,
    goToPrevStep,
    onSubmit,
    error,
    activeStep,
    isReadonlyForm,
    fees: finalFees,
  } = useForecastContext()
  const { startDate, timeframe } = data
  const year = startDate.getFullYear()
  const startMonth = startDate.getMonth() + 1

  const { data: feesData, loading } = usePackagingReportFeesEstimationQuery({
    variables: {
      year,
      startMonth,
      timeframe,
      packagingRecords: data.packagingRecords,
    },
    skip: activeStep !== 2 || !!finalFees,
  })
  const { t } = useTranslation()
  const { handleSubmit, formState } = useForm({
    mode: 'onTouched',
  })
  const fees = feesData?.fees || finalFees

  return (
    <FormStep
      onClickBack={goToPrevStep}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={
        formState.isSubmitting || (formState.isSubmitSuccessful && !error)
      }
      isFinalStep
      apolloError={error}
      readOnly={isReadonlyForm}
    >
      <FormStepContainer
        title={t('reportForm.step3Title')}
        description={t('reportForm.step3Description')}
      >
        <Grid container justifyContent={'start'} alignItems={'center'}>
          {loading ? (
            <Grid item>
              <Typography variant={'h5'}>
                {t('reportForm.calculating')}
              </Typography>
            </Grid>
          ) : (
            <>
              <Grid item>
                <Typography variant={'h5'}>
                  {t('reportForm.estimatedFeesResult', { fees }) + ' / '}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant={'h5'}
                  sx={{ fontWeight: fontWeights.regular }}
                >
                  {timeframeDisplayValue(t)[data.timeframe]}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
        <Typography
          variant={'subtitle2'}
          mt={{ xs: 5, sm: 6 }}
          sx={{ fontWeight: fontWeights.light }}
        >
          {t('reportForm.netPricePlusVat')}
        </Typography>
      </FormStepContainer>
    </FormStep>
  )
}
