import { Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { FormLayout } from '@/common/components/FormLayout'
import { BackButton } from '@/common/components/backButton'
import { ROUTES } from '@/routes'

import { ForecastProvider } from './ForecastContext'
import { ForecastStepper } from './FormStepper'

export type ForecastSection = Record<string, never>

export const ForecastSection = (_: ForecastSection): React.ReactElement => {
  const { t } = useTranslation()

  return (
    <FormLayout>
      <div>
        <BackButton
          url={ROUTES.dashboard}
          label={t('backToDashboard')}
          style={{
            marginBottom: { xs: 8, lg: 11 },
          }}
        />
      </div>
      <Typography
        component={'h1'}
        variant={'h1'}
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
