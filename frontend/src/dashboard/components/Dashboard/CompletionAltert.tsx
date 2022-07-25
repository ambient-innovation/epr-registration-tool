import { ArrowForwardRounded } from '@mui/icons-material'
import { Alert, AlertTitle, Button, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'

import { ROUTES } from '@/routes'

export type CompletionAlert = Record<string, never>

export const CompletionAlert = (_: CompletionAlert): React.ReactElement => {
  const { t } = useTranslation()
  return (
    <Alert
      sx={{ marginTop: 8 }}
      severity={'error'}
      action={
        <NextLink href={ROUTES.accountSettingsChangeCompanyData} passHref>
          <Button
            component={'a'}
            color={'inherit'}
            endIcon={<ArrowForwardRounded />}
            size={'small'}
          >
            {t('dashboard.completionAlert.link')}
          </Button>
        </NextLink>
      }
    >
      <AlertTitle>
        {t('dashboard.completionAlert.completeYourProfile')}
      </AlertTitle>
      <Typography variant={'body2'}>
        {t('dashboard.completionAlert.dataNeeded')}
      </Typography>
    </Alert>
  )
}
