import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
} from '@mui/material'
import { useTranslation } from 'next-i18next'

import { FormLayout } from '@/common/components/FormLayout'

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
