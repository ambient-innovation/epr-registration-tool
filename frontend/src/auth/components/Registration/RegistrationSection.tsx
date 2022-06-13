import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
} from '@mui/material'
import { useTranslation } from 'next-i18next'

import { FormLayout } from '@/common/components/FormLayout'

import {
  RegistrationProvider,
  useRegistrationContext,
} from './RegistrationContext'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from './Step3'

export const RegistrationStepper = () => {
  const { activeStep } = useRegistrationContext()
  const { t } = useTranslation()

  return (
    <Stepper activeStep={activeStep} orientation={'vertical'}>
      <Step>
        <StepLabel>{t('registrationForm.generalCompanyInformation')}</StepLabel>
        <StepContent TransitionProps={{ unmountOnExit: false }}>
          <Step1 />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>{t('registrationForm.contactPerson')}</StepLabel>
        <StepContent TransitionProps={{ unmountOnExit: false }}>
          <Step2 />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>{t('password')}</StepLabel>
        <StepContent TransitionProps={{ unmountOnExit: false }}>
          <Step3 />
        </StepContent>
      </Step>
    </Stepper>
  )
}

export type RegistrationSection = Record<string, never>

export const RegistrationSection = () => {
  const { t } = useTranslation()

  return (
    <FormLayout>
      <Typography
        component={'h1'}
        variant={'h4'}
        mb={{ xs: 8, sm: 10, md: 11 }}
      >
        {t('registrationForm.createNewAccount')}
      </Typography>
      <RegistrationProvider>
        <RegistrationStepper />
      </RegistrationProvider>
    </FormLayout>
  )
}
