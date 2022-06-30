import { Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { FormLayout } from '@/common/components/FormLayout'

import { ForecastProvider } from './ForecastContext'
import { ForecastStepper } from './FormStepper'

export type ForecastSection = Record<string, never>

export const ForecastSection = (_: ForecastSection): React.ReactElement => {
  const { t } = useTranslation()

  return (
    <FormLayout>
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
