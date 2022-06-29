import {
  Box,
  Divider,
  Typography,
  Button,
  Stack,
  Skeleton,
} from '@mui/material'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

import { UserType } from '@/api/__types__'
import { ROUTES } from '@/routes'

export type DashboardHeader = {
  user: null | Pick<UserType, 'fullName' | 'title'>
  canAddReport: boolean
}

export const DashboardHeader = ({
  user,
  canAddReport,
}: DashboardHeader): React.ReactElement => {
  const { t } = useTranslation()

  return (
    <Box sx={{ marginTop: 11 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent={'space-between'}
      >
        <Box>
          <Typography variant={'h1'}>{t('dashboard.main')}</Typography>
          {user ? (
            <Typography variant={'overline'}>
              {t('dashboard.header.greeting', {
                userName: `${user.title} ${user.fullName}`,
              })}
            </Typography>
          ) : (
            <Skeleton width={250} />
          )}
        </Box>
        <Box sx={{ mt: { xs: 6, sm: 0 } }}>
          {canAddReport ? (
            <Link href={ROUTES.forecast}>
              <Button component={'a'} variant={'contained'}>
                {t('dashboard.header.submitNewReport')}
              </Button>
            </Link>
          ) : (
            <Button variant={'contained'} disabled>
              {t('dashboard.header.submitNewReport')}
            </Button>
          )}
        </Box>
      </Stack>
      <Divider sx={{ mt: 6 }} />
    </Box>
  )
}
