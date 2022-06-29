import { Box, Step, StepLabel, Stepper, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { FormLayout } from '@/common/components/FormLayout'
import { H1_DEFAULT_SPACING } from '@/theme/utils'

import {
  CompanyProfileProvider,
  useCompanyProfileContext,
} from './CompanyProfileContext'
import { Step1 } from './Step1'

export const CompanyProfileStepper = () => {
  const { activeStep } = useCompanyProfileContext()
  const { t } = useTranslation()

  return (
    <>
      <Stepper activeStep={activeStep}>
        <Step>
          <StepLabel>
            {t('companyCompletionForm.stepTitles.identification')}
          </StepLabel>
        </Step>
      </Stepper>
      <Box
        mt={{ xs: 8, sm: 10, md: 11 }}
        display={activeStep !== 0 ? 'none' : undefined}
      >
        <Step1 />
      </Box>
    </>
  )
}

export type CompanyProfileSection = Record<string, never>

export const CompanyProfileSection = () => {
  const { t } = useTranslation()
  return (
    <FormLayout showHeroImage={false}>
      <Typography component={'h1'} variant={'h1'} mb={H1_DEFAULT_SPACING}>
        {t('companyCompletionForm.completeAccount')}
      </Typography>
      <CompanyProfileProvider>
        <CompanyProfileStepper />
      </CompanyProfileProvider>
    </FormLayout>
  )
}
