import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
} from '@mui/material'

import { FormLayout } from '@/common/components/FormLayout'

import {
  RegistrationProvider,
  useRegistrationContext,
} from './RegistrationContext'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from './Step3'
import { Step4 } from './Step4'

export const RegistrationStepper = () => {
  const { activeStep } = useRegistrationContext()
  return (
    <Stepper activeStep={activeStep} orientation={'vertical'}>
      <Step>
        <StepLabel>{'General company information'}</StepLabel>
        <StepContent TransitionProps={{ unmountOnExit: false }}>
          <Step1 />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>{'Company address'}</StepLabel>
        <StepContent TransitionProps={{ unmountOnExit: false }}>
          <Step2 />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>{'Contact person'}</StepLabel>
        <StepContent TransitionProps={{ unmountOnExit: false }}>
          <Step3 />
        </StepContent>
      </Step>
      <Step>
        <StepLabel>{'Password'}</StepLabel>
        <StepContent TransitionProps={{ unmountOnExit: false }}>
          <Step4 />
        </StepContent>
      </Step>
    </Stepper>
  )
}

export type RegistrationSection = Record<string, never>

export const RegistrationSection = () => {
  return (
    <FormLayout>
      <Typography
        component={'h1'}
        variant={'h4'}
        mb={{ xs: 8, sm: 10, md: 11 }}
      >
        {'Create new account'}
      </Typography>
      <RegistrationProvider>
        <RegistrationStepper />
      </RegistrationProvider>
    </FormLayout>
  )
}
