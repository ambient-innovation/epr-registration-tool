import { Alert, Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

import { FormLayout } from '@/common/components/FormLayout'
import { ROUTES } from '@/routes'
import { H1_DEFAULT_SPACING } from '@/theme/utils'

export const ActivationComplete = (): React.ReactElement => {
  const { t } = useTranslation()
  return (
    <FormLayout>
      <Typography component={'h1'} variant={'h1'} mb={H1_DEFAULT_SPACING}>
        {t('activation.registrationComplete')}
      </Typography>
      <Alert severity={'success'}>
        {t('activation.accountHasBeenActivated')}
      </Alert>
      <Box mt={5} p={8} bgcolor={'background.light'} borderRadius={3}>
        <Typography component={'h2'} variant={'h3'}>
          {t('activation.accountIsReady')}
        </Typography>
        <Typography mt={3}>{t('activation.youCanLoginNow')}</Typography>
        <Box mt={7}>
          <Link href={ROUTES.login} passHref>
            <Button variant={'contained'}>{t('login')}</Button>
          </Link>
        </Box>
      </Box>
    </FormLayout>
  )
}
